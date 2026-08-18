import { app } from '../Application'

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
  public async fetchBanner(key: PageBannerKey): Promise<IPageBannerData | undefined> {
    const { data, error } = await app()
      .supabase.from('page_banners')
      .select('image, description_pl, description_en, description_de')
      .eq('key', key)
      .maybeSingle()
    if (error) return undefined
    return {
      image: data?.image ?? null,
      description_pl: data?.description_pl ?? null,
      description_en: data?.description_en ?? null,
      description_de: data?.description_de ?? null,
    }
  }

  public async saveBanner(key: PageBannerKey, next: IPageBannerData): Promise<boolean> {
    const { error } = await app().supabase.from('page_banners').upsert({ key, ...next })
    return !error
  }
}
