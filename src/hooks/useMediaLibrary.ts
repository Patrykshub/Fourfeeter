import { useEffect, useState } from 'react'
import { app } from '../model/Application'

export const useMediaLibrary = (enabled = true) => {
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    app()
      .mediaLibrary.listImages()
      .then((urls) => {
        if (!cancelled) setImages(urls)
      })
    return () => {
      cancelled = true
    }
  }, [enabled])

  const uploadImage = async (file: File): Promise<string | null> => {
    const url = await app().mediaLibrary.uploadImage(file)
    if (!url) return null

    setImages((prev) => [url, ...prev])
    return url
  }

  const deleteImage = async (url: string): Promise<boolean> => {
    const success = await app().mediaLibrary.deleteImage(url)
    if (!success) return false

    setImages((prev) => prev.filter((image) => image !== url))
    return true
  }

  return { images, uploadImage, deleteImage }
}
