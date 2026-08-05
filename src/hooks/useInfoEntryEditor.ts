import { useState } from "react";
import { useIntl } from "react-intl";
import type { IInfoEntry } from "../types";

interface IUseInfoEntryEditorParams {
  saveEntry: (data: Omit<IInfoEntry, "id"> & { id?: string }) => void;
  deleteEntry: (id: string) => void;
}

const useInfoEntryEditor = ({ saveEntry, deleteEntry }: IUseInfoEntryEditorParams) => {
  const intl = useIntl();
  const [editing, setEditing] = useState<IInfoEntry | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);

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
    if (!confirm(intl.formatMessage({ id: "confirm.deleteInfoEntry" }))) return;
    deleteEntry(id);
  };

  return { editing, isFormOpen, openEditor, closeEditor, handleSave, handleDelete };
};

export { useInfoEntryEditor };
