import type { FC } from 'react'
import { useIntl } from 'react-intl'
import type { IPost } from '../../types'
import { useLocale } from '../../i18n/LocaleContext'
import { getPostContent, getPostTitle, hasPostTranslation } from '../../lib/postLocalization'
import { AdminActions } from '../common/AdminActions'

interface IFeaturedPostCardProps {
  post: IPost
  isAdmin: boolean
  onSelectMemory: (post: IPost) => void
  onEdit: (post: IPost) => void
  onDelete: (id: string) => void
}

export const FeaturedPostCard: FC<IFeaturedPostCardProps> = ({ post, isAdmin, onSelectMemory, onEdit, onDelete }) => {
  const intl = useIntl()
  const { locale } = useLocale()
  const isTranslated = hasPostTranslation(post, locale)
  const title = getPostTitle(post, locale) ?? intl.formatMessage({ id: 'post.missingTranslationTitle' })
  const content = getPostContent(post, locale) ?? intl.formatMessage({ id: 'post.missingTranslationContent' })

  return (
    <article
      onClick={() => onSelectMemory(post)}
      className="lg:col-span-2 bg-surface rounded-xl overflow-hidden cursor-pointer hover:bg-surfaceHover"
    >
      <img src={post.image} alt={title} className="w-full h-64 sm:h-96 object-cover" />
      <div className="p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mt-2">{title}</h2>
        <p className="mt-3 text-gray-300 whitespace-pre-wrap">{content.slice(0, 200)}...</p>
        {isAdmin && (
          <div className="mt-4 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <AdminActions onEdit={() => onEdit(post)} onDelete={() => onDelete(post.id)} />
            {!isTranslated && (
              <span className="text-xs text-amber-400">
                {intl.formatMessage({ id: 'post.untranslatedBadge' })}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
