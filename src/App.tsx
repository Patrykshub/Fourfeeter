import { useMemo, useState } from 'react'
import { Lock, LogOut } from 'lucide-react'
import { usePosts } from './hooks/usePosts'
import { useAdminSession } from './hooks/useAdminSession'
import { useFontPreference } from './hooks/useFontPreference'
import { Header } from './components/Header'
import type { Category } from './components/CategorySelect'
import { HomeView } from './components/HomeView'
import { MemoriesView } from './components/MemoriesView'
import { InfoView } from './components/InfoView'
import { EditorModal } from './components/EditorModal'
import { AuthModal } from './components/AuthModal'
import { FontPicker } from './components/FontPicker'
import type { Post } from './types'

const App = () => {
  const { posts, savePost, deletePost } = usePosts()
  const { isAdmin, login, logout } = useAdminSession()
  const { font, setFont } = useFontPreference()

  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [isFormOpen, setFormOpen] = useState(false)

  const filteredPosts = useMemo(
    () =>
      activeCategory
        ? posts.filter((p) => p.category === activeCategory)
        : posts,
    [posts, activeCategory],
  )

  const handleDelete = (id: string) => {
    if (!confirm('Usuń ten post?')) return
    deletePost(id)
  }

  const openEditor = (post?: Post) => {
    setEditing(post ?? null)
    setFormOpen(true)
  }

  const handleSave = (data: Omit<Post, 'id' | 'date'> & { id?: string }) => {
    savePost(data)
    setFormOpen(false)
  }

  const handleLogin = (user: string, pass: string): boolean => login(user, pass)

  const renderView = () => {
    const viewProps = {
      posts: filteredPosts,
      isAdmin,
      onEdit: openEditor,
      onDelete: handleDelete,
      onAdd: () => openEditor(),
    }

    switch (activeCategory) {
      case 'MEMORIES':
        return <MemoriesView {...viewProps} />
      case 'INFO':
        return <InfoView {...viewProps} />
      default:
        return <HomeView {...viewProps} />
    }
  }

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-16 pb-16">
      <Header
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <main className="max-w-6xl mx-auto">{renderView()}</main>

      <footer className="fixed bottom-4 left-0 right-0 flex justify-center px-4">
        <div className="bg-black/30 px-4 py-2 rounded-full flex items-center gap-2 sm:gap-3 max-w-full">
          {isAdmin ? (
            <button onClick={logout} title="Wyloguj" className="flex items-center gap-2 shrink-0">
              <LogOut size={20} />
            </button>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              title="Admin"
              className="flex items-center gap-2 shrink-0"
            >
              <Lock size={20} />
            </button>
          )}

          <FontPicker font={font} onChange={setFont} />

          <div className="hidden sm:block text-sm text-gray-400 whitespace-nowrap">
            Minimal SPA Blog • client-only
          </div>
        </div>
      </footer>

      {isFormOpen && (
        <EditorModal
          post={editing}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />
      )}

      {authOpen && (
        <AuthModal onClose={() => setAuthOpen(false)} onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
