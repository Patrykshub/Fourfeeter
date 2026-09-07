import { useIntl } from "react-intl";
import type { IGalleryPhoto } from "../types";
import { app } from "../model/Application";
import { useCachedResource } from "./useCachedResource";
import { compressImage } from "../lib/compressImage";

export const useGalleryPhotos = () => {
  const intl = useIntl();
  const [photos, writePhotos] = useCachedResource<IGalleryPhoto[]>("gallery-photos", () =>
    app().galleryPhotos.fetchPhotos(),
  );

  const photosByAlbum = (photos ?? []).reduce<Record<string, IGalleryPhoto[]>>((acc, photo) => {
    (acc[photo.album_id] ??= []).push(photo);
    return acc;
  }, {});

  const uploadPhoto = async (albumId: string, file: File): Promise<boolean> => {
    const compressedFile = await compressImage(file);
    const url = await app().mediaLibrary.uploadImage(compressedFile);
    if (!url) {
      alert(intl.formatMessage({ id: "error.uploadPhoto" }));
      return false;
    }

    const inserted = await app().galleryPhotos.insertPhoto({ album_id: albumId, image: url });
    if (!inserted) {
      alert(intl.formatMessage({ id: "error.uploadPhoto" }));
      return false;
    }

    writePhotos((prev) => [...(prev ?? []), inserted]);
    return true;
  };

  const deletePhoto = async (id: string): Promise<boolean> => {
    const success = await app().galleryPhotos.deletePhoto(id);
    if (success) {
      writePhotos((prev) => (prev ?? []).filter((photo) => photo.id !== id));
    } else {
      alert(intl.formatMessage({ id: "error.deletePhoto" }));
    }
    return success;
  };

  const removePhotosForAlbum = (albumId: string) => {
    writePhotos((prev) => (prev ?? []).filter((photo) => photo.album_id !== albumId));
  };

  return { photosByAlbum, uploadPhoto, deletePhoto, removePhotosForAlbum };
};
