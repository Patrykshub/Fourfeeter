// Composition root: each service/domain class is created once in the
// constructor and exposed via a getter. Usage: app().someService

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { PostsService } from './services/PostsService'
import { StorageService } from './services/StorageService'
import { InfoEntriesService } from './services/InfoEntriesService'
import { ProductsService } from './services/ProductsService'
import { PageBannerService } from './services/PageBannerService'
import { MediaLibraryService } from './services/MediaLibraryService'
import { AuthService } from './services/AuthService'
import { GalleryAlbumsService } from './services/GalleryAlbumsService'
import { GalleryPhotosService } from './services/GalleryPhotosService'

class Application {
  public readonly supabase: SupabaseClient
  public readonly posts: PostsService
  public readonly storage: StorageService
  public readonly infoEntries: InfoEntriesService
  public readonly products: ProductsService
  public readonly pageBanner: PageBannerService
  public readonly mediaLibrary: MediaLibraryService
  public readonly auth: AuthService
  public readonly galleryAlbums: GalleryAlbumsService
  public readonly galleryPhotos: GalleryPhotosService

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    this.supabase = createClient(supabaseUrl, supabaseAnonKey)
    this.posts = new PostsService(this.supabase)
    this.storage = new StorageService()
    this.infoEntries = new InfoEntriesService(this.supabase)
    this.products = new ProductsService(this.supabase)
    this.pageBanner = new PageBannerService(this.supabase)
    this.mediaLibrary = new MediaLibraryService(this.supabase)
    this.auth = new AuthService(this.supabase)
    this.galleryAlbums = new GalleryAlbumsService(this.supabase)
    this.galleryPhotos = new GalleryPhotosService(this.supabase)
  }
}

let instance: Application | undefined = undefined

export const app = (): Application => {
  if (!instance) {
    instance = new Application()
  }
  return instance
}
