import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createQueryBuilder } from '../../../test/supabaseQueryBuilder'

const mockFrom = vi.fn()

vi.mock('../../Application', () => ({
  app: () => ({ supabase: { from: mockFrom } }),
}))

import { PageBannerService } from '../PageBannerService'

let pageBanner: PageBannerService

beforeEach(() => {
  mockFrom.mockReset()
  pageBanner = new PageBannerService()
})

describe('fetchBanner', () => {
  it('fetches the banner row scoped by key', async () => {
    mockFrom.mockReturnValue(
      createQueryBuilder({
        data: { image: 'img.png', description_pl: 'Opis', description_en: null, description_de: null },
        error: null,
      }),
    )

    await expect(pageBanner.fetchBanner('info')).resolves.toEqual({
      image: 'img.png',
      description_pl: 'Opis',
      description_en: null,
      description_de: null,
    })
    const builder = mockFrom.mock.results[0].value
    expect(mockFrom).toHaveBeenCalledWith('page_banners')
    expect(builder.select).toHaveBeenCalledWith('image, description_pl, description_en, description_de')
    expect(builder.eq).toHaveBeenCalledWith('key', 'info')
  })

  it('defaults to nulls when there is no row', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: null }))

    await expect(pageBanner.fetchBanner('info')).resolves.toEqual({
      image: null,
      description_pl: null,
      description_en: null,
      description_de: null,
    })
  })

  it('resolves to undefined when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('boom') }))

    await expect(pageBanner.fetchBanner('info')).resolves.toBeUndefined()
  })
})

describe('saveBanner', () => {
  it('upserts the banner scoped by key and returns true', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    const next = { image: 'new.png', description_pl: 'Opis', description_en: null, description_de: null }
    await expect(pageBanner.saveBanner('info', next)).resolves.toBe(true)

    expect(mockFrom).toHaveBeenCalledWith('page_banners')
    expect(builder.upsert).toHaveBeenCalledWith({ key: 'info', ...next })
  })

  it('returns false when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))

    const next = { image: null, description_pl: null, description_en: null, description_de: null }
    await expect(pageBanner.saveBanner('info', next)).resolves.toBe(false)
  })
})
