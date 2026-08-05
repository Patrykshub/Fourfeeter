import { useState } from "react";
import type { Post } from "../types";

interface IUsePostEditorParams {
  savePost: (data: Omit<Post, "id" | "date"> & { id?: string }) => void;
  deletePost: (id: string) => void;
}

const usePostEditor = ({ savePost, deletePost }: IUsePostEditorParams) => {
  const [editing, setEditing] = useState<Post | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);

  const openEditor = (post?: Post) => {
    setEditing(post ?? null);
    setFormOpen(true);
  };

  const closeEditor = () => {
    setFormOpen(false);
  };

  const handleSave = (data: Omit<Post, "id" | "date"> & { id?: string }) => {
    savePost(data);
    setFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Usuń ten post?")) return;
    deletePost(id);
  };

  return { editing, isFormOpen, openEditor, closeEditor, handleSave, handleDelete };
};

export { usePostEditor };
