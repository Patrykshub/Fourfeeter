import type { FC } from 'react'
import { useIntl } from 'react-intl'
import type { IPost } from '../../types'
import type { IPostDisplay } from '../../lib/postLocalization'
import { AdminActions } from '../common/AdminActions'

interface IHomeRecommendedItemProps {
  post: IPostDisplay
  isAdmin: boolean
  onSelectMemory: (post: IPost) => void
  onEdit: (post: IPost) => void
  onDelete: (id: string) => void
}

export const HomeRecommendedItem: FC<IHomeRecommendedItemProps> = ({
  post,
  isAdmin,
  onSelectMemory,
  onEdit,
  onDelete,
}) => {
  const intl = useIntl()

  return (
    <div
      onClick={() => onSelectMemory(post)}
      className="card-float flex gap-3 items-center bg-surface p-3 rounded-lg cursor-pointer hover:bg-surfaceHover"
    >
      <div className="relative w-20 h-14 rounded overflow-hidden shrink-0">
        <img src={post.image} alt={post.displayTitle} className="w-full h-full object-cover" />
        <div className="absolute inset-0 shadow-[inset_0_0_10px_3px_rgba(0,0,0,0.55),inset_0_-16px_14px_-6px_rgba(0,0,0,0.85)] pointer-events-none" />
      </div>
      <div className="flex-1">
        <div className="font-semibold">{post.displayTitle}</div>
        <div className="text-sm text-gray-400">{post.displayContent.slice(0, 70)}...</div>
      </div>
      {isAdmin && (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <AdminActions compact onEdit={() => onEdit(post)} onDelete={() => onDelete(post.id)} />
          {!post.isTranslated && (
            <span className="text-xs text-amber-400">
              {intl.formatMessage({ id: 'post.untranslatedBadge' })}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
