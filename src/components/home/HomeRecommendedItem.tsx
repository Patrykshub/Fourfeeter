import type { FC } from 'react'
import { useIntl } from 'react-intl'
import type { IPost } from '../../types'
import { useLocale } from '../../i18n/LocaleContext'
import { getPostContent, getPostTitle, hasPostTranslation } from '../../lib/postLocalization'
import { AdminActions } from '../common/AdminActions'

interface IHomeRecommendedItemProps {
  post: IPost
  isAdmin: boolean
  onSelectMemory: (post: IPost) => void
  onEdit: (post: IPost) => void
  onDelete: (id: string) => void
}

const HomeRecommendedItem: FC<IHomeRecommendedItemProps> = ({
  post,
  isAdmin,
  onSelectMemory,
  onEdit,
  onDelete,
}) => {
  const intl = useIntl()
  const { locale } = useLocale()
  const isTranslated = hasPostTranslation(post, locale)
  const title = getPostTitle(post, locale) ?? intl.formatMessage({ id: 'post.missingTranslationTitle' })
  const content = getPostContent(post, locale) ?? intl.formatMessage({ id: 'post.missingTranslationContent' })

  return (
    <div
      onClick={() => onSelectMemory(post)}
      className="flex gap-3 items-center bg-[#071018] p-3 rounded-lg cursor-pointer hover:bg-[#0c1c29]"
    >
      <img src={post.image} alt={title} className="w-20 h-14 object-cover rounded" />
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-400">{content.slice(0, 70)}...</div>
      </div>
      {isAdmin && (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <AdminActions compact onEdit={() => onEdit(post)} onDelete={() => onDelete(post.id)} />
          {!isTranslated && (
            <span className="text-xs text-amber-400">
              {intl.formatMessage({ id: 'post.untranslatedBadge' })}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export { HomeRecommendedItem }
