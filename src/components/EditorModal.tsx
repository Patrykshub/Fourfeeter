import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import type { IPost } from '../types'
import { readJSON, removeItem, writeJSON } from '../lib/storage'
import { ImagePicker } from './ImagePicker'
import { ModalHeader } from './ModalHeader'

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
  const [draft] = useState(() => readJSON<IPostDraft | null>(draftKey, null))
  const [title, setTitle] = useState(draft?.title ?? post?.title ?? '')
  const [content, setContent] = useState(draft?.content ?? post?.content ?? '')
  const [image, setImage] = useState(
    draft?.image ?? post?.image ?? 'https://picsum.photos/seed/new-post/600/400',
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      writeJSON(draftKey, { title, content, image })
    }, 400)
    return () => clearTimeout(timeout)
  }, [draftKey, title, content, image])

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#061018] max-w-2xl w-full rounded-lg p-6">
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

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-black/20 rounded">
              {intl.formatMessage({ id: 'common.cancel' })}
            </button>
            <button
              onClick={() => {
                removeItem(draftKey)
                onSave({
                  id: post?.id,
                  title: title || intl.formatMessage({ id: 'post.untitled' }),
                  content,
                  image,
                })
              }}
              className="px-4 py-2 bg-neon text-black rounded"
            >
              {intl.formatMessage({ id: 'common.save' })}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { EditorModal }
