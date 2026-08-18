import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IInfoEntry } from '../../types'
import { IntlWrapper } from '../../test/intl'

const mockFetchEntries = vi.fn()
const mockInsertEntry = vi.fn()
const mockUpdateEntry = vi.fn()
const mockDeleteEntry = vi.fn()

vi.mock('../../model/Application', () => ({
  app: () => ({
    infoEntries: {
      fetchEntries: mockFetchEntries,
      insertEntry: mockInsertEntry,
      updateEntry: mockUpdateEntry,
      deleteEntry: mockDeleteEntry,
    },
  }),
}))
vi.mock('../useCachedResource', () => ({
  useCachedResource: vi.fn(),
}))

import { useCachedResource } from '../useCachedResource'
import { useInfoEntries } from '../useInfoEntries'

const mockUseCachedResource = useCachedResource as unknown as ReturnType<typeof vi.fn>

const entry: IInfoEntry = { id: '1', label: 'Label', value: 'Value' }

beforeEach(() => {
  mockFetchEntries.mockReset()
  mockInsertEntry.mockReset()
  mockUpdateEntry.mockReset()
  mockDeleteEntry.mockReset()
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

  it('fetches entries via the info entries service', () => {
    mockUseCachedResource.mockReturnValue([undefined, vi.fn()])
    renderHook(() => useInfoEntries(), { wrapper: IntlWrapper })
    expect(mockUseCachedResource).toHaveBeenCalledWith('info-entries', expect.any(Function))

    mockFetchEntries.mockResolvedValue([entry])
    const fetcher = mockUseCachedResource.mock.calls[0][1] as () => Promise<IInfoEntry[] | undefined>
    expect(fetcher()).resolves.toEqual([entry])
  })

  it('saveEntry inserts a new entry and appends it via writeEntries', async () => {
    const inserted: IInfoEntry = { id: '2', label: 'New', value: 'Val' }
    mockInsertEntry.mockResolvedValue(inserted)
    const writeEntries = vi.fn()
    mockUseCachedResource.mockReturnValue([[], writeEntries])

    const { result } = renderHook(() => useInfoEntries(), { wrapper: IntlWrapper })
    await act(async () => {
      await result.current.saveEntry({ label: 'New', value: 'Val' })
    })

    expect(mockInsertEntry).toHaveBeenCalledWith({ label: 'New', value: 'Val' })
    const updater = writeEntries.mock.calls[0][0] as (prev: IInfoEntry[] | undefined) => IInfoEntry[]
    expect(updater(undefined)).toEqual([inserted])
    expect(updater([entry])).toEqual([entry, inserted])
  })

  it('saveEntry updates an existing entry via writeEntries', async () => {
    const updated: IInfoEntry = { id: '1', label: 'Updated', value: 'V2' }
    mockUpdateEntry.mockResolvedValue(updated)
    const writeEntries = vi.fn()
    mockUseCachedResource.mockReturnValue([[entry], writeEntries])

    const { result } = renderHook(() => useInfoEntries(), { wrapper: IntlWrapper })
    await act(async () => {
      await result.current.saveEntry({ id: '1', label: 'Updated', value: 'V2' })
    })

    expect(mockUpdateEntry).toHaveBeenCalledWith('1', { label: 'Updated', value: 'V2' })
    const updater = writeEntries.mock.calls[0][0] as (prev: IInfoEntry[]) => IInfoEntry[]
    expect(updater([entry])).toEqual([updated])
  })

  it('saveEntry alerts and does not update the cache on error', async () => {
    mockInsertEntry.mockResolvedValue(undefined)
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
    mockDeleteEntry.mockResolvedValue(true)
    const writeEntries = vi.fn()
    mockUseCachedResource.mockReturnValue([[entry], writeEntries])

    const { result } = renderHook(() => useInfoEntries(), { wrapper: IntlWrapper })
    await act(async () => {
      await result.current.deleteEntry('1')
    })

    expect(mockDeleteEntry).toHaveBeenCalledWith('1')
    const updater = writeEntries.mock.calls[0][0] as (prev: IInfoEntry[]) => IInfoEntry[]
    expect(updater([entry])).toEqual([])
  })

  it('deleteEntry alerts and does not update the cache on error', async () => {
    mockDeleteEntry.mockResolvedValue(false)
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
