import type { FC } from 'react'
import { useIntl } from 'react-intl'
import { motion } from 'motion/react'
import type { IPost } from '../../types'
import type { IPostDisplay } from '../../lib/postLocalization'
import { AdminActions } from '../common/AdminActions'
import { fadeInUp } from '../../lib/motionVariants'

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
    <motion.article
      variants={fadeInUp}
      onClick={() => onSelectMemory(post)}
      className="card-float rounded-lg overflow-hidden bg-surface cursor-pointer"
    >
      <img
        src={post.image}
        alt={post.displayTitle}
        loading="lazy"
        decoding="async"
        className="w-full aspect-[7/3] object-cover"
      />
      <div className="p-4">
        <h5 className="text-lg sm:text-xl font-semibold text-white">{post.displayTitle}</h5>
        <div className="mt-1 text-sm text-gray-400">
          {intl.formatDate(post.date, { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
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
    </motion.article>
  )
}
