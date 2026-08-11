import { useIntl } from 'react-intl'
import type { IPost } from '../../types'
import { useDraftState } from '../../hooks/useDraftState'
import { ImagePicker } from '../common/ImagePicker'
import { ModalHeader } from './ModalHeader'
import { ModalShell } from './ModalShell'
import { SaveCancelButtons } from '../common/SaveCancelButtons'

interface IEditorModalProps {
  post: IPost | null
  onClose: () => void
  onSave: (data: Omit<IPost, 'id' | 'date'> & { id?: string }) => void
}

interface IPostDraft {
  title: string
  content: string
  image: string
}

const EditorModal = ({ post, onClose, onSave }: IEditorModalProps) => {
  const intl = useIntl()
  const draftKey = post ? `post_draft_v1_${post.id}` : 'post_draft_v1'
  const [draft, setDraft, clearDraft] = useDraftState<IPostDraft>(draftKey, {
    title: post?.title ?? '',
    content: post?.content ?? '',
    image: post?.image ?? 'https://picsum.photos/seed/new-post/600/400',
  })
  const { title, content, image } = draft
  const setTitle = (nextTitle: string) => setDraft((prev) => ({ ...prev, title: nextTitle }))
  const setContent = (nextContent: string) => setDraft((prev) => ({ ...prev, content: nextContent }))
  const setImage = (nextImage: string) => setDraft((prev) => ({ ...prev, image: nextImage }))

  return (
    <ModalShell maxWidth="2xl">
      <ModalHeader
        title={intl.formatMessage({ id: post ? 'post.editTitle' : 'post.addTitle' })}
        onClose={onClose}
      />

      <div className="mt-4 space-y-3">
        <label className="block text-sm">{intl.formatMessage({ id: 'post.titleLabel' })}</label>
        <input className="w-full p-3 rounded bg-black/20" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label className="block text-sm">{intl.formatMessage({ id: 'post.contentLabel' })}</label>
        <textarea className="w-full p-3 rounded bg-black/20 h-36" value={content} onChange={(e) => setContent(e.target.value)} />

        <label className="block text-sm">{intl.formatMessage({ id: 'post.imageLabel' })}</label>
        <ImagePicker value={image} onChange={setImage} />

        <SaveCancelButtons
          onCancel={onClose}
          onSave={() => {
            clearDraft()
            onSave({
              id: post?.id,
              title: title || intl.formatMessage({ id: 'post.untitled' }),
              content,
              image,
            })
          }}
        />
      </div>
    </ModalShell>
  )
}

export { EditorModal }
