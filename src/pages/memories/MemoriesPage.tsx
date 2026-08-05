import { useAppContext } from "../../router/AppContext";
import { useRouter } from "../../router/useRouter";
import { MemoriesView } from "../../components/MemoriesView";

const MemoriesPage = () => {
  const { posts, isAdmin, onEdit, onDelete, onAdd } = useAppContext();
  const { search } = useRouter();
  const highlightId = new URLSearchParams(search).get("highlight");
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
