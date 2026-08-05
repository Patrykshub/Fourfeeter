import { useEffect, useState } from "react";
import type { IInfoEntry } from "../types";
import { supabase } from "../lib/supabaseClient";

const useInfoEntries = () => {
  const [entries, setEntries] = useState<IInfoEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("info_entries")
      .select("*")
      .then(({ data, error }) => {
        if (!cancelled && !error && data) setEntries(data as IInfoEntry[]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const saveEntry = async (data: Omit<IInfoEntry, "id"> & { id?: string }) => {
    if (data.id) {
      const { id, ...rest } = data;
      const { data: updated, error } = await supabase
        .from("info_entries")
        .update(rest)
        .eq("id", id)
        .select()
        .single();
      if (!error && updated) {
        setEntries((prev) =>
          prev.map((entry) => (entry.id === id ? (updated as IInfoEntry) : entry)),
        );
      }
      return;
    }

    const { data: inserted, error } = await supabase
      .from("info_entries")
      .insert(data)
      .select()
      .single();
    if (!error && inserted) {
      setEntries((prev) => [...prev, inserted as IInfoEntry]);
    }
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from("info_entries").delete().eq("id", id);
    if (!error) {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  return { entries, saveEntry, deleteEntry };
};

export { useInfoEntries };
