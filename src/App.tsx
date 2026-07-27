import { useMemo, useState } from 'react'
import { Lock } from 'lucide-react'
import { usePosts } from './hooks/usePosts'
import { useAdminSession } from './hooks/useAdminSession'
import { Header } from './components/Header'
import { AdminActions } from './components/AdminActions'
import { EditorModal } from './components/EditorModal'
import { AuthModal } from './components/AuthModal'
import type { Post } from './types'

export default function App() {
  const { posts, savePost, deletePost } = usePosts()
  const { isAdmin, login } = useAdminSession()

  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [isFormOpen, setFormOpen] = useState(false)

  const filteredPosts = useMemo(
    () => (activeCategory ? posts.filter((p) => p.category === activeCategory) : posts),
    [posts, activeCategory],
  )
  const [featured, ...rest] = filteredPosts

  function handleDelete(id: string) {
    if (!confirm('Usuń ten post?')) return
    deletePost(id)
  }

  function openEditor(post?: Post) {
    setEditing(post ?? null)
    setFormOpen(true)
  }

  function handleSave(data: Omit<Post, 'id' | 'date'> & { id?: string }) {
    savePost(data)
    setFormOpen(false)
  }

  function handleLogin(user: string, pass: string): boolean {
    return login(user, pass)
  }

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-16 pb-16">
      <Header activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      <main className="max-w-6xl mx-auto">
        {!featured ? (
          <div className="text-center text-gray-400 py-16">
            Brak postów w tej kategorii.
            {isAdmin && (
              <div className="mt-4">
                <button onClick={() => openEditor()} className="btn-admin">
                  Dodaj nowy
                </button>
              </div>
            )}
          </div>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2 bg-[#071018] rounded-xl overflow-hidden">
              <img src={featured.image} alt={featured.title} className="w-full h-64 sm:h-96 object-cover" />
              <div className="p-6">
                <div className="text-sm text-neon font-medium">{featured.category}</div>
                <h2 className="text-2xl sm:text-3xl font-bold mt-2">{featured.title}</h2>
                <p className="mt-3 text-gray-300">{featured.content}</p>
                {isAdmin && (
                  <AdminActions
                    className="mt-4"
                    onEdit={() => openEditor(featured)}
                    onDelete={() => handleDelete(featured.id)}
                  />
                )}
              </div>
            </article>

            <aside className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="uppercase text-sm text-gray-300">Polecane</h3>
                {isAdmin && (
                  <button onClick={() => openEditor()} className="flex items-center gap-2 text-neon">
                    Dodaj nowy
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {rest.map((p) => (
                  <div key={p.id} className="flex gap-3 items-center bg-[#071018] p-3 rounded-lg">
                    <img src={p.image} alt={p.title} className="w-20 h-14 object-cover rounded" />
                    <div className="flex-1">
                      <div className="text-xs text-neon font-medium">{p.category}</div>
                      <div className="font-semibold">{p.title}</div>
                      <div className="text-sm text-gray-400">{p.content.slice(0, 70)}...</div>
                    </div>
                    {isAdmin && (
                      <AdminActions compact onEdit={() => openEditor(p)} onDelete={() => handleDelete(p.id)} />
                    )}
                  </div>
                ))}
              </div>
            </aside>
          </section>
        )}

        {filteredPosts.length > 0 && (
          <section className="mt-10">
            <h4 className="uppercase text-sm text-gray-300 mb-4">Wszystkie posty</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((p) => (
                <article key={p.id} className="bg-[#071018] rounded-lg overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <div className="text-xs text-neon font-medium">{p.category}</div>
                    <h5 className="font-semibold mt-1">{p.title}</h5>
                    <p className="text-gray-400 text-sm mt-2">{p.content.slice(0, 100)}...</p>
                    {isAdmin && (
                      <AdminActions
                        className="mt-3"
                        onEdit={() => openEditor(p)}
                        onDelete={() => handleDelete(p.id)}
                      />
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="fixed bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-black/30 px-4 py-2 rounded-full flex items-center gap-3">
          <button onClick={() => setAuthOpen(true)} title="Admin" className="flex items-center gap-2">
            <Lock />
          </button>
          <div className="text-sm text-gray-400">Minimal SPA Blog • client-only</div>
        </div>
      </footer>

      {isFormOpen && <EditorModal post={editing} onClose={() => setFormOpen(false)} onSave={handleSave} />}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onLogin={handleLogin} />}
    </div>
  )
}
