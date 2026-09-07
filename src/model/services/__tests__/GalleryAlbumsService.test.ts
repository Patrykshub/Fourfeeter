import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { IGalleryAlbum } from '../../../types'
import { createQueryBuilder } from '../../../test/supabaseQueryBuilder'
import { GalleryAlbumsService } from '../GalleryAlbumsService'

const mockFrom = vi.fn()

const album: IGalleryAlbum = { id: '1', name: 'Beach trip', cover_image: null }

let galleryAlbums: GalleryAlbumsService

beforeEach(() => {
  mockFrom.mockReset()
  galleryAlbums = new GalleryAlbumsService({ from: mockFrom } as unknown as SupabaseClient)
})

describe('fetchAlbums', () => {
  it('returns the albums from supabase', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: [album], error: null }))

    await expect(galleryAlbums.fetchAlbums()).resolves.toEqual([album])
    expect(mockFrom).toHaveBeenCalledWith('gallery_albums')
  })

  it('returns undefined when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('boom') }))

    await expect(galleryAlbums.fetchAlbums()).resolves.toBeUndefined()
  })
})

describe('insertAlbum', () => {
  it('inserts and returns the created album', async () => {
    const inserted: IGalleryAlbum = { id: '2', name: 'Park', cover_image: null }
    const builder = createQueryBuilder({ data: inserted, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(
      galleryAlbums.insertAlbum({ name: 'Park', cover_image: null }),
    ).resolves.toEqual(inserted)
    expect(mockFrom).toHaveBeenCalledWith('gallery_albums')
    expect(builder.insert).toHaveBeenCalledWith({ name: 'Park', cover_image: null })
  })

  it('returns undefined when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))

    await expect(
      galleryAlbums.insertAlbum({ name: 'Park', cover_image: null }),
    ).resolves.toBeUndefined()
  })
})

describe('updateAlbum', () => {
  it('updates and returns the updated album', async () => {
    const updated: IGalleryAlbum = { id: '1', name: 'Beach trip 2024', cover_image: 'url' }
    const builder = createQueryBuilder({ data: updated, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(
      galleryAlbums.updateAlbum('1', { name: 'Beach trip 2024', cover_image: 'url' }),
    ).resolves.toEqual(updated)
    expect(builder.update).toHaveBeenCalledWith({ name: 'Beach trip 2024', cover_image: 'url' })
    expect(builder.eq).toHaveBeenCalledWith('id', '1')
  })

  it('returns undefined when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))

    await expect(
      galleryAlbums.updateAlbum('1', { name: 'X', cover_image: null }),
    ).resolves.toBeUndefined()
  })
})

describe('deleteAlbum', () => {
  it('deletes the album and returns true', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(galleryAlbums.deleteAlbum('1')).resolves.toBe(true)
    expect(builder.eq).toHaveBeenCalledWith('id', '1')
  })

  it('returns false when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))

    await expect(galleryAlbums.deleteAlbum('1')).resolves.toBe(false)
  })
})
