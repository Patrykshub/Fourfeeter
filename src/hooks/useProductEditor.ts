import { useState } from "react";
import type { IProduct } from "../types";

interface IUseProductEditorParams {
  saveProduct: (data: Omit<IProduct, "id"> & { id?: string }) => void;
  deleteProduct: (id: string) => void;
}

export const useProductEditor = ({ saveProduct, deleteProduct }: IUseProductEditorParams) => {
  const [editing, setEditing] = useState<IProduct | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const openEditor = (product?: IProduct) => {
    setEditing(product ?? null);
    setFormOpen(true);
  };

  const closeEditor = () => {
    setFormOpen(false);
  };

  const handleSave = (data: Omit<IProduct, "id"> & { id?: string }) => {
    saveProduct(data);
    setFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) deleteProduct(pendingDeleteId);
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
