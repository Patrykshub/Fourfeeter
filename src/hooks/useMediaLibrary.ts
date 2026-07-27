import { useEffect, useState } from 'react'
import { readJSON, writeJSON } from '../lib/storage'
import { defaultPosts } from '../data/defaultPosts'

const STORAGE_KEY = 'media_v1'

function seedImages(): string[] {
  return Array.from(new Set(defaultPosts.map((post) => post.image)))
}

export function useMediaLibrary() {
  const [images, setImages] = useState<string[]>(() => {
    const stored = readJSON<string[]>(STORAGE_KEY, seedImages())
    return Array.isArray(stored) ? stored : seedImages()
  })

  useEffect(() => {
    writeJSON(STORAGE_KEY, images)
  }, [images])

  function addImage(url: string) {
    setImages((prev) => (prev.includes(url) ? prev : [url, ...prev]))
  }

  return { images, addImage }
}
