import { useState } from "react";
import { useIntl } from "react-intl";
import { AnimatePresence } from "motion/react";
import { useGalleryAlbums } from "../../hooks/useGalleryAlbums";
import { useGalleryPhotos } from "../../hooks/useGalleryPhotos";
import { useGalleryAlbumEditor } from "../../hooks/useGalleryAlbumEditor";
import { usePageBanner } from "../../hooks/usePageBanner";
import { useAppContext } from "../../router/AppContext";
import { GalleryView } from "../../components/gallery/GalleryView";
import { AlbumFormModal } from "../../components/gallery/AlbumFormModal";
import { ConfirmDialog } from "../../components/modals/ConfirmDialog";

export const GalleryPage = () => {
  const intl = useIntl();
  const { isAdmin } = useAppContext();
  const { albums, saveAlbum, deleteAlbum } = useGalleryAlbums();
  const { photosByAlbum, uploadPhoto, deletePhoto, removePhotosForAlbum } = useGalleryPhotos();
  const [isUploading, setUploading] = useState(false);

  const {
    editing,
    isFormOpen,
    pendingDeleteId,
    openEditor,
    closeEditor,
    handleSave,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useGalleryAlbumEditor({
    saveAlbum,
    deleteAlbum: async (id) => {
      const success = await deleteAlbum(id);
      if (success) removePhotosForAlbum(id);
    },
  });

  const { banner, setBanner, description, descriptions, setDescriptions } =
    usePageBanner("gallery");

  const handleUploadPhoto = async (albumId: string, file: File) => {
    setUploading(true);
    await uploadPhoto(albumId, file);
    setUploading(false);
  };

  return (
    <>
      <GalleryView
        albums={albums}
        photosByAlbum={photosByAlbum}
        isAdmin={isAdmin}
        isUploading={isUploading}
        onAddAlbum={() => openEditor()}
        onEditAlbum={openEditor}
        onDeleteAlbum={handleDelete}
        onUploadPhoto={handleUploadPhoto}
        onDeletePhoto={deletePhoto}
        banner={banner}
        onChangeBanner={setBanner}
        description={description}
        descriptions={descriptions}
        onChangeDescriptions={setDescriptions}
      />

      <AnimatePresence>
        {isFormOpen && (
          <AlbumFormModal key="album-form" album={editing} onClose={closeEditor} onSave={handleSave} />
        )}

        {pendingDeleteId && (
          <ConfirmDialog
            key="confirm-delete"
            title={intl.formatMessage({ id: "common.delete" })}
            message={intl.formatMessage({ id: "confirm.deleteAlbum" })}
            confirmLabel={intl.formatMessage({ id: "common.delete" })}
            cancelLabel={intl.formatMessage({ id: "common.cancel" })}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
};
