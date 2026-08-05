import { useState } from "react";
import { usePosts } from "./hooks/usePosts";
import { useAdminSession } from "./hooks/useAdminSession";
import { useFontPreference } from "./hooks/useFontPreference";
import { usePostEditor } from "./hooks/usePostEditor";
import { Header } from "./components/Header";
import type { Category } from "./components/CategorySelect";
import { AppRouter } from "./router/AppRouter";
import { EditorModal } from "./components/EditorModal";
import { AuthModal } from "./components/AuthModal";
import { AdminFooter } from "./components/AdminFooter";
import type { Post } from "./types";

const App = () => {
  const { posts, savePost, deletePost } = usePosts();
  const { isAdmin, login, logout } = useAdminSession();
  const { font, setFont } = useFontPreference();
  const { editing, isFormOpen, openEditor, closeEditor, handleSave, handleDelete } =
    usePostEditor({ savePost, deletePost });

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(
    null,
  );

  const handleSelectMemory = (post: Post) => {
    setActiveCategory("MEMORIES");
    setHighlightedPostId(post.id);
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-16 pb-16">
      <Header
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <main className="max-w-6xl mx-auto">
        <AppRouter
          activeCategory={activeCategory}
          posts={posts}
          isAdmin={isAdmin}
          onEdit={openEditor}
          onDelete={handleDelete}
          onAdd={() => openEditor()}
          onSelectMemory={handleSelectMemory}
          highlightId={highlightedPostId}
        />
      </main>

      <AdminFooter
        isAdmin={isAdmin}
        onLogout={logout}
        onLoginClick={() => setAuthOpen(true)}
        font={font}
        onFontChange={setFont}
      />

      {isFormOpen && (
        <EditorModal post={editing} onClose={closeEditor} onSave={handleSave} />
      )}

      {authOpen && (
        <AuthModal onClose={() => setAuthOpen(false)} onLogin={login} />
      )}
    </div>
  );
};

export default App;
