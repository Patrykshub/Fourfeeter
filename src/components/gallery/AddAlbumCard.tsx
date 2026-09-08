import { useIntl } from "react-intl";
import { Plus } from "lucide-react";

interface IAddAlbumCardProps {
  onClick: () => void;
}

export const AddAlbumCard = ({ onClick }: IAddAlbumCardProps) => {
  const intl = useIntl();

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full aspect-square rounded-lg border border-dashed border-white/20 bg-black/20 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-neon hover:border-neon/50 transition-colors"
    >
      <Plus size={28} />
      <span className="text-sm font-medium">
        {intl.formatMessage({ id: "gallery.addAlbum" })}
      </span>
    </button>
  );
};
