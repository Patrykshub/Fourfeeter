import { useAppContext } from "../../router/AppContext";
import { useRouter } from "../../router/useRouter";
import { usePageBanner } from "../../hooks/usePageBanner";
import { MemoriesView } from "../../components/memories/MemoriesView";

export const MemoriesPage = () => {
  const { posts, isAdmin, onEdit, onDelete, onAdd, isLoading } = useAppContext();
  const { search } = useRouter();
  const highlightId = new URLSearchParams(search).get("highlight");
  const initialModalPost = posts.find((post) => post.id === highlightId) ?? null;
  const { banner, setBanner } = usePageBanner("memories");

  return (
    <MemoriesView
      posts={posts}
      isAdmin={isAdmin}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
      isLoading={isLoading}
      initialModalPost={initialModalPost}
      banner={banner}
      onChangeBanner={setBanner}
    />
  );
};
