import { useEffect, useRef, useState } from 'react'
import type { Post } from '../types'
import { AdminActions } from './AdminActions'
import { EmptyState } from './EmptyState'

interface IMemoriesViewProps {
  posts: Post[]
  isAdmin: boolean
  onEdit: (post: Post) => void
  onDelete: (id: string) => void
  onAdd: () => void
  highlightId?: string | null
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })

const MemoriesView = ({ posts, isAdmin, onEdit, onDelete, onAdd, highlightId }: IMemoriesViewProps) => {
  const itemRefs = useRef<Record<string, HTMLElement | null>>({})
  const [highlighted, setHighlighted] = useState(highlightId ?? null)

  useEffect(() => {
    if (!highlightId) return
    itemRefs.current[highlightId]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const timeout = setTimeout(() => setHighlighted(null), 2000)
    return () => clearTimeout(timeout)
  }, [highlightId])

  if (posts.length === 0) {
    return <EmptyState message="Brak wspomnień w tej kategorii." isAdmin={isAdmin} onAdd={onAdd} />
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="uppercase text-sm text-gray-300">Oś wspomnień</h2>
        {isAdmin && (
          <button onClick={onAdd} className="flex items-center gap-2 text-neon">
            Dodaj nowy
          </button>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-neon/40 lg:-translate-x-1/2" />

        <div className="space-y-10">
          {posts.map((post, index) => {
            const isRight = index % 2 === 1
            return (
              <div key={post.id} className="relative pl-10 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-x-12">
                <span className="absolute left-4 lg:left-1/2 top-2 w-3 h-3 -translate-x-1/2 rounded-full bg-neon" />
                <article
                  ref={(el) => {
                    itemRefs.current[post.id] = el
                  }}
                  className={`bg-[#071018] rounded-xl overflow-hidden transition-shadow duration-500 ${
                    isRight ? 'lg:col-start-2' : 'lg:col-start-1'
                  } ${highlighted === post.id ? 'ring-2 ring-neon' : ''}`}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-56 sm:h-64 lg:h-72 object-cover"
                  />
                  <div className="p-5">
                    <div className="text-xs text-neon font-medium">{formatDate(post.date)}</div>
                    <h3 className="text-xl font-semibold mt-1">{post.title}</h3>
                    <p className="mt-2 text-gray-300 text-sm">{post.content}</p>
                    {isAdmin && (
                      <AdminActions
                        className="mt-4"
                        onEdit={() => onEdit(post)}
                        onDelete={() => onDelete(post.id)}
                      />
                    )}
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { MemoriesView }
