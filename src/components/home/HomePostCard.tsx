import type { FC } from 'react'
import type { IPost } from '../../types'
import { AdminActions } from '../common/AdminActions'

interface IHomePostCardProps {
  post: IPost
  isAdmin: boolean
  onEdit: (post: IPost) => void
  onDelete: (id: string) => void
}

const HomePostCard: FC<IHomePostCardProps> = ({ post, isAdmin, onEdit, onDelete }) => {
  return (
    <article className="bg-[#071018] rounded-lg overflow-hidden">
      <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h5 className="font-semibold mt-1">{post.title}</h5>
        <p className="text-gray-400 text-sm mt-2">{post.content.slice(0, 100)}...</p>
        {isAdmin && (
          <AdminActions className="mt-3" onEdit={() => onEdit(post)} onDelete={() => onDelete(post.id)} />
        )}
      </div>
    </article>
  )
}

export { HomePostCard }
