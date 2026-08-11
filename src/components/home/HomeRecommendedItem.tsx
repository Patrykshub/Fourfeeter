import type { FC } from 'react'
import type { IPost } from '../../types'
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
  return (
    <div
      onClick={() => onSelectMemory(post)}
      className="flex gap-3 items-center bg-[#071018] p-3 rounded-lg cursor-pointer hover:bg-[#0c1c29]"
    >
      <img src={post.image} alt={post.title} className="w-20 h-14 object-cover rounded" />
      <div className="flex-1">
        <div className="font-semibold">{post.title}</div>
        <div className="text-sm text-gray-400">{post.content.slice(0, 70)}...</div>
      </div>
      {isAdmin && (
        <div onClick={(e) => e.stopPropagation()}>
          <AdminActions compact onEdit={() => onEdit(post)} onDelete={() => onDelete(post.id)} />
        </div>
      )}
    </div>
  )
}

export { HomeRecommendedItem }
