import { useState } from "react";
import type { IInfoEntry } from "../types";

interface IUseInfoEntryEditorParams {
  saveEntry: (data: Omit<IInfoEntry, "id"> & { id?: string }) => void;
  deleteEntry: (id: string) => void;
}

const useInfoEntryEditor = ({ saveEntry, deleteEntry }: IUseInfoEntryEditorParams) => {
  const [editing, setEditing] = useState<IInfoEntry | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const openEditor = (entry?: IInfoEntry) => {
    setEditing(entry ?? null);
    setFormOpen(true);
  };

  const closeEditor = () => {
    setFormOpen(false);
  };

  const handleSave = (data: Omit<IInfoEntry, "id"> & { id?: string }) => {
    saveEntry(data);
    setFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) deleteEntry(pendingDeleteId);
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

export { useInfoEntryEditor };
