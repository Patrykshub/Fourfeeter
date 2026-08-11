import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IInfoEntry } from '../../types'
import { IntlWrapper } from '../../test/intl'
import { createQueryBuilder } from '../../test/supabaseQueryBuilder'

vi.mock('../../lib/supabaseClient', () => ({
  supabase: { from: vi.fn() },
}))
vi.mock('../useCachedResource', () => ({
  useCachedResource: vi.fn(),
}))

import { supabase } from '../../lib/supabaseClient'
import { useCachedResource } from '../useCachedResource'
import { useInfoEntries } from '../useInfoEntries'

const mockFrom = supabase.from as unknown as ReturnType<typeof vi.fn>
const mockUseCachedResource = useCachedResource as unknown as ReturnType<typeof vi.fn>

type Fetcher = () => Promise<IInfoEntry[] | undefined>

const entry: IInfoEntry = { id: '1', label: 'Label', value: 'Value' }

beforeEach(() => {
  mockFrom.mockReset()
  mockUseCachedResource.mockReset()
})

describe('useInfoEntries', () => {
  it('returns an empty array while there is no cached data', () => {
    mockUseCachedResource.mockReturnValue([undefined, vi.fn()])
    const { result } = renderHook(() => useInfoEntries(), { wrapper: IntlWrapper })
    expect(result.current.entries).toEqual([])
  })

  it('returns the cached entries when present', () => {
    mockUseCachedResource.mockReturnValue([[entry], vi.fn()])
    const { result } = renderHook(() => useInfoEntries(), { wrapper: IntlWrapper })
    expect(result.current.entries).toEqual([entry])
  })

  it('fetches info_entries via the cache resource fetcher', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: [entry], error: null }))
    let capturedFetcher: Fetcher | undefined
    mockUseCachedResource.mockImplementation((_key: string, fetcher: Fetcher) => {
      capturedFetcher = fetcher
      return [undefined, vi.fn()]
    })

    renderHook(() => useInfoEntries(), { wrapper: IntlWrapper })

    await expect(capturedFetcher?.()).resolves.toEqual([entry])
    expect(mockFrom).toHaveBeenCalledWith('info_entries')
  })

  it('fetcher resolves to undefined when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('boom') }))
    let capturedFetcher: Fetcher | undefined
    mockUseCachedResource.mockImplementation((_key: string, fetcher: Fetcher) => {
      capturedFetcher = fetcher
      return [undefined, vi.fn()]
    })

    renderHook(() => useInfoEntries(), { wrapper: IntlWrapper })

    await expect(capturedFetcher?.()).resolves.toBeUndefined()
  })

  it('saveEntry inserts a new entry and appends it via writeEntries', async () => {
    const inserted: IInfoEntry = { id: '2', label: 'New', value: 'Val' }
    mockFrom.mockReturnValue(createQueryBuilder({ data: inserted, error: null }))
    const writeEntries = vi.fn()
    mockUseCachedResource.mockReturnValue([[], writeEntries])

    const { result } = renderHook(() => useInfoEntries(), { wrapper: IntlWrapper })
    await act(async () => {
      await result.current.saveEntry({ label: 'New', value: 'Val' })
    })

    expect(mockFrom).toHaveBeenCalledWith('info_entries')
    const updater = writeEntries.mock.calls[0][0] as (prev: IInfoEntry[] | undefined) => IInfoEntry[]
    expect(updater(undefined)).toEqual([inserted])
    expect(updater([entry])).toEqual([entry, inserted])
  })

  it('saveEntry updates an existing entry via writeEntries', async () => {
    const updated: IInfoEntry = { id: '1', label: 'Updated', value: 'V2' }
    mockFrom.mockReturnValue(createQueryBuilder({ data: updated, error: null }))
    const writeEntries = vi.fn()
    mockUseCachedResource.mockReturnValue([[entry], writeEntries])

    const { result } = renderHook(() => useInfoEntries(), { wrapper: IntlWrapper })
    await act(async () => {
      await result.current.saveEntry({ id: '1', label: 'Updated', value: 'V2' })
    })

    const builder = mockFrom.mock.results[0].value
    expect(builder.update).toHaveBeenCalledWith({ label: 'Updated', value: 'V2' })
    expect(builder.eq).toHaveBeenCalledWith('id', '1')
    const updater = writeEntries.mock.calls[0][0] as (prev: IInfoEntry[]) => IInfoEntry[]
    expect(updater([entry])).toEqual([updated])
  })

  it('saveEntry alerts and does not update the cache on error', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))
    const writeEntries = vi.fn()
    mockUseCachedResource.mockReturnValue([[], writeEntries])
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    const { result } = renderHook(() => useInfoEntries(), { wrapper: IntlWrapper })
    await act(async () => {
      await result.current.saveEntry({ label: 'X', value: 'Y' })
    })

    expect(alertSpy).toHaveBeenCalled()
    expect(writeEntries).not.toHaveBeenCalled()
    alertSpy.mockRestore()
  })

  it('deleteEntry removes the entry via writeEntries', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: null }))
    const writeEntries = vi.fn()
    mockUseCachedResource.mockReturnValue([[entry], writeEntries])

    const { result } = renderHook(() => useInfoEntries(), { wrapper: IntlWrapper })
    await act(async () => {
      await result.current.deleteEntry('1')
    })

    const builder = mockFrom.mock.results[0].value
    expect(builder.eq).toHaveBeenCalledWith('id', '1')
    const updater = writeEntries.mock.calls[0][0] as (prev: IInfoEntry[]) => IInfoEntry[]
    expect(updater([entry])).toEqual([])
  })

  it('deleteEntry alerts and does not update the cache on error', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))
    const writeEntries = vi.fn()
    mockUseCachedResource.mockReturnValue([[entry], writeEntries])
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    const { result } = renderHook(() => useInfoEntries(), { wrapper: IntlWrapper })
    await act(async () => {
      await result.current.deleteEntry('1')
    })

    expect(alertSpy).toHaveBeenCalled()
    expect(writeEntries).not.toHaveBeenCalled()
    alertSpy.mockRestore()
  })
})
