import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useMediaLibrary } from '../hooks/useMediaLibrary'

interface IImagePickerProps {
  value: string
  onChange: (url: string) => void
}

const ImagePicker = ({ value, onChange }: IImagePickerProps) => {
  const { images, addImage } = useMediaLibrary()
  const [isOpen, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const select = (url: string) => {
    onChange(url)
    setOpen(false)
  }

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      addImage(url)
      select(url)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Wybierz zdjęcie</h3>
              <button onClick={() => setOpen(false)} className="p-1">✕</button>
            </div>

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
                  className="px-4 py-2 bg-black/20 rounded"
                >
                  Wgraj nowe zdjęcie
                </button>
                <p className="mt-2 text-xs text-gray-400 max-w-xs">
                  Zalecane ok. 1200×700px (poziomo, ~16:9), JPG/PNG/WebP. Plik poniżej ~1–2MB — zdjęcia są
                  zapisywane jako base64 w local storage przeglądarki, a zbyt duże mogą nie zapisać się lub
                  spowolnić stronę.
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
