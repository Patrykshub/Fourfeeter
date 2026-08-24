import type { ReactNode } from "react";
import { useIntl } from "react-intl";
import { useImagePicker } from "../../hooks/useImagePicker";
import { ImagePickerView } from "./ImagePickerView";

interface IPageBannerProps {
  image: string | null;
  isAdmin: boolean;
  onChangeImage: (url: string) => void;
  children: ReactNode;
}

export const PageBanner = ({
  image,
  isAdmin,
  onChangeImage,
  children,
}: IPageBannerProps) => {
  const intl = useIntl();
  const {
    images,
    isOpen: isImagePickerOpen,
    setOpen: setImagePickerOpen,
    isUploading,
    uploadError,
    deleteError,
    pendingDeleteUrl,
    setPendingDeleteUrl,
    select: selectImage,
    handleUpload,
    confirmDeleteImage,
  } = useImagePicker({ value: image ?? "", onChange: onChangeImage, enabled: isAdmin });

  const adminControls = isAdmin && (
    <div className="pt-2 border-t border-white/10">
      <span className="block text-xs text-gray-300 mb-1">
        {intl.formatMessage({ id: "pageBanner.sectionBackground" })}
      </span>
      <ImagePickerView
        value={image ?? ""}
        images={images}
        isOpen={isImagePickerOpen}
        isUploading={isUploading}
        uploadError={uploadError}
        deleteError={deleteError}
        pendingDeleteUrl={pendingDeleteUrl}
        onOpen={() => setImagePickerOpen(true)}
        onClose={() => setImagePickerOpen(false)}
        onSelect={selectImage}
        onRequestDelete={setPendingDeleteUrl}
        onCancelDelete={() => setPendingDeleteUrl(null)}
        onConfirmDelete={confirmDeleteImage}
        onUploadFile={handleUpload}
      />
    </div>
  );

  if (!image) {
    return (
      <div className="mb-8 space-y-3">
        {children}
        {adminControls}
      </div>
    );
  }

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-cover bg-center mb-8 flex flex-col justify-end min-h-[160px] sm:min-h-[220px]"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />

      <div className="relative p-4 sm:p-6 space-y-3 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
        {children}
        {adminControls}
      </div>
    </div>
  );
};
