import { useIntl } from "react-intl";
import type { IInfoEntry } from "../types";
import { app } from "../model/Application";
import { useCachedResource } from "./useCachedResource";

const useInfoEntries = () => {
  const intl = useIntl();
  const [entries, writeEntries] = useCachedResource<IInfoEntry[]>("info-entries", () =>
    app().infoEntries.fetchEntries(),
  );

  const saveEntry = async (data: Omit<IInfoEntry, "id"> & { id?: string }) => {
    if (data.id) {
      const { id, ...rest } = data;
      const updated = await app().infoEntries.updateEntry(id, rest);
      if (updated) {
        writeEntries((prev) =>
          (prev ?? []).map((entry) => (entry.id === id ? updated : entry)),
        );
      } else {
        alert(intl.formatMessage({ id: "error.saveInfoEntry" }));
      }
      return;
    }

    const inserted = await app().infoEntries.insertEntry(data);
    if (inserted) {
      writeEntries((prev) => [...(prev ?? []), inserted]);
    } else {
      alert(intl.formatMessage({ id: "error.saveInfoEntry" }));
    }
  };

  const deleteEntry = async (id: string) => {
    const success = await app().infoEntries.deleteEntry(id);
    if (success) {
      writeEntries((prev) => (prev ?? []).filter((entry) => entry.id !== id));
    } else {
      alert(intl.formatMessage({ id: "error.deleteInfoEntry" }));
    }
  };

  return { entries: entries ?? [], saveEntry, deleteEntry };
};

export { useInfoEntries };
