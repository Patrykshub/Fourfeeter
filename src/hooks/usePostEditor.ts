import { useState } from "react";
import { useIntl } from "react-intl";
import type { IPost } from "../types";

interface IUsePostEditorParams {
  savePost: (data: Omit<IPost, "id" | "date"> & { id?: string }) => void;
  deletePost: (id: string) => void;
}

export const usePostEditor = ({ savePost, deletePost }: IUsePostEditorParams) => {
  const intl = useIntl();
  const [editing, setEditing] = useState<IPost | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const openEditor = (post?: IPost) => {
    setEditing(post ?? null);
    setFormOpen(true);
  };

  const closeEditor = () => {
    setFormOpen(false);
  };

  const handleSave = (data: Omit<IPost, "id" | "date"> & { id?: string }) => {
    savePost({
      ...data,
      title_pl: data.title_pl || intl.formatMessage({ id: "post.untitled" }),
    });
    setFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) deletePost(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  return {
    editing,
    isFormOpen,
    pendingDeleteId,
    openEditor,
    closeEditor,
    handleSave,
    handleDelete,
    confirmDelete,
    cancelDelete,
  };
};
