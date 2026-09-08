import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useIntl } from "react-intl";
import { AnimatePresence } from "motion/react";
import type { IGalleryAlbum, IGalleryPhoto } from "../../types";
import { EmptyState } from "../common/EmptyState";
import { ConfirmDialog } from "../modals/ConfirmDialog";
import { PhotoLightbox } from "./PhotoLightbox";

interface IAlbumDetailViewProps {
  album: IGalleryAlbum;
  photos: IGalleryPhoto[];
  isAdmin: boolean;
  isUploading: boolean;
  onBack: () => void;
  onUploadPhoto: (file: File) => void;
  onDeletePhoto: (id: string) => void;
}

export const AlbumDetailView = ({
  album,
  photos,
  isAdmin,
  isUploading,
  onBack,
  onUploadPhoto,
  onDeletePhoto,
}: IAlbumDetailViewProps) => {
  const intl = useIntl();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [pendingDeletePhotoId, setPendingDeletePhotoId] = useState<string | null>(null);

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    onUploadPhoto(file);
  };

  return (
    <div className="py-8">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-300 hover:text-white">
          <ArrowLeft size={18} />
          {intl.formatMessage({ id: "gallery.backToAlbums" })}
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 text-neon disabled:opacity-50"
          >
            {isUploading
              ? intl.formatMessage({ id: "imagePicker.uploading" })
              : intl.formatMessage({ id: "common.addNew" })}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelected}
          className="hidden"
        />
      </div>

      <h2 className="text-2xl font-semibold mt-4">{album.name}</h2>

      {photos.length === 0 ? (
        <EmptyState
          message={intl.formatMessage({ id: "gallery.albumEmptyState" })}
          isAdmin={isAdmin}
          onAdd={() => fileInputRef.current?.click()}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="aspect-square rounded-lg overflow-hidden bg-black/20"
            >
              <img
                src={photo.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxIndex !== null && (
          <PhotoLightbox
            key="photo-lightbox"
            photos={photos}
            index={lightboxIndex}
            isAdmin={isAdmin}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
            onRequestDelete={setPendingDeletePhotoId}
          />
        )}

        {pendingDeletePhotoId && (
          <ConfirmDialog
            key="confirm-delete-photo"
            title={intl.formatMessage({ id: "common.delete" })}
            message={intl.formatMessage({ id: "confirm.deletePhoto" })}
            confirmLabel={intl.formatMessage({ id: "common.delete" })}
            cancelLabel={intl.formatMessage({ id: "common.cancel" })}
            onConfirm={() => {
              onDeletePhoto(pendingDeletePhotoId);
              setPendingDeletePhotoId(null);
              setLightboxIndex(null);
            }}
            onCancel={() => setPendingDeletePhotoId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
