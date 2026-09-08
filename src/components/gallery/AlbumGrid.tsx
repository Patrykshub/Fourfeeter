import type { IGalleryAlbum, IGalleryPhoto } from "../../types";
import { AlbumCard } from "./AlbumCard";
import { AddAlbumCard } from "./AddAlbumCard";

interface IAlbumGridProps {
  albums: IGalleryAlbum[];
  photosByAlbum: Record<string, IGalleryPhoto[]>;
  isAdmin: boolean;
  onOpenAlbum: (id: string) => void;
  onEditAlbum: (album: IGalleryAlbum) => void;
  onDeleteAlbum: (id: string) => void;
  onAddAlbum: () => void;
}

export const AlbumGrid = ({
  albums,
  photosByAlbum,
  isAdmin,
  onOpenAlbum,
  onEditAlbum,
  onDeleteAlbum,
  onAddAlbum,
}: IAlbumGridProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
    {isAdmin && <AddAlbumCard onClick={onAddAlbum} />}
    {albums.map((album) => {
      const photos = photosByAlbum[album.id] ?? [];
      return (
        <AlbumCard
          key={album.id}
          album={album}
          cover={album.cover_image ?? photos[0]?.image ?? null}
          photoCount={photos.length}
          isAdmin={isAdmin}
          onOpen={() => onOpenAlbum(album.id)}
          onEdit={() => onEditAlbum(album)}
          onDelete={() => onDeleteAlbum(album.id)}
        />
      );
    })}
  </div>
);
