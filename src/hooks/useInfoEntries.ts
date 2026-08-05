import { useEffect, useState } from "react";
import type { IInfoEntry } from "../types";
import { readJSON, writeJSON } from "../lib/storage";

const STORAGE_KEY = "info_entries_v1";

const useInfoEntries = () => {
  const [entries, setEntries] = useState<IInfoEntry[]>(() => {
    const stored = readJSON<IInfoEntry[]>(STORAGE_KEY, []);
    return Array.isArray(stored) ? stored : [];
  });

  useEffect(() => {
    writeJSON(STORAGE_KEY, entries);
  }, [entries]);

  const saveEntry = (data: Omit<IInfoEntry, "id"> & { id?: string }) => {
    if (data.id) {
      const { id } = data;
      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, ...data, id } : entry)),
      );
    } else {
      const newEntry: IInfoEntry = { id: crypto.randomUUID(), ...data };
      setEntries((prev) => [...prev, newEntry]);
    }
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return { entries, saveEntry, deleteEntry };
};

export { useInfoEntries };
