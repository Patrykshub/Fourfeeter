import { useAppContext } from "../../router/AppContext";
import { useRouter } from "../../router/useRouter";
import { usePageBanner } from "../../hooks/usePageBanner";
import { MemoriesView } from "../../components/memories/MemoriesView";

export const MemoriesPage = () => {
  const { posts, isAdmin, onEdit, onDelete, onAdd } = useAppContext();
  const { search } = useRouter();
  const highlightId = new URLSearchParams(search).get("highlight");
  const { banner, setBanner } = usePageBanner("memories");

  return (
    <MemoriesView
      posts={posts}
      isAdmin={isAdmin}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
      highlightId={highlightId}
      banner={banner}
      onChangeBanner={setBanner}
    />
  );
};
