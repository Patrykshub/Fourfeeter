import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useMediaLibrary } from '../hooks/useMediaLibrary'
import { ModalHeader } from './ModalHeader'

interface IImagePickerProps {
  value: string
  onChange: (url: string) => void
}

const ImagePicker = ({ value, onChange }: IImagePickerProps) => {
  const { images, uploadImage } = useMediaLibrary()
  const [isOpen, setOpen] = useState(false)
  const [isUploading, setUploading] = useState(false)
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
      alert('Nie udało się przesłać zdjęcia.')
    }
  }

  return (
    <div>
      <div className="flex gap-3 items-center">
        <img src={value} alt="" className="w-20 h-14 object-cover rounded bg-black/20" />
        <button type="button" onClick={() => setOpen(true)} className="px-4 py-2 bg-black/20 rounded">
          Wybierz z galerii
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-10">
          <div className="bg-[#061018] max-w-2xl w-full rounded-lg p-6">
            <ModalHeader title="Wybierz zdjęcie" onClose={() => setOpen(false)} />

            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
              {images.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => select(url)}
                  className={`rounded overflow-hidden border-2 ${
                    url === value ? 'border-neon' : 'border-transparent'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-20 object-cover" />
                </button>
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
                  {isUploading ? 'Przesyłanie…' : 'Wgraj nowe zdjęcie'}
                </button>
                <p className="mt-2 text-xs text-gray-400 max-w-xs">
                  Zalecane ok. 1200×700px (poziomo, ~16:9), JPG/PNG/WebP.
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 bg-neon text-black rounded">
                Zamknij
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
    </div>
  )
}

export { ImagePicker }
