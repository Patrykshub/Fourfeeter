import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useIntl } from "react-intl";
import { AnimatePresence } from "motion/react";
import type { IGalleryAlbum, IGalleryPhoto } from "../../types";
import { EmptyState } from "../common/EmptyState";
import { ConfirmDialog } from "../modals/ConfirmDialog";
import { PhotoLightbox } from "./PhotoLightbox";
import { AddPhotoCard } from "./AddPhotoCard";

interface IAlbumDetailViewProps {
  album: IGalleryAlbum;
  photos: IGalleryPhoto[];
  isAdmin: boolean;
  isUploading: boolean;
  onBack: () => void;
  onUploadPhoto: (file: File) => void;
  onDeletePhoto: (id: string) => void;
  onDeleteAlbum: () => void;
}

export const AlbumDetailView = ({
  album,
  photos,
  isAdmin,
  isUploading,
  onBack,
  onUploadPhoto,
  onDeletePhoto,
  onDeleteAlbum,
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
            onClick={onDeleteAlbum}
            aria-label={intl.formatMessage({ id: "common.delete" })}
            className="p-1 rounded bg-black/20 text-red-400"
          >
            <Trash2 size={16} />
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

      {photos.length === 0 && !isAdmin ? (
        <EmptyState
          message={intl.formatMessage({ id: "gallery.albumEmptyState" })}
          isAdmin={false}
          onAdd={() => {}}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
          {isAdmin && (
            <AddPhotoCard
              onClick={() => fileInputRef.current?.click()}
              isUploading={isUploading}
            />
          )}
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
