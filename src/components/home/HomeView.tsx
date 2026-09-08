import { useIntl } from 'react-intl'
import { motion } from 'motion/react'
import type { IPost } from '../../types'
import type { IPostDisplay } from '../../lib/postLocalization'
import type { IPageBannerDescriptions } from '../../model/services/PageBannerService'
import { AddNewButton } from '../common/AddNewButton'
import { EmptyState } from '../common/EmptyState'
import { FeaturedPostCard } from './FeaturedPostCard'
import { HomeRecommendedItem } from './HomeRecommendedItem'
import { HomePostCard } from './HomePostCard'
import { HomeLifeMotto } from './HomeLifeMotto'
import { staggerContainer } from './motionVariants'

interface IHomeViewProps {
  posts: IPostDisplay[]
  featured: IPostDisplay | undefined
  rest: IPostDisplay[]
  isLoading: boolean
  isAdmin: boolean
  onEdit: (post: IPost) => void
  onDelete: (id: string) => void
  onAdd: () => void
  onSelectMemory: (post: IPost) => void
  motto: string | null
  mottoDescriptions: IPageBannerDescriptions
  onChangeMotto: (next: IPageBannerDescriptions) => void
}

export const HomeView = ({
  posts,
  featured,
  rest,
  isLoading,
  isAdmin,
  onEdit,
  onDelete,
  onAdd,
  onSelectMemory,
  motto,
  mottoDescriptions,
  onChangeMotto,
}: IHomeViewProps) => {
  const intl = useIntl()
  const hasRecommended = rest.length > 0

  if (isLoading) {
    return null
  }

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
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className={`grid grid-cols-1 gap-8 ${hasRecommended ? 'lg:grid-cols-3' : ''}`}
      >
        <FeaturedPostCard
          post={featured}
          isAdmin={isAdmin}
          onSelectMemory={onSelectMemory}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        {hasRecommended && (
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
        )}
      </motion.section>

      <HomeLifeMotto
        motto={motto}
        descriptions={mottoDescriptions}
        isAdmin={isAdmin}
        onChangeMotto={onChangeMotto}
      />

      <section className="mt-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {posts.map((post) => (
            <HomePostCard
              key={post.id}
              post={post}
              isAdmin={isAdmin}
              onSelectMemory={onSelectMemory}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </motion.div>
      </section>
    </>
  )
}
