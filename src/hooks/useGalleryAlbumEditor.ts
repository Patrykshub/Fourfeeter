import { useState } from "react";
import type { IGalleryAlbum } from "../types";

interface IUseGalleryAlbumEditorParams {
  saveAlbum: (data: Omit<IGalleryAlbum, "id"> & { id?: string }) => void;
  deleteAlbum: (id: string) => void;
}

export const useGalleryAlbumEditor = ({ saveAlbum, deleteAlbum }: IUseGalleryAlbumEditorParams) => {
  const [editing, setEditing] = useState<IGalleryAlbum | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const openEditor = (album?: IGalleryAlbum) => {
    setEditing(album ?? null);
    setFormOpen(true);
  };

  const closeEditor = () => {
    setFormOpen(false);
  };

  const handleSave = (data: Omit<IGalleryAlbum, "id"> & { id?: string }) => {
    saveAlbum(data);
    setFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) deleteAlbum(pendingDeleteId);
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
