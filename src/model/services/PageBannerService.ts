import type { SupabaseClient } from '@supabase/supabase-js'

export type PageBannerKey = 'memories' | 'info'

export interface IPageBannerDescriptions {
  description_pl: string | null
  description_en: string | null
  description_de: string | null
}

export interface IPageBannerData extends IPageBannerDescriptions {
  image: string | null
}

export class PageBannerService {
  public constructor(private readonly supabase: SupabaseClient) {}

  public async fetchBanner(key: PageBannerKey): Promise<IPageBannerData | undefined> {
    const { data, error } = await this.supabase
      .from('page_banners')
      .select('image, description_pl, description_en, description_de')
      .eq('key', key)
      .maybeSingle()
    if (error) {
      console.error('Failed to fetch page banner', error)
      return undefined
    }
    return {
      image: data?.image ?? null,
      description_pl: data?.description_pl ?? null,
      description_en: data?.description_en ?? null,
      description_de: data?.description_de ?? null,
    }
  }

  public async saveBanner(key: PageBannerKey, next: IPageBannerData): Promise<boolean> {
    const { error } = await this.supabase.from('page_banners').upsert({ key, ...next })
    if (error) {
      console.error('Failed to save page banner', error)
      return false
    }
    return true
  }
}
