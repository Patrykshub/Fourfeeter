import { useRef } from 'react'
import type { ChangeEvent } from 'react'
import { useIntl } from 'react-intl'
import { useImagePicker } from '../hooks/useImagePicker'
import { ModalHeader } from './ModalHeader'
import { ModalShell } from './ModalShell'
import { ConfirmDialog } from './ConfirmDialog'
import { ImagePickerThumbnail } from './ImagePickerThumbnail'

interface IImagePickerProps {
  value: string
  onChange: (url: string) => void
}

const ImagePicker = ({ value, onChange }: IImagePickerProps) => {
  const intl = useIntl()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    images,
    isOpen,
    setOpen,
    isUploading,
    pendingDeleteUrl,
    setPendingDeleteUrl,
    select,
    handleUpload,
    confirmDeleteImage,
  } = useImagePicker({ value, onChange })

  const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const success = await handleUpload(file)
    if (!success) {
      alert(intl.formatMessage({ id: 'imagePicker.uploadError' }))
    }
  }

  const onConfirmDelete = async () => {
    const success = await confirmDeleteImage()
    if (!success) {
      alert(intl.formatMessage({ id: 'imagePicker.deleteError' }))
    }
  }

  return (
    <div>
      <div className="flex gap-3 items-center">
        <img src={value} alt="" className="w-20 h-14 object-cover rounded bg-black/20" />
        <button type="button" onClick={() => setOpen(true)} className="px-4 py-2 bg-black/20 rounded">
          {intl.formatMessage({ id: 'imagePicker.chooseFromGallery' })}
        </button>
      </div>

      {isOpen && (
        <ModalShell maxWidth="2xl" className="z-10">
          <ModalHeader
            title={intl.formatMessage({ id: 'imagePicker.modalTitle' })}
            onClose={() => setOpen(false)}
          />

          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
            {images.map((url) => (
              <ImagePickerThumbnail
                key={url}
                url={url}
                isSelected={url === value}
                deleteLabel={intl.formatMessage({ id: 'common.delete' })}
                onSelect={() => select(url)}
                onRequestDelete={() => setPendingDeleteUrl(url)}
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
            </div>
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 bg-neon text-black rounded">
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
          title={intl.formatMessage({ id: 'common.delete' })}
          message={intl.formatMessage({ id: 'confirm.deleteImage' })}
          confirmLabel={intl.formatMessage({ id: 'common.delete' })}
          cancelLabel={intl.formatMessage({ id: 'common.cancel' })}
          onConfirm={onConfirmDelete}
          onCancel={() => setPendingDeleteUrl(null)}
        />
      )}
    </div>
  )
}

export { ImagePicker }
