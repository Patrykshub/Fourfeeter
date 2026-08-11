import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../useMediaLibrary', () => ({
  useMediaLibrary: vi.fn(),
}))

import { useMediaLibrary } from '../useMediaLibrary'
import { useImagePicker } from '../useImagePicker'

const mockUseMediaLibrary = useMediaLibrary as unknown as ReturnType<typeof vi.fn>

const uploadImage = vi.fn()
const deleteImage = vi.fn()

const setup = (value = '') => {
  const onChange = vi.fn()
  const { result } = renderHook(() => useImagePicker({ value, onChange }))
  return { result, onChange }
}

beforeEach(() => {
  uploadImage.mockReset()
  deleteImage.mockReset()
  mockUseMediaLibrary.mockReset().mockReturnValue({
    images: ['a.png', 'b.png'],
    uploadImage,
    deleteImage,
  })
})

describe('useImagePicker', () => {
  it('exposes the images from the media library', () => {
    const { result } = setup()
    expect(result.current.images).toEqual(['a.png', 'b.png'])
  })

  it('select calls onChange with the url and closes the picker', () => {
    const { result, onChange } = setup()
    act(() => result.current.setOpen(true))

    act(() => result.current.select('picked.png'))

    expect(onChange).toHaveBeenCalledWith('picked.png')
    expect(result.current.isOpen).toBe(false)
  })

  it('handleUpload is uploading while the upload is pending', async () => {
    let resolveUpload: (url: string | null) => void = () => {}
    uploadImage.mockReturnValue(new Promise((resolve) => (resolveUpload = resolve)))
    const { result } = setup()

    let uploadPromise: Promise<boolean>
    act(() => {
      uploadPromise = result.current.handleUpload(new File(['x'], 'x.png'))
    })
    expect(result.current.isUploading).toBe(true)

    await act(async () => {
      resolveUpload('uploaded.png')
      await uploadPromise
    })
    expect(result.current.isUploading).toBe(false)
  })

  it('handleUpload selects the uploaded url and returns true on success', async () => {
    uploadImage.mockResolvedValue('uploaded.png')
    const { result, onChange } = setup()

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.handleUpload(new File(['x'], 'x.png'))
    })

    expect(success).toBe(true)
    expect(onChange).toHaveBeenCalledWith('uploaded.png')
    expect(result.current.isOpen).toBe(false)
    expect(result.current.isUploading).toBe(false)
  })

  it('handleUpload returns false and does not select anything on failure', async () => {
    uploadImage.mockResolvedValue(null)
    const { result, onChange } = setup()

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.handleUpload(new File(['x'], 'x.png'))
    })

    expect(success).toBe(false)
    expect(onChange).not.toHaveBeenCalled()
    expect(result.current.isUploading).toBe(false)
  })

  it('confirmDeleteImage resolves true immediately when nothing is pending', async () => {
    const { result } = setup()

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.confirmDeleteImage()
    })

    expect(success).toBe(true)
    expect(deleteImage).not.toHaveBeenCalled()
  })

  it('confirmDeleteImage deletes the pending image and clears it', async () => {
    deleteImage.mockResolvedValue(true)
    const { result } = setup()
    act(() => result.current.setPendingDeleteUrl('a.png'))

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.confirmDeleteImage()
    })

    expect(deleteImage).toHaveBeenCalledWith('a.png')
    expect(result.current.pendingDeleteUrl).toBeNull()
    expect(success).toBe(true)
  })

  it('confirmDeleteImage clears the value when the deleted image was selected', async () => {
    deleteImage.mockResolvedValue(true)
    const { result, onChange } = setup('a.png')
    act(() => result.current.setPendingDeleteUrl('a.png'))

    await act(async () => {
      await result.current.confirmDeleteImage()
    })

    expect(onChange).toHaveBeenCalledWith('')
  })

  it('confirmDeleteImage does not touch the value when a different image was deleted', async () => {
    deleteImage.mockResolvedValue(true)
    const { result, onChange } = setup('b.png')
    act(() => result.current.setPendingDeleteUrl('a.png'))

    await act(async () => {
      await result.current.confirmDeleteImage()
    })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('confirmDeleteImage returns false and does not change the value when deletion fails', async () => {
    deleteImage.mockResolvedValue(false)
    const { result, onChange } = setup('a.png')
    act(() => result.current.setPendingDeleteUrl('a.png'))

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.confirmDeleteImage()
    })

    expect(success).toBe(false)
    expect(result.current.pendingDeleteUrl).toBeNull()
    expect(onChange).not.toHaveBeenCalled()
  })
})
