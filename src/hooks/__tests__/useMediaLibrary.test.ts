import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createQueryBuilder } from '../../test/supabaseQueryBuilder'

vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    storage: { from: vi.fn() },
    from: vi.fn(),
  },
}))

import { supabase } from '../../lib/supabaseClient'
import { useMediaLibrary } from '../useMediaLibrary'

// Computed the same way the hook computes it, so the expected value tracks
// whatever VITE_SUPABASE_URL happens to resolve to in this test run.
const PUBLIC_PREFIX = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/post-images/`

const mockStorageFrom = supabase.storage.from as unknown as ReturnType<typeof vi.fn>
const mockFrom = supabase.from as unknown as ReturnType<typeof vi.fn>

const createStorageBucket = () => ({
  list: vi.fn().mockResolvedValue({ data: [], error: null }),
  upload: vi.fn().mockResolvedValue({ error: null }),
  remove: vi.fn().mockResolvedValue({ error: null }),
  getPublicUrl: vi.fn((path: string) => ({ data: { publicUrl: `${PUBLIC_PREFIX}${path}` } })),
})

let bucket: ReturnType<typeof createStorageBucket>
let updateBuilder: ReturnType<typeof createQueryBuilder>

beforeEach(() => {
  bucket = createStorageBucket()
  mockStorageFrom.mockReset().mockReturnValue(bucket)

  updateBuilder = createQueryBuilder({ data: null, error: null })
  mockFrom.mockReset().mockReturnValue(updateBuilder)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useMediaLibrary', () => {
  it('lists existing images on mount', async () => {
    bucket.list.mockResolvedValue({ data: [{ name: 'a.png' }, { name: 'b.png' }], error: null })

    const { result } = renderHook(() => useMediaLibrary())

    await waitFor(() =>
      expect(result.current.images).toEqual([`${PUBLIC_PREFIX}a.png`, `${PUBLIC_PREFIX}b.png`]),
    )
    expect(mockStorageFrom).toHaveBeenCalledWith('post-images')
    expect(bucket.list).toHaveBeenCalledWith(undefined, {
      sortBy: { column: 'created_at', order: 'desc' },
    })
  })

  it('keeps images empty when listing fails', async () => {
    bucket.list.mockResolvedValue({ data: null, error: new Error('fail') })

    const { result } = renderHook(() => useMediaLibrary())

    await waitFor(() => expect(bucket.list).toHaveBeenCalled())
    expect(result.current.images).toEqual([])
  })

  it('uploadImage uploads the file under a random name and returns its public url', async () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('uuid-1' as ReturnType<typeof crypto.randomUUID>)
    const { result } = renderHook(() => useMediaLibrary())
    await waitFor(() => expect(bucket.list).toHaveBeenCalled())

    const file = new File(['content'], 'photo.png', { type: 'image/png' })
    let url: string | null = null
    await act(async () => {
      url = await result.current.uploadImage(file)
    })

    expect(bucket.upload).toHaveBeenCalledWith('uuid-1-photo.png', file)
    expect(url).toBe(`${PUBLIC_PREFIX}uuid-1-photo.png`)
    expect(result.current.images[0]).toBe(url)
  })

  it('uploadImage returns null and does not add an image when the upload fails', async () => {
    bucket.upload.mockResolvedValue({ error: new Error('quota') })
    const { result } = renderHook(() => useMediaLibrary())
    await waitFor(() => expect(bucket.list).toHaveBeenCalled())

    const file = new File(['content'], 'photo.png', { type: 'image/png' })
    let url: string | null = 'unset'
    await act(async () => {
      url = await result.current.uploadImage(file)
    })

    expect(url).toBeNull()
    expect(result.current.images).toEqual([])
  })

  it('deleteImage removes the file and clears it from related tables', async () => {
    bucket.list.mockResolvedValue({ data: [{ name: 'a.png' }], error: null })
    const { result } = renderHook(() => useMediaLibrary())
    const url = `${PUBLIC_PREFIX}a.png`
    await waitFor(() => expect(result.current.images).toEqual([url]))

    let success = false
    await act(async () => {
      success = await result.current.deleteImage(url)
    })

    expect(success).toBe(true)
    expect(bucket.remove).toHaveBeenCalledWith(['a.png'])
    expect(result.current.images).toEqual([])
    expect(mockFrom).toHaveBeenCalledWith('page_banners')
    expect(mockFrom).toHaveBeenCalledWith('posts')
    expect(updateBuilder.update).toHaveBeenNthCalledWith(1, { image: null })
    expect(updateBuilder.update).toHaveBeenNthCalledWith(2, { image: '' })
    expect(updateBuilder.eq).toHaveBeenNthCalledWith(1, 'image', url)
    expect(updateBuilder.eq).toHaveBeenNthCalledWith(2, 'image', url)
  })

  it('deleteImage returns false and keeps the image when removal fails', async () => {
    bucket.list.mockResolvedValue({ data: [{ name: 'a.png' }], error: null })
    bucket.remove.mockResolvedValue({ error: new Error('denied') })
    const { result } = renderHook(() => useMediaLibrary())
    const url = `${PUBLIC_PREFIX}a.png`
    await waitFor(() => expect(result.current.images).toEqual([url]))

    let success = true
    await act(async () => {
      success = await result.current.deleteImage(url)
    })

    expect(success).toBe(false)
    expect(result.current.images).toEqual([url])
    expect(mockFrom).not.toHaveBeenCalled()
  })
})
