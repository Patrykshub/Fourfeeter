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
        variant="banner"
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

  return (
    <div className="mb-8 space-y-3">
      {image && (
        <div
          role={isAdmin ? "button" : undefined}
          tabIndex={isAdmin ? 0 : undefined}
          onClick={isAdmin ? () => setImagePickerOpen(true) : undefined}
          onKeyDown={
            isAdmin
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setImagePickerOpen(true);
                  }
                }
              : undefined
          }
          className={`rounded-xl overflow-hidden bg-cover bg-center min-h-[160px] sm:min-h-[220px] ${
            isAdmin ? "cursor-pointer" : ""
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      )}

      {adminControls}
      {children}
    </div>
  );
};
