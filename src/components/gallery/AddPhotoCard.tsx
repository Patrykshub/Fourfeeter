import { useIntl } from "react-intl";
import { Plus } from "lucide-react";

interface IAddPhotoCardProps {
  onClick: () => void;
  isUploading: boolean;
}

export const AddPhotoCard = ({ onClick, isUploading }: IAddPhotoCardProps) => {
  const intl = useIntl();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isUploading}
      className="aspect-square rounded-lg border border-dashed border-white/20 bg-black/20 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-neon hover:border-neon/50 transition-colors disabled:opacity-50"
    >
      <Plus size={28} />
      <span className="text-sm font-medium">
        {isUploading
          ? intl.formatMessage({ id: "imagePicker.uploading" })
          : intl.formatMessage({ id: "gallery.addPhoto" })}
      </span>
    </button>
  );
};
