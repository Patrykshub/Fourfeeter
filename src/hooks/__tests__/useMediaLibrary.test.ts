import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockListImages = vi.fn()
const mockUploadImage = vi.fn()
const mockDeleteImage = vi.fn()

vi.mock('../../model/Application', () => ({
  app: () => ({
    mediaLibrary: {
      listImages: mockListImages,
      uploadImage: mockUploadImage,
      deleteImage: mockDeleteImage,
    },
  }),
}))

import { useMediaLibrary } from '../useMediaLibrary'

beforeEach(() => {
  mockListImages.mockReset().mockResolvedValue([])
  mockUploadImage.mockReset()
  mockDeleteImage.mockReset()
})

describe('useMediaLibrary', () => {
  it('lists existing images on mount', async () => {
    mockListImages.mockResolvedValue(['a.png', 'b.png'])

    const { result } = renderHook(() => useMediaLibrary())

    await waitFor(() => expect(result.current.images).toEqual(['a.png', 'b.png']))
    expect(mockListImages).toHaveBeenCalled()
  })

  it('keeps images empty when listing fails', async () => {
    mockListImages.mockResolvedValue([])

    const { result } = renderHook(() => useMediaLibrary())

    await waitFor(() => expect(mockListImages).toHaveBeenCalled())
    expect(result.current.images).toEqual([])
  })

  it('uploadImage delegates to the service and prepends the returned url', async () => {
    mockUploadImage.mockResolvedValue('uuid-1-photo.png')
    const { result } = renderHook(() => useMediaLibrary())
    await waitFor(() => expect(mockListImages).toHaveBeenCalled())

    const file = new File(['content'], 'photo.png', { type: 'image/png' })
    let url: string | null = null
    await act(async () => {
      url = await result.current.uploadImage(file)
    })

    expect(mockUploadImage).toHaveBeenCalledWith(file)
    expect(url).toBe('uuid-1-photo.png')
    expect(result.current.images[0]).toBe(url)
  })

  it('uploadImage returns null and does not add an image when the upload fails', async () => {
    mockUploadImage.mockResolvedValue(null)
    const { result } = renderHook(() => useMediaLibrary())
    await waitFor(() => expect(mockListImages).toHaveBeenCalled())

    const file = new File(['content'], 'photo.png', { type: 'image/png' })
    let url: string | null = 'unset'
    await act(async () => {
      url = await result.current.uploadImage(file)
    })

    expect(url).toBeNull()
    expect(result.current.images).toEqual([])
  })

  it('deleteImage removes the image on success', async () => {
    mockListImages.mockResolvedValue(['a.png'])
    mockDeleteImage.mockResolvedValue(true)
    const { result } = renderHook(() => useMediaLibrary())
    await waitFor(() => expect(result.current.images).toEqual(['a.png']))

    let success = false
    await act(async () => {
      success = await result.current.deleteImage('a.png')
    })

    expect(success).toBe(true)
    expect(mockDeleteImage).toHaveBeenCalledWith('a.png')
    expect(result.current.images).toEqual([])
  })

  it('deleteImage returns false and keeps the image when removal fails', async () => {
    mockListImages.mockResolvedValue(['a.png'])
    mockDeleteImage.mockResolvedValue(false)
    const { result } = renderHook(() => useMediaLibrary())
    await waitFor(() => expect(result.current.images).toEqual(['a.png']))

    let success = true
    await act(async () => {
      success = await result.current.deleteImage('a.png')
    })

    expect(success).toBe(false)
    expect(result.current.images).toEqual(['a.png'])
  })
})
