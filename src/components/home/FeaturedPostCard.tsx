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
      className="lg:col-span-2 relative rounded-xl overflow-hidden cursor-pointer"
    >
      <img src={post.image} alt={post.displayTitle} className="w-full aspect-video max-h-[500px] object-cover" />
      <div className="absolute inset-0 shadow-[inset_0_0_40px_12px_rgba(0,0,0,0.55),inset_0_-240px_170px_-40px_rgba(0,0,0,0.95)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{post.displayTitle}</h2>
        <p className="mt-3 text-gray-200 whitespace-pre-wrap">{post.displayContent.slice(0, 200)}...</p>
        <p className="mt-3 text-neon font-medium">{intl.formatMessage({ id: 'home.readMore' })}</p>
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
