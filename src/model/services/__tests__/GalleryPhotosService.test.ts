import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { IGalleryPhoto } from '../../../types'
import { createQueryBuilder } from '../../../test/supabaseQueryBuilder'
import { GalleryPhotosService } from '../GalleryPhotosService'

const mockFrom = vi.fn()

const photo: IGalleryPhoto = { id: '1', album_id: 'a1', image: 'https://example.com/1.jpg' }

let galleryPhotos: GalleryPhotosService

beforeEach(() => {
  mockFrom.mockReset()
  galleryPhotos = new GalleryPhotosService({ from: mockFrom } as unknown as SupabaseClient)
})

describe('fetchPhotos', () => {
  it('returns the photos from supabase', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: [photo], error: null }))

    await expect(galleryPhotos.fetchPhotos()).resolves.toEqual([photo])
    expect(mockFrom).toHaveBeenCalledWith('gallery_photos')
  })

  it('returns undefined when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('boom') }))

    await expect(galleryPhotos.fetchPhotos()).resolves.toBeUndefined()
  })
})

describe('insertPhoto', () => {
  it('inserts and returns the created photo', async () => {
    const inserted: IGalleryPhoto = { id: '2', album_id: 'a1', image: 'https://example.com/2.jpg' }
    const builder = createQueryBuilder({ data: inserted, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(
      galleryPhotos.insertPhoto({ album_id: 'a1', image: 'https://example.com/2.jpg' }),
    ).resolves.toEqual(inserted)
    expect(mockFrom).toHaveBeenCalledWith('gallery_photos')
    expect(builder.insert).toHaveBeenCalledWith({
      album_id: 'a1',
      image: 'https://example.com/2.jpg',
    })
  })

  it('returns undefined when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))

    await expect(
      galleryPhotos.insertPhoto({ album_id: 'a1', image: 'https://example.com/2.jpg' }),
    ).resolves.toBeUndefined()
  })
})

describe('deletePhoto', () => {
  it('deletes the photo and returns true', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(galleryPhotos.deletePhoto('1')).resolves.toBe(true)
    expect(builder.eq).toHaveBeenCalledWith('id', '1')
  })

  it('returns false when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))

    await expect(galleryPhotos.deletePhoto('1')).resolves.toBe(false)
  })
})
