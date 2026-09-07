import type { SupabaseClient } from '@supabase/supabase-js'
import type { IGalleryAlbum } from '../../types'

export type GalleryAlbumInput = Omit<IGalleryAlbum, 'id'>

export class GalleryAlbumsService {
  public constructor(private readonly supabase: SupabaseClient) {}

  public async fetchAlbums(): Promise<IGalleryAlbum[] | undefined> {
    const { data, error } = await this.supabase
      .from('gallery_albums')
      .select('id, name, cover_image')
      .order('created_at', { ascending: true })
    if (error || !data) {
      console.error('Failed to fetch gallery albums', error)
      return undefined
    }
    return data as IGalleryAlbum[]
  }

  public async insertAlbum(data: GalleryAlbumInput): Promise<IGalleryAlbum | undefined> {
    const { data: inserted, error } = await this.supabase
      .from('gallery_albums')
      .insert(data)
      .select('id, name, cover_image')
      .single()
    if (error || !inserted) {
      console.error('Failed to insert gallery album', error)
      return undefined
    }
    return inserted as IGalleryAlbum
  }

  public async updateAlbum(id: string, data: GalleryAlbumInput): Promise<IGalleryAlbum | undefined> {
    const { data: updated, error } = await this.supabase
      .from('gallery_albums')
      .update(data)
      .eq('id', id)
      .select('id, name, cover_image')
      .single()
    if (error || !updated) {
      console.error('Failed to update gallery album', error)
      return undefined
    }
    return updated as IGalleryAlbum
  }

  public async deleteAlbum(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('gallery_albums').delete().eq('id', id)
    if (error) {
      console.error('Failed to delete gallery album', error)
      return false
    }
    return true
  }
}
