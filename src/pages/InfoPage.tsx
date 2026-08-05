import type { Post } from "../types";
import { InfoView } from "../components/InfoView";

interface IInfoPageProps {
  posts: Post[];
  isAdmin: boolean;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const InfoPage = ({ posts, isAdmin, onEdit, onDelete, onAdd }: IInfoPageProps) => {
  const infoPosts = posts.filter((post) => post.category === "INFO");

  return (
    <InfoView
      posts={infoPosts}
      isAdmin={isAdmin}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
    />
  );
};

export { InfoPage };
