import { useAppContext } from "../../router/AppContext";
import { navigate } from "../../router/useRouter";
import { HomeView } from "../../components/HomeView";
import type { Post } from "../../types";

const HomePage = () => {
  const { posts, isAdmin, onEdit, onDelete, onAdd } = useAppContext();
  const [featured, ...rest] = posts;

  const handleSelectMemory = (post: Post) => {
    navigate(`/memories?highlight=${post.id}`);
  };

  return (
    <HomeView
      posts={posts}
      featured={featured}
      rest={rest}
      isAdmin={isAdmin}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
      onSelectMemory={handleSelectMemory}
    />
  );
};

export { HomePage };
