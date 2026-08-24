import { useAppContext } from "../../router/AppContext";
import { navigate } from "../../router/useRouter";
import { HomeView } from "../../components/home/HomeView";
import type { IPost } from "../../types";

export const HomePage = () => {
  const { posts, isLoading, isAdmin, onEdit, onDelete, onAdd } = useAppContext();
  const [featured, ...rest] = posts;

  const handleSelectMemory = (post: IPost) => {
    navigate(`/memories?highlight=${post.id}`);
  };

  return (
    <HomeView
      posts={posts}
      featured={featured}
      rest={rest}
      isLoading={isLoading}
      isAdmin={isAdmin}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
      onSelectMemory={handleSelectMemory}
    />
  );
};
