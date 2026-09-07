import { useState } from "react";
import { useIntl } from "react-intl";
import type { IGalleryAlbum, IGalleryPhoto } from "../../types";
import type { IPageBannerDescriptions } from "../../model/services/PageBannerService";
import { PageSection } from "../common/PageSection";
import { AlbumGrid } from "./AlbumGrid";
import { AlbumDetailView } from "./AlbumDetailView";

interface IGalleryViewProps {
  albums: IGalleryAlbum[];
  photosByAlbum: Record<string, IGalleryPhoto[]>;
  isAdmin: boolean;
  isUploading: boolean;
  onAddAlbum: () => void;
  onEditAlbum: (album: IGalleryAlbum) => void;
  onDeleteAlbum: (id: string) => void;
  onUploadPhoto: (albumId: string, file: File) => void;
  onDeletePhoto: (id: string) => void;
  banner: string | null;
  onChangeBanner: (url: string) => void;
  description: string | null;
  descriptions: IPageBannerDescriptions;
  onChangeDescriptions: (next: IPageBannerDescriptions) => void;
}

export const GalleryView = ({
  albums,
  photosByAlbum,
  isAdmin,
  isUploading,
  onAddAlbum,
  onEditAlbum,
  onDeleteAlbum,
  onUploadPhoto,
  onDeletePhoto,
  banner,
  onChangeBanner,
  description,
  descriptions,
  onChangeDescriptions,
}: IGalleryViewProps) => {
  const intl = useIntl();
  const [openAlbumId, setOpenAlbumId] = useState<string | null>(null);
  const openAlbum = albums.find((album) => album.id === openAlbumId) ?? null;

  return (
    <PageSection
      banner={banner}
      onChangeBanner={onChangeBanner}
      pageDescription={{
        pageKey: "gallery",
        description,
        descriptions,
        onChangeDescriptions,
      }}
      isEmpty={albums.length === 0}
      emptyMessage={intl.formatMessage({ id: "gallery.emptyState" })}
      isAdmin={isAdmin}
      onAdd={onAddAlbum}
    >
      {openAlbum ? (
        <AlbumDetailView
          album={openAlbum}
          photos={photosByAlbum[openAlbum.id] ?? []}
          isAdmin={isAdmin}
          isUploading={isUploading}
          onBack={() => setOpenAlbumId(null)}
          onUploadPhoto={(file) => onUploadPhoto(openAlbum.id, file)}
          onDeletePhoto={onDeletePhoto}
        />
      ) : (
        <AlbumGrid
          albums={albums}
          photosByAlbum={photosByAlbum}
          isAdmin={isAdmin}
          onOpenAlbum={setOpenAlbumId}
          onEditAlbum={onEditAlbum}
          onDeleteAlbum={onDeleteAlbum}
        />
      )}
    </PageSection>
  );
};
