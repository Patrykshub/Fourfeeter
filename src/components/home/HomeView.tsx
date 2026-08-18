import { useIntl } from 'react-intl'
import type { IPost } from '../../types'
import type { IPostDisplay } from '../../lib/postLocalization'
import { AddNewButton } from '../common/AddNewButton'
import { EmptyState } from '../common/EmptyState'
import { FeaturedPostCard } from './FeaturedPostCard'
import { HomeRecommendedItem } from './HomeRecommendedItem'
import { HomePostCard } from './HomePostCard'

interface IHomeViewProps {
  posts: IPostDisplay[]
  featured: IPostDisplay | undefined
  rest: IPostDisplay[]
  isAdmin: boolean
  onEdit: (post: IPost) => void
  onDelete: (id: string) => void
  onAdd: () => void
  onSelectMemory: (post: IPost) => void
}

export const HomeView = ({
  posts,
  featured,
  rest,
  isAdmin,
  onEdit,
  onDelete,
  onAdd,
  onSelectMemory,
}: IHomeViewProps) => {
  const intl = useIntl()

  if (!featured) {
    return (
      <EmptyState
        message={intl.formatMessage({ id: 'home.emptyState' })}
        isAdmin={isAdmin}
        onAdd={onAdd}
      />
    )
  }

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <FeaturedPostCard
          post={featured}
          isAdmin={isAdmin}
          onSelectMemory={onSelectMemory}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <aside className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="uppercase text-sm text-gray-300">
              {intl.formatMessage({ id: 'home.recommended' })}
            </h3>
            <AddNewButton isAdmin={isAdmin} onClick={onAdd} />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {rest.map((post) => (
              <HomeRecommendedItem
                key={post.id}
                post={post}
                isAdmin={isAdmin}
                onSelectMemory={onSelectMemory}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-10">
        <h4 className="uppercase text-sm text-gray-300 mb-4">
          {intl.formatMessage({ id: 'home.allPosts' })}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <HomePostCard key={post.id} post={post} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </section>
    </>
  )
}
