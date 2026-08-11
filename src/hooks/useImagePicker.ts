import { useState } from 'react'
import { useMediaLibrary } from './useMediaLibrary'

interface IUseImagePickerParams {
  value: string
  onChange: (url: string) => void
}

export const useImagePicker = ({ value, onChange }: IUseImagePickerParams) => {
  const { images, uploadImage, deleteImage } = useMediaLibrary()
  const [isOpen, setOpen] = useState(false)
  const [isUploading, setUploading] = useState(false)
  const [pendingDeleteUrl, setPendingDeleteUrl] = useState<string | null>(null)

  const select = (url: string) => {
    onChange(url)
    setOpen(false)
  }

  const handleUpload = async (file: File): Promise<boolean> => {
    setUploading(true)
    const url = await uploadImage(file)
    setUploading(false)

    if (!url) return false

    select(url)
    return true
  }

  const confirmDeleteImage = async (): Promise<boolean> => {
    if (!pendingDeleteUrl) return true

    const deletedUrl = pendingDeleteUrl
    const success = await deleteImage(deletedUrl)
    setPendingDeleteUrl(null)

    if (!success) return false

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
    pendingDeleteUrl,
    setPendingDeleteUrl,
    select,
    handleUpload,
    confirmDeleteImage,
  }
}
