import { useState } from "react";
import { useIntl } from "react-intl";
import type { IPost } from "../types";

interface IUsePostEditorParams {
  savePost: (data: Omit<IPost, "id" | "date"> & { id?: string }) => void;
  deletePost: (id: string) => void;
}

const usePostEditor = ({ savePost, deletePost }: IUsePostEditorParams) => {
  const intl = useIntl();
  const [editing, setEditing] = useState<IPost | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);

  const openEditor = (post?: IPost) => {
    setEditing(post ?? null);
    setFormOpen(true);
  };

  const closeEditor = () => {
    setFormOpen(false);
  };

  const handleSave = (data: Omit<IPost, "id" | "date"> & { id?: string }) => {
    savePost(data);
    setFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm(intl.formatMessage({ id: "confirm.deletePost" }))) return;
    deletePost(id);
  };

  return { editing, isFormOpen, openEditor, closeEditor, handleSave, handleDelete };
};

export { usePostEditor };
