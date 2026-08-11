import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCachedResource } from '../useCachedResource'

let keyCounter = 0
const uniqueKey = () => `cache-key-${++keyCounter}`

describe('useCachedResource', () => {
  it('starts undefined and resolves to the fetched value', async () => {
    const key = uniqueKey()
    const fetcher = vi.fn().mockResolvedValue('value')

    const { result } = renderHook(() => useCachedResource(key, fetcher))

    expect(result.current[0]).toBeUndefined()
    await waitFor(() => expect(result.current[0]).toBe('value'))
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('does not call the fetcher again once the key is cached', async () => {
    const key = uniqueKey()
    const firstFetcher = vi.fn().mockResolvedValue('cached')
    const { result: first, unmount } = renderHook(() => useCachedResource(key, firstFetcher))
    await waitFor(() => expect(first.current[0]).toBe('cached'))
    unmount()

    const secondFetcher = vi.fn().mockResolvedValue('should-not-be-used')
    const { result: second } = renderHook(() => useCachedResource(key, secondFetcher))

    expect(second.current[0]).toBe('cached')
    expect(secondFetcher).not.toHaveBeenCalled()
  })

  it('ignores a fetcher result of undefined', async () => {
    const key = uniqueKey()
    const fetcher = vi.fn().mockResolvedValue(undefined)

    const { result } = renderHook(() => useCachedResource(key, fetcher))

    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1))
    expect(result.current[0]).toBeUndefined()
  })

  it('writeCache sets a direct value and is visible to later hook instances', () => {
    const key = uniqueKey()
    const { result } = renderHook(() => useCachedResource<string>(key, vi.fn().mockResolvedValue(undefined)))

    act(() => {
      result.current[1]('written')
    })

    expect(result.current[0]).toBe('written')

    const { result: other } = renderHook(() =>
      useCachedResource<string>(key, vi.fn().mockResolvedValue('unused')),
    )
    expect(other.current[0]).toBe('written')
  })

  it('writeCache supports a functional updater based on the cached value', () => {
    const key = uniqueKey()
    const { result } = renderHook(() => useCachedResource<string>(key, vi.fn().mockResolvedValue(undefined)))

    act(() => {
      result.current[1]('base')
    })
    act(() => {
      result.current[1]((prev) => `${prev}-updated`)
    })

    expect(result.current[0]).toBe('base-updated')
  })
})
