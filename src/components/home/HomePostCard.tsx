import type { FC } from 'react'
import { useIntl } from 'react-intl'
import type { IPost } from '../../types'
import type { IPostDisplay } from '../../lib/postLocalization'
import { AdminActions } from '../common/AdminActions'

interface IHomePostCardProps {
  post: IPostDisplay
  isAdmin: boolean
  onSelectMemory: (post: IPost) => void
  onEdit: (post: IPost) => void
  onDelete: (id: string) => void
}

export const HomePostCard: FC<IHomePostCardProps> = ({ post, isAdmin, onSelectMemory, onEdit, onDelete }) => {
  const intl = useIntl()

  return (
    <article
      onClick={() => onSelectMemory(post)}
      className="card-float relative rounded-lg overflow-hidden cursor-pointer"
    >
      <img src={post.image} alt={post.displayTitle} className="w-full aspect-[4/3] sm:aspect-[3/4] object-cover" />
      <div className="absolute inset-0 shadow-[inset_0_0_24px_8px_rgba(0,0,0,0.5),inset_0_-90px_70px_-20px_rgba(0,0,0,0.9)] sm:shadow-[inset_0_0_40px_12px_rgba(0,0,0,0.55),inset_0_-160px_110px_-40px_rgba(0,0,0,0.95)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h5 className="text-lg sm:text-xl font-semibold text-white">{post.displayTitle}</h5>
        {isAdmin && (
          <div className="mt-3 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
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
