import { useState } from 'react'
import type { Post } from '../types'
import { CategorySelect, POST_CATEGORIES } from './CategorySelect'
import type { PostCategory } from './CategorySelect'
import { ImagePicker } from './ImagePicker'

interface IEditorModalProps {
  post: Post | null
  onClose: () => void
  onSave: (data: Omit<Post, 'id' | 'date'> & { id?: string }) => void
}

const EditorModal = ({ post, onClose, onSave }: IEditorModalProps) => {
  const [title, setTitle] = useState(post?.title ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [image, setImage] = useState(post?.image ?? 'https://picsum.photos/seed/new-post/600/400')
  const [category, setCategory] = useState<PostCategory>(
    (post?.category as PostCategory | undefined) ?? POST_CATEGORIES[0],
  )

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#061018] max-w-2xl w-full rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{post ? 'Edytuj post' : 'Dodaj post'}</h3>
          <button onClick={onClose} className="p-1">✕</button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-sm">Tytuł</label>
          <input className="w-full p-3 rounded bg-black/20" value={title} onChange={(e) => setTitle(e.target.value)} />

          <label className="block text-sm">Treść</label>
          <textarea className="w-full p-3 rounded bg-black/20 h-36" value={content} onChange={(e) => setContent(e.target.value)} />

          <label className="block text-sm">Kategoria</label>
          <CategorySelect value={category} onChange={setCategory} />

          <label className="block text-sm">Zdjęcie</label>
          <ImagePicker value={image} onChange={setImage} />

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-black/20 rounded">Anuluj</button>
            <button
              onClick={() =>
                onSave({ id: post?.id, title: title || 'Untitled', content, image, category })
              }
              className="px-4 py-2 bg-neon text-black rounded"
            >
              Zapisz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { EditorModal }
