import type { Post } from '../types'
import { AdminActions } from './AdminActions'
import { EmptyState } from './EmptyState'

interface IInfoViewProps {
  posts: Post[]
  isAdmin: boolean
  onEdit: (post: Post) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

const InfoView = ({ posts, isAdmin, onEdit, onDelete, onAdd }: IInfoViewProps) => {
  if (posts.length === 0) {
    return <EmptyState message="Brak wpisów w tej kategorii." isAdmin={isAdmin} onAdd={onAdd} />
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="uppercase text-sm text-gray-300">Indeks</h2>
        {isAdmin && (
          <button onClick={onAdd} className="flex items-center gap-2 text-neon">
            Dodaj nowy
          </button>
        )}
      </div>

      <div className="border-y border-white/10 divide-y divide-white/10">
        {posts.map((post) => (
          <article key={post.id} className="flex items-center gap-4 py-4">
            <span className="hidden sm:inline-block shrink-0 w-20 text-xs uppercase tracking-wide text-neon">
              {post.category}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{post.title}</h3>
              <p className="text-sm text-gray-400 truncate">{post.content.slice(0, 90)}...</p>
            </div>
            {isAdmin && (
              <AdminActions compact onEdit={() => onEdit(post)} onDelete={() => onDelete(post.id)} />
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export { InfoView }
