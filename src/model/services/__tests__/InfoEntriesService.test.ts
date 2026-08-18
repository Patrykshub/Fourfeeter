import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IInfoEntry } from '../../../types'
import { createQueryBuilder } from '../../../test/supabaseQueryBuilder'

const mockFrom = vi.fn()

vi.mock('../../Application', () => ({
  app: () => ({ supabase: { from: mockFrom } }),
}))

import { InfoEntriesService } from '../InfoEntriesService'

const entry: IInfoEntry = { id: '1', label: 'Label', value: 'Value' }

let infoEntries: InfoEntriesService

beforeEach(() => {
  mockFrom.mockReset()
  infoEntries = new InfoEntriesService()
})

describe('fetchEntries', () => {
  it('returns the entries from supabase', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: [entry], error: null }))

    await expect(infoEntries.fetchEntries()).resolves.toEqual([entry])
    expect(mockFrom).toHaveBeenCalledWith('info_entries')
  })

  it('returns undefined when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('boom') }))

    await expect(infoEntries.fetchEntries()).resolves.toBeUndefined()
  })
})

describe('insertEntry', () => {
  it('inserts and returns the created entry', async () => {
    const inserted: IInfoEntry = { id: '2', label: 'New', value: 'Val' }
    const builder = createQueryBuilder({ data: inserted, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(infoEntries.insertEntry({ label: 'New', value: 'Val' })).resolves.toEqual(inserted)
    expect(mockFrom).toHaveBeenCalledWith('info_entries')
    expect(builder.insert).toHaveBeenCalledWith({ label: 'New', value: 'Val' })
  })

  it('returns undefined when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))

    await expect(infoEntries.insertEntry({ label: 'New', value: 'Val' })).resolves.toBeUndefined()
  })
})

describe('updateEntry', () => {
  it('updates and returns the updated entry', async () => {
    const updated: IInfoEntry = { id: '1', label: 'Updated', value: 'V2' }
    const builder = createQueryBuilder({ data: updated, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(infoEntries.updateEntry('1', { label: 'Updated', value: 'V2' })).resolves.toEqual(updated)
    expect(builder.update).toHaveBeenCalledWith({ label: 'Updated', value: 'V2' })
    expect(builder.eq).toHaveBeenCalledWith('id', '1')
  })

  it('returns undefined when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))

    await expect(infoEntries.updateEntry('1', { label: 'X', value: 'Y' })).resolves.toBeUndefined()
  })
})

describe('deleteEntry', () => {
  it('deletes the entry and returns true', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(infoEntries.deleteEntry('1')).resolves.toBe(true)
    expect(builder.eq).toHaveBeenCalledWith('id', '1')
  })

  it('returns false when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))

    await expect(infoEntries.deleteEntry('1')).resolves.toBe(false)
  })
})
