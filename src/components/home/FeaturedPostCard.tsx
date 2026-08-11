import type { FC } from 'react'
import type { IPost } from '../../types'
import { AdminActions } from '../common/AdminActions'

interface IFeaturedPostCardProps {
  post: IPost
  isAdmin: boolean
  onEdit: (post: IPost) => void
  onDelete: (id: string) => void
}

const FeaturedPostCard: FC<IFeaturedPostCardProps> = ({ post, isAdmin, onEdit, onDelete }) => {
  return (
    <article className="lg:col-span-2 bg-[#071018] rounded-xl overflow-hidden">
      <img src={post.image} alt={post.title} className="w-full h-64 sm:h-96 object-cover" />
      <div className="p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mt-2">{post.title}</h2>
        <p className="mt-3 text-gray-300 whitespace-pre-wrap">{post.content}</p>
        {isAdmin && (
          <AdminActions className="mt-4" onEdit={() => onEdit(post)} onDelete={() => onDelete(post.id)} />
        )}
      </div>
    </article>
  )
}

export { FeaturedPostCard }
