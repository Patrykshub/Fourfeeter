import { useAppContext } from "../../router/AppContext";
import { InfoView } from "../../components/InfoView";

const InfoPage = () => {
  const { posts, isAdmin, onEdit, onDelete, onAdd } = useAppContext();
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
