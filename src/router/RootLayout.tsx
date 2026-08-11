import { useState } from "react";
import type { ReactNode } from "react";
import { useIntl } from "react-intl";
import { usePosts } from "../hooks/usePosts";
import { useAdminSession } from "../hooks/useAdminSession";
import { useFontPreference } from "../hooks/useFontPreference";
import { usePostEditor } from "../hooks/usePostEditor";
import { Header } from "../components/common/Header";
import { AdminFooter } from "../components/common/AdminFooter";
import { EditorModal } from "../components/modals/EditorModal";
import { AuthModal } from "../components/modals/AuthModal";
import { ConfirmDialog } from "../components/modals/ConfirmDialog";
import areYouSureImage from "../assets/are-you-sure.png";
import { AppContext } from "./AppContext";

interface IRootLayoutProps {
  children: ReactNode;
}

export const RootLayout = ({ children }: IRootLayoutProps) => {
  const intl = useIntl();
  const { posts, savePost, deletePost } = usePosts();
  const { isAdmin, login, logout } = useAdminSession();
  const { font, setFont } = useFontPreference();
  const {
    editing,
    isFormOpen,
    pendingDeleteId,
    openEditor,
    closeEditor,
    handleSave,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = usePostEditor({ savePost, deletePost });

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
          <EditorModal
            post={editing}
            onClose={closeEditor}
            onSave={handleSave}
          />
        )}

        {authOpen && (
          <AuthModal onClose={() => setAuthOpen(false)} onLogin={login} />
        )}

        {pendingDeleteId && (
          <ConfirmDialog
            title={intl.formatMessage({ id: "common.delete" })}
            imageSrc={areYouSureImage}
            imageAlt="Are you sure about that?"
            confirmLabel={intl.formatMessage({ id: "common.delete" })}
            cancelLabel={intl.formatMessage({ id: "common.cancel" })}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </div>
    </AppContext.Provider>
  );
};
