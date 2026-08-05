import { useState } from 'react'
import { useIntl } from 'react-intl'
import type { IPost } from '../types'
import { ImagePicker } from './ImagePicker'
import { ModalHeader } from './ModalHeader'

interface IEditorModalProps {
  post: IPost | null
  onClose: () => void
  onSave: (data: Omit<IPost, 'id' | 'date'> & { id?: string }) => void
}

const EditorModal = ({ post, onClose, onSave }: IEditorModalProps) => {
  const intl = useIntl()
  const [title, setTitle] = useState(post?.title ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [image, setImage] = useState(post?.image ?? 'https://picsum.photos/seed/new-post/600/400')

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
              onClick={() =>
                onSave({
                  id: post?.id,
                  title: title || intl.formatMessage({ id: 'post.untitled' }),
                  content,
                  image,
                })
              }
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
