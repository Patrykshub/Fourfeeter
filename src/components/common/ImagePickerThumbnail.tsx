import type { FC } from 'react'
import { Trash2 } from 'lucide-react'

interface IImagePickerThumbnailProps {
  url: string
  isSelected: boolean
  deleteLabel: string
  onSelect: () => void
  onRequestDelete: () => void
}

export const ImagePickerThumbnail: FC<IImagePickerThumbnailProps> = ({
  url,
  isSelected,
  deleteLabel,
  onSelect,
  onRequestDelete,
}) => (
  <div className="relative">
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded overflow-hidden border-2 ${
        isSelected ? 'border-neon' : 'border-transparent'
      }`}
    >
      <img src={url} alt="" loading="lazy" decoding="async" className="w-full h-20 object-cover" />
    </button>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onRequestDelete()
      }}
      aria-label={deleteLabel}
      className="absolute top-1 right-1 p-1 rounded bg-black/70"
    >
      <Trash2 size={14} />
    </button>
  </div>
)
