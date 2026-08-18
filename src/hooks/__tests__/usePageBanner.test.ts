import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IntlWrapper } from '../../test/intl'

const mockFetchBanner = vi.fn()
const mockSaveBanner = vi.fn()

vi.mock('../../model/Application', () => ({
  app: () => ({
    pageBanner: {
      fetchBanner: mockFetchBanner,
      saveBanner: mockSaveBanner,
    },
  }),
}))
vi.mock('../useCachedResource', () => ({
  useCachedResource: vi.fn(),
}))

let mockLocale = 'pl-PL'
vi.mock('../../i18n/LocaleContext', () => ({
  useLocale: () => ({ locale: mockLocale, setLocale: vi.fn() }),
}))

import { useCachedResource } from '../useCachedResource'
import { usePageBanner } from '../usePageBanner'

interface IPageBannerData {
  image: string | null
  description_pl: string | null
  description_en: string | null
  description_de: string | null
}

const mockUseCachedResource = useCachedResource as unknown as ReturnType<typeof vi.fn>

type Fetcher = () => Promise<IPageBannerData | undefined>

const NO_DESCRIPTIONS = { description_pl: null, description_en: null, description_de: null }

beforeEach(() => {
  mockFetchBanner.mockReset()
  mockSaveBanner.mockReset()
  mockUseCachedResource.mockReset()
  mockLocale = 'pl-PL'
})

describe('usePageBanner', () => {
  it('returns null banner and description while there is no cached data', () => {
    mockUseCachedResource.mockReturnValue([undefined, vi.fn()])
    const { result } = renderHook(() => usePageBanner('info'), { wrapper: IntlWrapper })
    expect(result.current.banner).toBeNull()
    expect(result.current.description).toBeNull()
    expect(result.current.descriptions).toEqual(NO_DESCRIPTIONS)
  })

  it('returns the cached banner and description resolved for the current locale', () => {
    mockUseCachedResource.mockReturnValue([
      { image: 'img.png', description_pl: 'Opis', description_en: 'Desc', description_de: null },
      vi.fn(),
    ])
    const { result } = renderHook(() => usePageBanner('memories'), { wrapper: IntlWrapper })
    expect(result.current.banner).toBe('img.png')
    expect(result.current.description).toBe('Opis')
  })

  it('resolves description for a non-default locale', () => {
    mockLocale = 'en-GB'
    mockUseCachedResource.mockReturnValue([
      { image: 'img.png', description_pl: 'Opis', description_en: 'Desc', description_de: null },
      vi.fn(),
    ])
    const { result } = renderHook(() => usePageBanner('info'), { wrapper: IntlWrapper })
    expect(result.current.description).toBe('Desc')
  })

  it('resolves to null when the current locale has no translation', () => {
    mockLocale = 'de-DE'
    mockUseCachedResource.mockReturnValue([
      { image: 'img.png', description_pl: 'Opis', description_en: 'Desc', description_de: null },
      vi.fn(),
    ])
    const { result } = renderHook(() => usePageBanner('info'), { wrapper: IntlWrapper })
    expect(result.current.description).toBeNull()
  })

  it('uses a key-scoped cache key', () => {
    mockUseCachedResource.mockReturnValue([undefined, vi.fn()])
    renderHook(() => usePageBanner('info'), { wrapper: IntlWrapper })
    expect(mockUseCachedResource).toHaveBeenCalledWith('page-banner:info', expect.any(Function))
  })

  it('fetches the banner scoped by key via the page banner service', async () => {
    mockFetchBanner.mockResolvedValue({
      image: 'img.png',
      description_pl: 'Opis',
      description_en: null,
      description_de: null,
    })
    let capturedFetcher: Fetcher | undefined
    mockUseCachedResource.mockImplementation((_key: string, fetcher: Fetcher) => {
      capturedFetcher = fetcher
      return [undefined, vi.fn()]
    })

    renderHook(() => usePageBanner('info'), { wrapper: IntlWrapper })

    await expect(capturedFetcher?.()).resolves.toEqual({
      image: 'img.png',
      description_pl: 'Opis',
      description_en: null,
      description_de: null,
    })
    expect(mockFetchBanner).toHaveBeenCalledWith('info')
  })

  it('setBanner upserts the new image alongside the current descriptions', async () => {
    mockSaveBanner.mockResolvedValue(true)
    const writeData = vi.fn()
    mockUseCachedResource.mockReturnValue([
      { image: 'old.png', description_pl: 'Opis', description_en: null, description_de: null },
      writeData,
    ])

    const { result } = renderHook(() => usePageBanner('info'), { wrapper: IntlWrapper })
    await act(async () => {
      await result.current.setBanner('new.png')
    })

    expect(mockSaveBanner).toHaveBeenCalledWith('info', {
      image: 'new.png',
      description_pl: 'Opis',
      description_en: null,
      description_de: null,
    })
    expect(writeData).toHaveBeenCalledWith({
      image: 'new.png',
      description_pl: 'Opis',
      description_en: null,
      description_de: null,
    })
  })

  it('setDescriptions upserts all three languages alongside the current banner', async () => {
    mockSaveBanner.mockResolvedValue(true)
    const writeData = vi.fn()
    mockUseCachedResource.mockReturnValue([
      { image: 'img.png', description_pl: 'Stary', description_en: null, description_de: null },
      writeData,
    ])

    const { result } = renderHook(() => usePageBanner('info'), { wrapper: IntlWrapper })
    await act(async () => {
      await result.current.setDescriptions({ description_pl: 'Nowy', description_en: 'New', description_de: null })
    })

    expect(mockSaveBanner).toHaveBeenCalledWith('info', {
      image: 'img.png',
      description_pl: 'Nowy',
      description_en: 'New',
      description_de: null,
    })
    expect(writeData).toHaveBeenCalledWith({
      image: 'img.png',
      description_pl: 'Nowy',
      description_en: 'New',
      description_de: null,
    })
  })

  it('alerts and does not update the cache when the upsert fails', async () => {
    mockSaveBanner.mockResolvedValue(false)
    const writeData = vi.fn()
    mockUseCachedResource.mockReturnValue([{ image: null, ...NO_DESCRIPTIONS }, writeData])
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    const { result } = renderHook(() => usePageBanner('info'), { wrapper: IntlWrapper })
    await act(async () => {
      await result.current.setBanner('new.png')
    })

    expect(alertSpy).toHaveBeenCalled()
    expect(writeData).not.toHaveBeenCalled()
    alertSpy.mockRestore()
  })
})
