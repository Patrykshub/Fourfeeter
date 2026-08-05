import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const BUCKET = 'post-images'

export const useMediaLibrary = () => {
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    supabase.storage
      .from(BUCKET)
      .list(undefined, { sortBy: { column: 'created_at', order: 'desc' } })
      .then(({ data, error }) => {
        if (cancelled || error || !data) return
        const urls = data.map(
          (file) => supabase.storage.from(BUCKET).getPublicUrl(file.name).data.publicUrl,
        )
        setImages(urls)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const uploadImage = async (file: File): Promise<string | null> => {
    const path = `${crypto.randomUUID()}-${file.name}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file)
    if (error) return null

    const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
    setImages((prev) => [url, ...prev])
    return url
  }

  return { images, uploadImage }
}
