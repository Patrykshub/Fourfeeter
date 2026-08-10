import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const BUCKET = 'post-images'
const PUBLIC_PREFIX = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`

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

  const deleteImage = async (url: string): Promise<boolean> => {
    const path = url.replace(PUBLIC_PREFIX, '')
    const { error } = await supabase.storage.from(BUCKET).remove([path])
    if (error) return false

    setImages((prev) => prev.filter((image) => image !== url))

    await Promise.all([
      supabase.from('page_banners').update({ image: null }).eq('image', url),
      supabase.from('posts').update({ image: '' }).eq('image', url),
    ])

    return true
  }

  return { images, uploadImage, deleteImage }
}
