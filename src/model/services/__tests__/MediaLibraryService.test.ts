import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createQueryBuilder } from '../../../test/supabaseQueryBuilder'

const mockStorageFrom = vi.fn()
const mockFrom = vi.fn()

vi.mock('../../Application', () => ({
  app: () => ({ supabase: { storage: { from: mockStorageFrom }, from: mockFrom } }),
}))

import { MediaLibraryService } from '../MediaLibraryService'

// Computed the same way the service computes it, so the expected value tracks
// whatever VITE_SUPABASE_URL happens to resolve to in this test run.
const PUBLIC_PREFIX = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/post-images/`

const createStorageBucket = () => ({
  list: vi.fn().mockResolvedValue({ data: [], error: null }),
  upload: vi.fn().mockResolvedValue({ error: null }),
  remove: vi.fn().mockResolvedValue({ error: null }),
  getPublicUrl: vi.fn((path: string) => ({ data: { publicUrl: `${PUBLIC_PREFIX}${path}` } })),
})

let bucket: ReturnType<typeof createStorageBucket>
let updateBuilder: ReturnType<typeof createQueryBuilder>
let mediaLibrary: MediaLibraryService

beforeEach(() => {
  bucket = createStorageBucket()
  mockStorageFrom.mockReset().mockReturnValue(bucket)

  updateBuilder = createQueryBuilder({ data: null, error: null })
  mockFrom.mockReset().mockReturnValue(updateBuilder)

  mediaLibrary = new MediaLibraryService()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('listImages', () => {
  it('lists existing images as public urls', async () => {
    bucket.list.mockResolvedValue({ data: [{ name: 'a.png' }, { name: 'b.png' }], error: null })

    await expect(mediaLibrary.listImages()).resolves.toEqual([
      `${PUBLIC_PREFIX}a.png`,
      `${PUBLIC_PREFIX}b.png`,
    ])
    expect(mockStorageFrom).toHaveBeenCalledWith('post-images')
    expect(bucket.list).toHaveBeenCalledWith(undefined, {
      sortBy: { column: 'created_at', order: 'desc' },
    })
  })

  it('returns an empty array when listing fails', async () => {
    bucket.list.mockResolvedValue({ data: null, error: new Error('fail') })

    await expect(mediaLibrary.listImages()).resolves.toEqual([])
  })
})

describe('uploadImage', () => {
  it('uploads the file under a random name and returns its public url', async () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('uuid-1' as ReturnType<typeof crypto.randomUUID>)

    const file = new File(['content'], 'photo.png', { type: 'image/png' })
    const url = await mediaLibrary.uploadImage(file)

    expect(bucket.upload).toHaveBeenCalledWith('uuid-1-photo.png', file)
    expect(url).toBe(`${PUBLIC_PREFIX}uuid-1-photo.png`)
  })

  it('returns null when the upload fails', async () => {
    bucket.upload.mockResolvedValue({ error: new Error('quota') })

    const file = new File(['content'], 'photo.png', { type: 'image/png' })
    await expect(mediaLibrary.uploadImage(file)).resolves.toBeNull()
  })
})

describe('deleteImage', () => {
  it('removes the file and clears it from related tables', async () => {
    const url = `${PUBLIC_PREFIX}a.png`

    await expect(mediaLibrary.deleteImage(url)).resolves.toBe(true)

    expect(bucket.remove).toHaveBeenCalledWith(['a.png'])
    expect(mockFrom).toHaveBeenCalledWith('page_banners')
    expect(mockFrom).toHaveBeenCalledWith('posts')
    expect(updateBuilder.update).toHaveBeenNthCalledWith(1, { image: null })
    expect(updateBuilder.update).toHaveBeenNthCalledWith(2, { image: '' })
    expect(updateBuilder.eq).toHaveBeenNthCalledWith(1, 'image', url)
    expect(updateBuilder.eq).toHaveBeenNthCalledWith(2, 'image', url)
  })

  it('returns false and skips cleanup when removal fails', async () => {
    bucket.remove.mockResolvedValue({ error: new Error('denied') })
    const url = `${PUBLIC_PREFIX}a.png`

    await expect(mediaLibrary.deleteImage(url)).resolves.toBe(false)
    expect(mockFrom).not.toHaveBeenCalled()
  })
})
