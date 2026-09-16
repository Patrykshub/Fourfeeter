import { useIntl } from 'react-intl'
import { motion } from 'motion/react'
import type { IPost } from '../../types'
import type { IPostDisplay } from '../../lib/postLocalization'
import type { IPageBannerDescriptions } from '../../model/services/PageBannerService'
import { AddNewButton } from '../common/AddNewButton'
import { EmptyState } from '../common/EmptyState'
import { SectionLabel } from '../common/SectionLabel'
import { FeaturedPostCard } from './FeaturedPostCard'
import { HomePostCard } from './HomePostCard'
import { HomeComingSoonCard } from './HomeComingSoonCard'
import { HomeLifeMotto } from './HomeLifeMotto'
import { staggerContainer } from '../../lib/motionVariants'

const MIN_GRID_CARDS = 3

interface IHomeViewProps {
  posts: IPostDisplay[]
  featured: IPostDisplay | undefined
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

  const comingSoonCount = Math.max(0, MIN_GRID_CARDS - posts.length)

  return (
    <>
      <section className="space-y-4">
        <SectionLabel>{intl.formatMessage({ id: 'home.latestPost' })}</SectionLabel>
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          <FeaturedPostCard
            post={featured}
            isAdmin={isAdmin}
            onSelectMemory={onSelectMemory}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </motion.div>
      </section>

      <HomeLifeMotto
        motto={motto}
        descriptions={mottoDescriptions}
        isAdmin={isAdmin}
        onChangeMotto={onChangeMotto}
      />

      <section className="mt-10 space-y-4">
        <div className="flex items-center justify-between">
          <SectionLabel>{intl.formatMessage({ id: 'home.allPosts' })}</SectionLabel>
          <AddNewButton isAdmin={isAdmin} onClick={onAdd} />
        </div>

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
          {Array.from({ length: comingSoonCount }).map((_, index) => (
            <HomeComingSoonCard key={`coming-soon-${index}`} />
          ))}
        </motion.div>
      </section>
    </>
  )
}
