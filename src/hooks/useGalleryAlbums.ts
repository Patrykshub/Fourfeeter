import { useIntl } from "react-intl";
import type { IGalleryAlbum } from "../types";
import { app } from "../model/Application";
import { useCachedResource } from "./useCachedResource";

export const useGalleryAlbums = () => {
  const intl = useIntl();
  const [albums, writeAlbums] = useCachedResource<IGalleryAlbum[]>("gallery-albums", () =>
    app().galleryAlbums.fetchAlbums(),
  );

  const saveAlbum = async (data: Omit<IGalleryAlbum, "id"> & { id?: string }) => {
    if (data.id) {
      const { id, ...rest } = data;
      const updated = await app().galleryAlbums.updateAlbum(id, rest);
      if (updated) {
        writeAlbums((prev) =>
          (prev ?? []).map((album) => (album.id === id ? updated : album)),
        );
      } else {
        alert(intl.formatMessage({ id: "error.saveAlbum" }));
      }
      return;
    }

    const inserted = await app().galleryAlbums.insertAlbum(data);
    if (inserted) {
      writeAlbums((prev) => [...(prev ?? []), inserted]);
    } else {
      alert(intl.formatMessage({ id: "error.saveAlbum" }));
    }
  };

  const deleteAlbum = async (id: string): Promise<boolean> => {
    const success = await app().galleryAlbums.deleteAlbum(id);
    if (success) {
      writeAlbums((prev) => (prev ?? []).filter((album) => album.id !== id));
    } else {
      alert(intl.formatMessage({ id: "error.deleteAlbum" }));
    }
    return success;
  };

  return { albums: albums ?? [], saveAlbum, deleteAlbum };
};
