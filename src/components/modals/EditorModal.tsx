import { useState } from 'react'
import { useIntl } from 'react-intl'
import type { IPost } from '../../types'
import { useDraftState } from '../../hooks/useDraftState'
import { useImagePicker } from '../../hooks/useImagePicker'
import { useLocale } from '../../i18n/LocaleContext'
import { LOCALE_SUFFIXES } from '../../i18n/utils'
import type { SupportedLocale } from '../../i18n/utils'
import { ImagePickerView } from '../common/ImagePickerView'
import { LocaleTabs } from '../common/LocaleTabs'
import { ModalHeader } from './ModalHeader'
import { ModalShell } from './ModalShell'
import { SaveCancelButtons } from '../common/SaveCancelButtons'

interface IEditorModalProps {
  post: IPost | null
  onClose: () => void
  onSave: (data: Omit<IPost, 'id' | 'date'> & { id?: string }) => void
}

interface IPostDraft {
  title_pl: string
  title_en: string
  title_de: string
  content_pl: string
  content_en: string
  content_de: string
  image: string
}

export const EditorModal = ({ post, onClose, onSave }: IEditorModalProps) => {
  const intl = useIntl()
  const { locale: currentLocale } = useLocale()
  const [activeTab, setActiveTab] = useState<SupportedLocale>(currentLocale)
  const draftKey = post ? `post_draft_v1_${post.id}` : 'post_draft_v1'
  const [draft, setDraft, clearDraft] = useDraftState<IPostDraft>(draftKey, {
    title_pl: post?.title_pl ?? '',
    title_en: post?.title_en ?? '',
    title_de: post?.title_de ?? '',
    content_pl: post?.content_pl ?? '',
    content_en: post?.content_en ?? '',
    content_de: post?.content_de ?? '',
    image: post?.image ?? 'https://picsum.photos/seed/new-post/600/400',
  })
  const { image } = draft
  const activeSuffix = LOCALE_SUFFIXES[activeTab]
  const titleField = `title_${activeSuffix}` as const
  const contentField = `content_${activeSuffix}` as const
  const title = draft[titleField]
  const content = draft[contentField]
  const setTitle = (nextTitle: string) => setDraft((prev) => ({ ...prev, [titleField]: nextTitle }))
  const setContent = (nextContent: string) => setDraft((prev) => ({ ...prev, [contentField]: nextContent }))
  const setImage = (nextImage: string) => setDraft((prev) => ({ ...prev, image: nextImage }))
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
    <ModalShell maxWidth="2xl">
      <ModalHeader
        title={intl.formatMessage({ id: post ? 'post.editTitle' : 'post.addTitle' })}
        onClose={onClose}
      />

      <div className="mt-4 space-y-3">
        <LocaleTabs activeTab={activeTab} onChange={setActiveTab} />

        <label className="block text-sm">{intl.formatMessage({ id: 'post.titleLabel' })}</label>
        <input className="w-full p-3 rounded bg-black/20" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label className="block text-sm">{intl.formatMessage({ id: 'post.contentLabel' })}</label>
        <textarea className="w-full p-3 rounded bg-black/20 h-36" value={content} onChange={(e) => setContent(e.target.value)} />

        <label className="block text-sm">{intl.formatMessage({ id: 'post.imageLabel' })}</label>
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

        <SaveCancelButtons
          onCancel={onClose}
          onSave={() => {
            clearDraft()
            onSave({
              id: post?.id,
              title_pl: draft.title_pl,
              title_en: draft.title_en,
              title_de: draft.title_de,
              content_pl: draft.content_pl,
              content_en: draft.content_en,
              content_de: draft.content_de,
              image,
            })
          }}
        />
      </div>
    </ModalShell>
  )
}
