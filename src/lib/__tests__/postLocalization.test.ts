import { describe, expect, it } from 'vitest'
import type { IPost } from '../../types'
import { getPostContent, getPostTitle, hasPostTranslation } from '../postLocalization'

const buildPost = (overrides: Partial<IPost> = {}): IPost => ({
  id: '1',
  title_pl: 'Tytuł',
  title_en: 'Title',
  title_de: 'Titel',
  content_pl: 'Treść',
  content_en: 'Content',
  content_de: 'Inhalt',
  image: 'img.png',
  date: '2026-01-01',
  ...overrides,
})

describe('getPostTitle', () => {
  it('returns the title for the given locale', () => {
    const post = buildPost()
    expect(getPostTitle(post, 'pl-PL')).toBe('Tytuł')
    expect(getPostTitle(post, 'en-GB')).toBe('Title')
    expect(getPostTitle(post, 'de-DE')).toBe('Titel')
  })

  it('returns null when the locale has no title', () => {
    const post = buildPost({ title_en: null })
    expect(getPostTitle(post, 'en-GB')).toBeNull()
  })
})

describe('getPostContent', () => {
  it('returns the content for the given locale', () => {
    const post = buildPost()
    expect(getPostContent(post, 'pl-PL')).toBe('Treść')
    expect(getPostContent(post, 'en-GB')).toBe('Content')
    expect(getPostContent(post, 'de-DE')).toBe('Inhalt')
  })

  it('returns null when the locale has no content', () => {
    const post = buildPost({ content_de: null })
    expect(getPostContent(post, 'de-DE')).toBeNull()
  })
})

describe('hasPostTranslation', () => {
  it('returns true when both title and content are present for the locale', () => {
    const post = buildPost()
    expect(hasPostTranslation(post, 'pl-PL')).toBe(true)
    expect(hasPostTranslation(post, 'en-GB')).toBe(true)
    expect(hasPostTranslation(post, 'de-DE')).toBe(true)
  })

  it('returns false when the locale has no translation at all', () => {
    const post = buildPost({ title_de: null, content_de: null })
    expect(hasPostTranslation(post, 'de-DE')).toBe(false)
  })

  it('returns false when only the title is present (partial translation)', () => {
    const post = buildPost({ title_en: 'Title', content_en: null })
    expect(hasPostTranslation(post, 'en-GB')).toBe(false)
  })

  it('returns false when only the content is present (partial translation)', () => {
    const post = buildPost({ title_en: null, content_en: 'Content' })
    expect(hasPostTranslation(post, 'en-GB')).toBe(false)
  })

  it('returns false when the title/content are blank strings', () => {
    const post = buildPost({ title_en: '   ', content_en: '   ' })
    expect(hasPostTranslation(post, 'en-GB')).toBe(false)
  })
})
