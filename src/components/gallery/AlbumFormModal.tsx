import { useState } from 'react'
import { useIntl } from 'react-intl'
import type { IGalleryAlbum } from '../../types'
import { useImagePicker } from '../../hooks/useImagePicker'
import { ModalHeader } from '../modals/ModalHeader'
import { ModalShell } from '../modals/ModalShell'
import { ImagePickerView } from '../common/ImagePickerView'

interface IAlbumFormModalProps {
  album: IGalleryAlbum | null
  onClose: () => void
  onSave: (data: Omit<IGalleryAlbum, 'id'> & { id?: string }) => void
}

export const AlbumFormModal = ({ album, onClose, onSave }: IAlbumFormModalProps) => {
  const intl = useIntl()
  const [name, setName] = useState(album?.name ?? '')
  const [coverImage, setCoverImage] = useState(album?.cover_image ?? '')
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
  } = useImagePicker({ value: coverImage, onChange: setCoverImage })

  return (
    <ModalShell maxWidth="sm">
      <ModalHeader
        title={intl.formatMessage({ id: album ? 'gallery.editAlbumTitle' : 'gallery.addAlbumTitle' })}
        onClose={onClose}
      />

      <div className="mt-4 space-y-3">
        <label className="block text-sm">{intl.formatMessage({ id: 'gallery.albumNameLabel' })}</label>
        <input
          className="w-full p-3 rounded bg-black/20"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block text-sm">{intl.formatMessage({ id: 'gallery.coverImageLabel' })}</label>
        <ImagePickerView
          value={coverImage}
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
                id: album?.id,
                name: name || intl.formatMessage({ id: 'gallery.unnamed' }),
                cover_image: coverImage || null,
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
