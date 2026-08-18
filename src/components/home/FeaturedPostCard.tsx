import type { FC } from 'react'
import { useIntl } from 'react-intl'
import type { IPost } from '../../types'
import type { IPostDisplay } from '../../lib/postLocalization'
import { AdminActions } from '../common/AdminActions'

interface IFeaturedPostCardProps {
  post: IPostDisplay
  isAdmin: boolean
  onSelectMemory: (post: IPost) => void
  onEdit: (post: IPost) => void
  onDelete: (id: string) => void
}

export const FeaturedPostCard: FC<IFeaturedPostCardProps> = ({ post, isAdmin, onSelectMemory, onEdit, onDelete }) => {
  const intl = useIntl()

  return (
    <article
      onClick={() => onSelectMemory(post)}
      className="lg:col-span-2 bg-surface rounded-xl overflow-hidden cursor-pointer hover:bg-surfaceHover"
    >
      <img src={post.image} alt={post.displayTitle} className="w-full h-64 sm:h-96 object-cover" />
      <div className="p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mt-2">{post.displayTitle}</h2>
        <p className="mt-3 text-gray-300 whitespace-pre-wrap">{post.displayContent.slice(0, 200)}...</p>
        {isAdmin && (
          <div className="mt-4 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
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
