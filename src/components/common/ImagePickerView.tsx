import { useRef } from 'react'
import type { ChangeEvent } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'
import { ImageIcon } from 'lucide-react'
import { ModalHeader } from '../modals/ModalHeader'
import { ModalShell } from '../modals/ModalShell'
import { ConfirmDialog } from '../modals/ConfirmDialog'
import { ImagePickerThumbnail } from './ImagePickerThumbnail'

interface IImagePickerViewProps {
  value: string
  images: string[]
  isOpen: boolean
  isUploading: boolean
  uploadError: boolean
  deleteError: boolean
  pendingDeleteUrl: string | null
  onOpen: () => void
  onClose: () => void
  onSelect: (url: string) => void
  onRequestDelete: (url: string) => void
  onCancelDelete: () => void
  onConfirmDelete: () => void
  onUploadFile: (file: File) => void
  variant?: 'thumbnail' | 'banner'
}

export const ImagePickerView = ({
  value,
  images,
  isOpen,
  isUploading,
  uploadError,
  deleteError,
  pendingDeleteUrl,
  onOpen,
  onClose,
  onSelect,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  onUploadFile,
  variant = 'thumbnail',
}: IImagePickerViewProps) => {
  const intl = useIntl()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    onUploadFile(file)
  }

  const isBanner = variant === 'banner'
  const previewSizeClasses = isBanner
    ? 'w-full h-40 sm:h-56 rounded-xl'
    : 'w-20 h-14 rounded'

  return (
    <div>
      <button
        type="button"
        onClick={onOpen}
        aria-label={intl.formatMessage({ id: 'imagePicker.chooseFromGallery' })}
        className={`${previewSizeClasses} block cursor-pointer overflow-hidden hover:opacity-80 transition-opacity`}
      >
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover bg-black/20" />
        ) : (
          <div className="w-full h-full bg-black/20 border border-dashed border-white/20 flex items-center justify-center">
            <ImageIcon size={isBanner ? 28 : 18} className="text-gray-500" />
          </div>
        )}
      </button>

      <AnimatePresence>
      {isOpen && (
        <ModalShell key="image-picker" maxWidth="2xl" className="z-10">
          <ModalHeader
            title={intl.formatMessage({ id: 'imagePicker.modalTitle' })}
            onClose={onClose}
          />

          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
            {images.map((url) => (
              <ImagePickerThumbnail
                key={url}
                url={url}
                isSelected={url === value}
                deleteLabel={intl.formatMessage({ id: 'common.delete' })}
                onSelect={() => onSelect(url)}
                onRequestDelete={() => onRequestDelete(url)}
              />
            ))}
          </div>

          <div className="mt-4 flex justify-between items-start gap-4">
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 bg-black/20 rounded disabled:opacity-50"
              >
                {isUploading
                  ? intl.formatMessage({ id: 'imagePicker.uploading' })
                  : intl.formatMessage({ id: 'imagePicker.uploadNew' })}
              </button>
              <p className="mt-2 text-xs text-gray-400 max-w-xs">
                {intl.formatMessage({ id: 'imagePicker.helperText' })}
              </p>
              {uploadError && (
                <p className="mt-2 text-xs text-red-400 max-w-xs">
                  {intl.formatMessage({ id: 'imagePicker.uploadError' })}
                </p>
              )}
            </div>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-neon text-black rounded">
              {intl.formatMessage({ id: 'common.close' })}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileSelected}
            className="hidden"
          />
        </ModalShell>
      )}

      {pendingDeleteUrl && (
        <ConfirmDialog
          key="confirm-delete-image"
          title={intl.formatMessage({ id: 'common.delete' })}
          message={intl.formatMessage({ id: 'confirm.deleteImage' })}
          confirmLabel={intl.formatMessage({ id: 'common.delete' })}
          cancelLabel={intl.formatMessage({ id: 'common.cancel' })}
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )}
      </AnimatePresence>

      {deleteError && (
        <p className="mt-2 text-xs text-red-400">
          {intl.formatMessage({ id: 'imagePicker.deleteError' })}
        </p>
      )}
    </div>
  )
}
