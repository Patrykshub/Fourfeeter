import type { SupabaseClient } from '@supabase/supabase-js'

const BUCKET = 'post-images'
const PUBLIC_PREFIX = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`

export class MediaLibraryService {
  public constructor(private readonly supabase: SupabaseClient) {}

  public async listImages(): Promise<string[]> {
    const { data, error } = await this.supabase.storage
      .from(BUCKET)
      .list(undefined, { sortBy: { column: 'created_at', order: 'desc' } })
    if (error || !data) {
      console.error('Failed to list images', error)
      return []
    }
    return data.map((file) => this.supabase.storage.from(BUCKET).getPublicUrl(file.name).data.publicUrl)
  }

  public async uploadImage(file: File): Promise<string | null> {
    const path = `${crypto.randomUUID()}-${file.name}`
    const { error } = await this.supabase.storage.from(BUCKET).upload(path, file)
    if (error) {
      console.error('Failed to upload image', error)
      return null
    }

    return this.supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  }

  public async deleteImage(url: string): Promise<boolean> {
    const path = url.replace(PUBLIC_PREFIX, '')
    const { error } = await this.supabase.storage.from(BUCKET).remove([path])
    if (error) {
      console.error('Failed to delete image', error)
      return false
    }

    await Promise.all([
      this.supabase.from('page_banners').update({ image: null }).eq('image', url),
      this.supabase.from('posts').update({ image: '' }).eq('image', url),
    ])

    return true
  }
}
