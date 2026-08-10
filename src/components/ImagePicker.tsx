import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useIntl } from 'react-intl'
import { Trash2 } from 'lucide-react'
import { useMediaLibrary } from '../hooks/useMediaLibrary'
import { ModalHeader } from './ModalHeader'
import { ConfirmDialog } from './ConfirmDialog'

interface IImagePickerProps {
  value: string
  onChange: (url: string) => void
}

const ImagePicker = ({ value, onChange }: IImagePickerProps) => {
  const intl = useIntl()
  const { images, uploadImage, deleteImage } = useMediaLibrary()
  const [isOpen, setOpen] = useState(false)
  const [isUploading, setUploading] = useState(false)
  const [pendingDeleteUrl, setPendingDeleteUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const select = (url: string) => {
    onChange(url)
    setOpen(false)
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploading(true)
    const url = await uploadImage(file)
    setUploading(false)

    if (url) {
      select(url)
    } else {
      alert(intl.formatMessage({ id: 'imagePicker.uploadError' }))
    }
  }

  const confirmDeleteImage = async () => {
    if (!pendingDeleteUrl) return
    const deletedUrl = pendingDeleteUrl
    const success = await deleteImage(deletedUrl)
    setPendingDeleteUrl(null)
    if (!success) {
      alert(intl.formatMessage({ id: 'imagePicker.deleteError' }))
      return
    }
    if (deletedUrl === value) {
      onChange('')
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-10">
          <div className="bg-[#061018] max-w-2xl w-full rounded-lg p-6">
            <ModalHeader
              title={intl.formatMessage({ id: 'imagePicker.modalTitle' })}
              onClose={() => setOpen(false)}
            />

            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
              {images.map((url) => (
                <div key={url} className="relative">
                  <button
                    type="button"
                    onClick={() => select(url)}
                    className={`w-full rounded overflow-hidden border-2 ${
                      url === value ? 'border-neon' : 'border-transparent'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-20 object-cover" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPendingDeleteUrl(url)
                    }}
                    aria-label={intl.formatMessage({ id: 'common.delete' })}
                    className="absolute top-1 right-1 p-1 rounded bg-black/70"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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
              onChange={handleUpload}
              className="hidden"
            />
          </div>
        </div>
      )}

      {pendingDeleteUrl && (
        <ConfirmDialog
          title={intl.formatMessage({ id: 'common.delete' })}
          message={intl.formatMessage({ id: 'confirm.deleteImage' })}
          confirmLabel={intl.formatMessage({ id: 'common.delete' })}
          cancelLabel={intl.formatMessage({ id: 'common.cancel' })}
          onConfirm={confirmDeleteImage}
          onCancel={() => setPendingDeleteUrl(null)}
        />
      )}
    </div>
  )
}

export { ImagePicker }
