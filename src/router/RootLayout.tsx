import { useState } from "react";
import type { ReactNode } from "react";
import { usePosts } from "../hooks/usePosts";
import { useAdminSession } from "../hooks/useAdminSession";
import { useFontPreference } from "../hooks/useFontPreference";
import { usePostEditor } from "../hooks/usePostEditor";
import { Header } from "../components/Header";
import { AdminFooter } from "../components/AdminFooter";
import { EditorModal } from "../components/EditorModal";
import { AuthModal } from "../components/AuthModal";
import { AppContext } from "./AppContext";

interface IRootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: IRootLayoutProps) => {
  const { posts, savePost, deletePost } = usePosts();
  const { isAdmin, login, logout } = useAdminSession();
  const { font, setFont } = useFontPreference();
  const { editing, isFormOpen, openEditor, closeEditor, handleSave, handleDelete } =
    usePostEditor({ savePost, deletePost });

  const [authOpen, setAuthOpen] = useState(false);

  const contextValue = {
    posts,
    isAdmin,
    onEdit: openEditor,
    onDelete: handleDelete,
    onAdd: () => openEditor(),
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen px-4 sm:px-8 lg:px-16 pb-16">
        <Header />

        <main className="max-w-6xl mx-auto">{children}</main>

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
    </AppContext.Provider>
  );
};

export { RootLayout };
