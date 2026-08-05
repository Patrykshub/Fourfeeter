import { useAppContext } from "../../router/AppContext";
import { useRouter } from "../../router/useRouter";
import { MemoriesView } from "../../components/MemoriesView";

const MemoriesPage = () => {
  const { posts, isAdmin, onEdit, onDelete, onAdd } = useAppContext();
  const { search } = useRouter();
  const highlightId = new URLSearchParams(search).get("highlight");

  return (
    <MemoriesView
      posts={posts}
      isAdmin={isAdmin}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
      highlightId={highlightId}
    />
  );
};

export { MemoriesPage };
