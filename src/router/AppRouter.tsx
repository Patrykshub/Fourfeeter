import type { Category } from "../components/CategorySelect";
import { HomePage } from "../pages/HomePage";
import { MemoriesPage } from "../pages/MemoriesPage";
import { InfoPage } from "../pages/InfoPage";
import type { Post } from "../types";

interface IAppRouterProps {
  activeCategory: Category | null;
  posts: Post[];
  isAdmin: boolean;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSelectMemory: (post: Post) => void;
  highlightId: string | null;
}

export const AppRouter = ({
  activeCategory,
  posts,
  isAdmin,
  onEdit,
  onDelete,
  onAdd,
  onSelectMemory,
  highlightId,
}: IAppRouterProps) => {
  switch (activeCategory) {
    case "MEMORIES":
      return (
        <MemoriesPage
          posts={posts}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
          highlightId={highlightId}
        />
      );
    case "INFO":
      return (
        <InfoPage
          posts={posts}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
        />
      );
    default:
      return (
        <HomePage
          posts={posts}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
          onSelectMemory={onSelectMemory}
        />
      );
  }
};
