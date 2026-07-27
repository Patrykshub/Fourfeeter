import { useState } from 'react'
import type { Post } from '../types'

export function EditorModal({
  post,
  onClose,
  onSave,
}: {
  post: Post | null
  onClose: () => void
  onSave: (data: Omit<Post, 'id' | 'date'> & { id?: string }) => void
}) {
  const [title, setTitle] = useState(post?.title ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [image, setImage] = useState(post?.image ?? 'https://picsum.photos/seed/new-post/600/400')
  const [category, setCategory] = useState(post?.category ?? 'TECHNOLOGY')

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
          <input className="w-full p-3 rounded bg-black/20" value={category} onChange={(e) => setCategory(e.target.value)} />

          <label className="block text-sm">Link do zdjęcia</label>
          <input className="w-full p-3 rounded bg-black/20" value={image} onChange={(e) => setImage(e.target.value)} />

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
