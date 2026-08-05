import { useEffect, useState } from 'react'
import { readJSON, writeJSON } from '../lib/storage'

const STORAGE_KEY = 'media_v1'

export function useMediaLibrary() {
  const [images, setImages] = useState<string[]>(() => {
    const stored = readJSON<string[]>(STORAGE_KEY, [])
    return Array.isArray(stored) ? stored : []
  })

  useEffect(() => {
    writeJSON(STORAGE_KEY, images)
  }, [images])

  function addImage(url: string) {
    setImages((prev) => (prev.includes(url) ? prev : [url, ...prev]))
  }

  return { images, addImage }
}
