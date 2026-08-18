import { app } from '../Application'

const BUCKET = 'post-images'
const PUBLIC_PREFIX = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`

export class MediaLibraryService {
  public async listImages(): Promise<string[]> {
    const { data, error } = await app()
      .supabase.storage.from(BUCKET)
      .list(undefined, { sortBy: { column: 'created_at', order: 'desc' } })
    if (error || !data) return []
    return data.map((file) => app().supabase.storage.from(BUCKET).getPublicUrl(file.name).data.publicUrl)
  }

  public async uploadImage(file: File): Promise<string | null> {
    const path = `${crypto.randomUUID()}-${file.name}`
    const { error } = await app().supabase.storage.from(BUCKET).upload(path, file)
    if (error) return null

    return app().supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  }

  public async deleteImage(url: string): Promise<boolean> {
    const path = url.replace(PUBLIC_PREFIX, '')
    const { error } = await app().supabase.storage.from(BUCKET).remove([path])
    if (error) return false

    await Promise.all([
      app().supabase.from('page_banners').update({ image: null }).eq('image', url),
      app().supabase.from('posts').update({ image: '' }).eq('image', url),
    ])

    return true
  }
}
