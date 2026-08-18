import type { IntlShape } from 'react-intl'
import { LOCALE_SUFFIXES } from '../i18n/utils'
import type { SupportedLocale } from '../i18n/utils'
import type { IPost } from '../types'

export const getPostTitle = (post: IPost, locale: SupportedLocale): string | null => {
  const suffix = LOCALE_SUFFIXES[locale]
  return post[`title_${suffix}`]
}

export const getPostContent = (post: IPost, locale: SupportedLocale): string | null => {
  const suffix = LOCALE_SUFFIXES[locale]
  return post[`content_${suffix}`]
}

export const hasPostTranslation = (post: IPost, locale: SupportedLocale): boolean => {
  const title = getPostTitle(post, locale)
  const content = getPostContent(post, locale)
  return Boolean(title?.trim()) && Boolean(content?.trim())
}

export interface IPostDisplay extends IPost {
  displayTitle: string
  displayContent: string
  isTranslated: boolean
}

export const toPostDisplay = (post: IPost, locale: SupportedLocale, intl: IntlShape): IPostDisplay => ({
  ...post,
  displayTitle: getPostTitle(post, locale) ?? intl.formatMessage({ id: 'post.missingTranslationTitle' }),
  displayContent: getPostContent(post, locale) ?? intl.formatMessage({ id: 'post.missingTranslationContent' }),
  isTranslated: hasPostTranslation(post, locale),
})
