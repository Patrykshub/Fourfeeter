// Composition root: each service/domain class is created once in the
// constructor and exposed via a getter. Usage: app().someService

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { PostsService } from './services/PostsService'
import { StorageService } from './services/StorageService'
import { InfoEntriesService } from './services/InfoEntriesService'
import { PageBannerService } from './services/PageBannerService'
import { MediaLibraryService } from './services/MediaLibraryService'
import { AuthService } from './services/AuthService'

class Application {
  private _supabase?: SupabaseClient
  private _posts?: PostsService
  private _storage?: StorageService
  private _infoEntries?: InfoEntriesService
  private _pageBanner?: PageBannerService
  private _mediaLibrary?: MediaLibraryService
  private _auth?: AuthService

  private _isInitialized = (): boolean =>
    this._supabase !== undefined &&
    this._posts !== undefined &&
    this._storage !== undefined &&
    this._infoEntries !== undefined &&
    this._pageBanner !== undefined &&
    this._mediaLibrary !== undefined &&
    this._auth !== undefined

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    this._supabase = createClient(supabaseUrl, supabaseAnonKey)
    this._posts = new PostsService()
    this._storage = new StorageService()
    this._infoEntries = new InfoEntriesService()
    this._pageBanner = new PageBannerService()
    this._mediaLibrary = new MediaLibraryService()
    this._auth = new AuthService()
  }

  public get supabase(): SupabaseClient {
    return this._supabase as SupabaseClient
  }

  public get posts(): PostsService {
    return this._posts as PostsService
  }

  public get storage(): StorageService {
    return this._storage as StorageService
  }

  public get infoEntries(): InfoEntriesService {
    return this._infoEntries as InfoEntriesService
  }

  public get pageBanner(): PageBannerService {
    return this._pageBanner as PageBannerService
  }

  public get mediaLibrary(): MediaLibraryService {
    return this._mediaLibrary as MediaLibraryService
  }

  public get auth(): AuthService {
    return this._auth as AuthService
  }

  public get isInitialized(): boolean {
    return this._isInitialized()
  }
}

let instance: Application | undefined = undefined

export const app = (): Application => {
  if (!instance) {
    instance = new Application()
  }
  return instance
}
