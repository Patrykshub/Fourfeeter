import type { Post } from '../types'
import { AdminActions } from './AdminActions'
import { EmptyState } from './EmptyState'

interface IHomeViewProps {
  posts: Post[]
  featured: Post | undefined
  rest: Post[]
  isAdmin: boolean
  onEdit: (post: Post) => void
  onDelete: (id: string) => void
  onAdd: () => void
  onSelectMemory: (post: Post) => void
}

const HomeView = ({
  posts,
  featured,
  rest,
  isAdmin,
  onEdit,
  onDelete,
  onAdd,
  onSelectMemory,
}: IHomeViewProps) => {
  if (!featured) {
    return <EmptyState message="Brak postów w tej kategorii." isAdmin={isAdmin} onAdd={onAdd} />
  }

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 bg-[#071018] rounded-xl overflow-hidden">
          <img
            src={featured.image}
            alt={featured.title}
            className="w-full h-64 sm:h-96 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">{featured.title}</h2>
            <p className="mt-3 text-gray-300">{featured.content}</p>
            {isAdmin && (
              <AdminActions
                className="mt-4"
                onEdit={() => onEdit(featured)}
                onDelete={() => onDelete(featured.id)}
              />
            )}
          </div>
        </article>

        <aside className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="uppercase text-sm text-gray-300">Polecane</h3>
            {isAdmin && (
              <button onClick={onAdd} className="flex items-center gap-2 text-neon">
                Dodaj nowy
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {rest.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectMemory(post)}
                className="flex gap-3 items-center bg-[#071018] p-3 rounded-lg cursor-pointer hover:bg-[#0c1c29]"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-20 h-14 object-cover rounded"
                />
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
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-10">
        <h4 className="uppercase text-sm text-gray-300 mb-4">Wszystkie posty</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-[#071018] rounded-lg overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h5 className="font-semibold mt-1">{post.title}</h5>
                <p className="text-gray-400 text-sm mt-2">{post.content.slice(0, 100)}...</p>
                {isAdmin && (
                  <AdminActions
                    className="mt-3"
                    onEdit={() => onEdit(post)}
                    onDelete={() => onDelete(post.id)}
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export { HomeView }
