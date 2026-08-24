import { useState } from 'react'
import { useMediaLibrary } from './useMediaLibrary'

interface IUseImagePickerParams {
  value: string
  onChange: (url: string) => void
  enabled?: boolean
}

export const useImagePicker = ({ value, onChange, enabled = true }: IUseImagePickerParams) => {
  const { images, uploadImage, deleteImage } = useMediaLibrary(enabled)
  const [isOpen, setOpen] = useState(false)
  const [isUploading, setUploading] = useState(false)
  const [pendingDeleteUrl, setPendingDeleteUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState(false)
  const [deleteError, setDeleteError] = useState(false)

  const select = (url: string) => {
    onChange(url)
    setOpen(false)
  }

  const handleUpload = async (file: File): Promise<boolean> => {
    setUploading(true)
    setUploadError(false)
    const url = await uploadImage(file)
    setUploading(false)

    if (!url) {
      setUploadError(true)
      return false
    }

    select(url)
    return true
  }

  const confirmDeleteImage = async (): Promise<boolean> => {
    if (!pendingDeleteUrl) return true

    const deletedUrl = pendingDeleteUrl
    setDeleteError(false)
    const success = await deleteImage(deletedUrl)
    setPendingDeleteUrl(null)

    if (!success) {
      setDeleteError(true)
      return false
    }

    if (deletedUrl === value) {
      onChange('')
    }
    return true
  }

  return {
    images,
    isOpen,
    setOpen,
    isUploading,
    uploadError,
    deleteError,
    pendingDeleteUrl,
    setPendingDeleteUrl,
    select,
    handleUpload,
    confirmDeleteImage,
  }
}
