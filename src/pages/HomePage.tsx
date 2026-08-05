import type { Post } from "../types";
import { HomeView } from "../components/HomeView";

interface IHomePageProps {
  posts: Post[];
  isAdmin: boolean;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSelectMemory: (post: Post) => void;
}

const HomePage = ({
  posts,
  isAdmin,
  onEdit,
  onDelete,
  onAdd,
  onSelectMemory,
}: IHomePageProps) => {
  const memoryPosts = posts.filter((post) => post.category === "MEMORIES");
  const [featured, ...rest] = memoryPosts;

  return (
    <HomeView
      posts={posts}
      featured={featured}
      rest={rest}
      isAdmin={isAdmin}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
      onSelectMemory={onSelectMemory}
    />
  );
};

export { HomePage };
