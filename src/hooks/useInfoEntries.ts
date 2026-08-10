import { useIntl } from "react-intl";
import type { IInfoEntry } from "../types";
import { supabase } from "../lib/supabaseClient";
import { useCachedResource } from "./useCachedResource";

const useInfoEntries = () => {
  const intl = useIntl();
  const [entries, writeEntries] = useCachedResource<IInfoEntry[]>("info-entries", async () => {
    const { data, error } = await supabase.from("info_entries").select("*");
    if (error || !data) return undefined;
    return data as IInfoEntry[];
  });

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
        writeEntries((prev) =>
          (prev ?? []).map((entry) => (entry.id === id ? (updated as IInfoEntry) : entry)),
        );
      } else {
        alert(intl.formatMessage({ id: "error.saveInfoEntry" }));
      }
      return;
    }

    const { data: inserted, error } = await supabase
      .from("info_entries")
      .insert(data)
      .select()
      .single();
    if (!error && inserted) {
      writeEntries((prev) => [...(prev ?? []), inserted as IInfoEntry]);
    } else {
      alert(intl.formatMessage({ id: "error.saveInfoEntry" }));
    }
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from("info_entries").delete().eq("id", id);
    if (!error) {
      writeEntries((prev) => (prev ?? []).filter((entry) => entry.id !== id));
    } else {
      alert(intl.formatMessage({ id: "error.deleteInfoEntry" }));
    }
  };

  return { entries: entries ?? [], saveEntry, deleteEntry };
};

export { useInfoEntries };
