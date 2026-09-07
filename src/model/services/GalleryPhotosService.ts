import type { SupabaseClient } from '@supabase/supabase-js'
import type { IGalleryPhoto } from '../../types'

export type GalleryPhotoInput = Omit<IGalleryPhoto, 'id'>

export class GalleryPhotosService {
  public constructor(private readonly supabase: SupabaseClient) {}

  public async fetchPhotos(): Promise<IGalleryPhoto[] | undefined> {
    const { data, error } = await this.supabase
      .from('gallery_photos')
      .select('id, album_id, image')
      .order('created_at', { ascending: true })
    if (error || !data) {
      console.error('Failed to fetch gallery photos', error)
      return undefined
    }
    return data as IGalleryPhoto[]
  }

  public async insertPhoto(data: GalleryPhotoInput): Promise<IGalleryPhoto | undefined> {
    const { data: inserted, error } = await this.supabase
      .from('gallery_photos')
      .insert(data)
      .select('id, album_id, image')
      .single()
    if (error || !inserted) {
      console.error('Failed to insert gallery photo', error)
      return undefined
    }
    return inserted as IGalleryPhoto
  }

  public async deletePhoto(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('gallery_photos').delete().eq('id', id)
    if (error) {
      console.error('Failed to delete gallery photo', error)
      return false
    }
    return true
  }
}
