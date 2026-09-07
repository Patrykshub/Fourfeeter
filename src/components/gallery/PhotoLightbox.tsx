import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { useIntl } from "react-intl";
import type { IGalleryPhoto } from "../../types";

interface IPhotoLightboxProps {
  photos: IGalleryPhoto[];
  index: number;
  isAdmin: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onRequestDelete: (id: string) => void;
}

export const PhotoLightbox = ({
  photos,
  index,
  isAdmin,
  onClose,
  onNavigate,
  onRequestDelete,
}: IPhotoLightboxProps) => {
  const intl = useIntl();
  const photo = photos[index];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!photo) return null;

  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-10 flex items-center justify-center p-4"
    >
      <img
        src={photo.image}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain rounded-lg"
      />

      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index - 1);
          }}
          aria-label={intl.formatMessage({ id: "gallery.previousPhoto" })}
          className="fixed left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60"
        >
          <ChevronLeft className="text-neon" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index + 1);
          }}
          aria-label={intl.formatMessage({ id: "gallery.nextPhoto" })}
          className="fixed right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60"
        >
          <ChevronRight className="text-neon" />
        </button>
      )}

      <div className="fixed top-4 right-4 flex gap-2">
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequestDelete(photo.id);
            }}
            aria-label={intl.formatMessage({ id: "common.delete" })}
            className="p-3 rounded-full bg-black/40 hover:bg-black/60"
          >
            <Trash2 className="text-neon" />
          </button>
        )}
        <button
          onClick={onClose}
          aria-label={intl.formatMessage({ id: "common.close" })}
          className="p-3 rounded-full bg-black/40 hover:bg-black/60"
        >
          <X className="text-neon" />
        </button>
      </div>
    </div>
  );
};
