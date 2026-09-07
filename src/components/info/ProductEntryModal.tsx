import { useState } from 'react'
import { useIntl } from 'react-intl'
import type { IProduct } from '../../types'
import { useImagePicker } from '../../hooks/useImagePicker'
import { ModalHeader } from '../modals/ModalHeader'
import { ModalShell } from '../modals/ModalShell'
import { ImagePickerView } from '../common/ImagePickerView'

interface IProductEntryModalProps {
  product: IProduct | null
  onClose: () => void
  onSave: (data: Omit<IProduct, 'id'> & { id?: string }) => void
}

export const ProductEntryModal = ({ product, onClose, onSave }: IProductEntryModalProps) => {
  const intl = useIntl()
  const [label, setLabel] = useState(product?.label ?? '')
  const [value, setValue] = useState(product?.value ?? '')
  const [image, setImage] = useState(product?.image ?? '')
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
  } = useImagePicker({ value: image, onChange: setImage })

  return (
    <ModalShell maxWidth="sm">
      <ModalHeader
        title={intl.formatMessage({ id: product ? 'products.editTitle' : 'products.addTitle' })}
        onClose={onClose}
      />

      <div className="mt-4 space-y-3">
        <label className="block text-sm">{intl.formatMessage({ id: 'products.labelField' })}</label>
        <input
          className="w-full p-3 rounded bg-black/20"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <label className="block text-sm">{intl.formatMessage({ id: 'products.valueField' })}</label>
        <input
          className="w-full p-3 rounded bg-black/20"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <label className="block text-sm">{intl.formatMessage({ id: 'products.imageLabel' })}</label>
        <ImagePickerView
          value={image}
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

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-black/20 rounded">
            {intl.formatMessage({ id: 'common.cancel' })}
          </button>
          <button
            onClick={() =>
              onSave({
                id: product?.id,
                label: label || intl.formatMessage({ id: 'products.unnamed' }),
                value,
                image: image || null,
              })
            }
            className="px-4 py-2 bg-neon text-black rounded"
          >
            {intl.formatMessage({ id: 'common.save' })}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
