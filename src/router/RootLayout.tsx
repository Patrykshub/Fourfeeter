import { useState } from "react";
import type { ReactNode } from "react";
import { useIntl } from "react-intl";
import { usePosts } from "../hooks/usePosts";
import { useAdminSession } from "../hooks/useAdminSession";
import { usePostEditor } from "../hooks/usePostEditor";
import { useLocale } from "../i18n/LocaleContext";
import { hasPostTranslation, toPostDisplay } from "../lib/postLocalization";
import { Header } from "../components/common/Header";
import { AdminFooter } from "../components/common/AdminFooter";
import { EditorModal } from "../components/modals/EditorModal";
import { AuthModal } from "../components/modals/AuthModal";
import { ConfirmDialog } from "../components/modals/ConfirmDialog";
import areYouSureImage from "../assets/are-you-sure.png";
import { AppContext } from "./AppContext";
import { navigate, useRouter } from "./useRouter";

interface IRootLayoutProps {
  children: ReactNode;
}

export const RootLayout = ({ children }: IRootLayoutProps) => {
  const intl = useIntl();
  const { posts, isLoading, savePost, deletePost } = usePosts();
  const { isAdmin, login, logout } = useAdminSession();
  const { locale } = useLocale();
  const { pathname } = useRouter();
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

  const visiblePosts = isAdmin
    ? posts
    : posts.filter((post) => hasPostTranslation(post, locale));
  const displayPosts = visiblePosts.map((post) => toPostDisplay(post, locale, intl));

  const contextValue = {
    posts: displayPosts,
    isLoading,
    isAdmin,
    onEdit: openEditor,
    onDelete: handleDelete,
    onAdd: () => openEditor(),
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen px-4 sm:px-8 lg:px-16 pb-16">
        <Header pathname={pathname} onNavigate={navigate} />

        <main className="max-w-[1600px] mx-auto">{children}</main>

        <AdminFooter
          isAdmin={isAdmin}
          onLogout={logout}
          onLoginClick={() => setAuthOpen(true)}
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
