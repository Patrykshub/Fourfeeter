import type { FC } from 'react'
import { useIntl } from 'react-intl'
import type { IPost } from '../../types'
import { useLocale } from '../../i18n/LocaleContext'
import { getPostContent, getPostTitle, hasPostTranslation } from '../../lib/postLocalization'
import { AdminActions } from '../common/AdminActions'

interface IHomePostCardProps {
  post: IPost
  isAdmin: boolean
  onEdit: (post: IPost) => void
  onDelete: (id: string) => void
}

const HomePostCard: FC<IHomePostCardProps> = ({ post, isAdmin, onEdit, onDelete }) => {
  const intl = useIntl()
  const { locale } = useLocale()
  const isTranslated = hasPostTranslation(post, locale)
  const title = getPostTitle(post, locale) ?? intl.formatMessage({ id: 'post.missingTranslationTitle' })
  const content = getPostContent(post, locale) ?? intl.formatMessage({ id: 'post.missingTranslationContent' })

  return (
    <article className="bg-[#071018] rounded-lg overflow-hidden">
      <img src={post.image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h5 className="font-semibold mt-1">{title}</h5>
        <p className="text-gray-400 text-sm mt-2">{content.slice(0, 100)}...</p>
        {isAdmin && (
          <div className="mt-3 flex items-center gap-3">
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

export { HomePostCard }
