import type { FC } from 'react'
import { useIntl } from 'react-intl'
import type { IPost } from '../../types'
import type { IPostDisplay } from '../../lib/postLocalization'
import { AdminActions } from '../common/AdminActions'

interface IHomePostCardProps {
  post: IPostDisplay
  isAdmin: boolean
  onEdit: (post: IPost) => void
  onDelete: (id: string) => void
}

export const HomePostCard: FC<IHomePostCardProps> = ({ post, isAdmin, onEdit, onDelete }) => {
  const intl = useIntl()

  return (
    <article className="bg-surface rounded-lg overflow-hidden">
      <img src={post.image} alt={post.displayTitle} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h5 className="font-semibold mt-1">{post.displayTitle}</h5>
        <p className="text-gray-400 text-sm mt-2">{post.displayContent.slice(0, 100)}...</p>
        {isAdmin && (
          <div className="mt-3 flex items-center gap-3">
            <AdminActions onEdit={() => onEdit(post)} onDelete={() => onDelete(post.id)} />
            {!post.isTranslated && (
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
