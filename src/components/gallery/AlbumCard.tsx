import { useIntl } from "react-intl";
import { ImageOff } from "lucide-react";
import type { IGalleryAlbum } from "../../types";
import { AdminActions } from "../common/AdminActions";

interface IAlbumCardProps {
  album: IGalleryAlbum;
  cover: string | null;
  photoCount: number;
  isAdmin: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AlbumCard = ({
  album,
  cover,
  photoCount,
  isAdmin,
  onOpen,
  onEdit,
  onDelete,
}: IAlbumCardProps) => {
  const intl = useIntl();

  return (
    <div className="relative group bg-surface p-2 rounded-lg shadow-sm hover:shadow-md">
      <button
        type="button"
        onClick={onOpen}
        className="w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center bg-black/50"
      >
        {cover ? (
          <img
            src={cover}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageOff className="text-gray-500" />
        )}
      </button>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium truncate">{album.name}</p>
          <p className="text-xs text-gray-400">
            {intl.formatMessage(
              { id: "gallery.photoCount" },
              { count: photoCount },
            )}
          </p>
        </div>
        {isAdmin && (
          <AdminActions compact onEdit={onEdit} onDelete={onDelete} />
        )}
      </div>
    </div>
  );
};
