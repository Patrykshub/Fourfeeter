import type { Post } from "../types";
import { MemoriesView } from "../components/MemoriesView";

interface IMemoriesPageProps {
  posts: Post[];
  isAdmin: boolean;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  highlightId: string | null;
}

const MemoriesPage = ({
  posts,
  isAdmin,
  onEdit,
  onDelete,
  onAdd,
  highlightId,
}: IMemoriesPageProps) => {
  const memoryPosts = posts.filter((post) => post.category === "MEMORIES");

  return (
    <MemoriesView
      posts={memoryPosts}
      isAdmin={isAdmin}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
      highlightId={highlightId}
    />
  );
};

export { MemoriesPage };
