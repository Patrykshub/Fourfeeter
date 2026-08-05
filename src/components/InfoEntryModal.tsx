import { useState } from 'react'
import type { IInfoEntry } from '../types'

interface IInfoEntryModalProps {
  entry: IInfoEntry | null
  onClose: () => void
  onSave: (data: Omit<IInfoEntry, 'id'> & { id?: string }) => void
}

const InfoEntryModal = ({ entry, onClose, onSave }: IInfoEntryModalProps) => {
  const [label, setLabel] = useState(entry?.label ?? '')
  const [value, setValue] = useState(entry?.value ?? '')

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#061018] max-w-sm w-full rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{entry ? 'Edytuj pozycję' : 'Dodaj pozycję'}</h3>
          <button onClick={onClose} className="p-1">✕</button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-sm">Klucz</label>
          <input
            className="w-full p-3 rounded bg-black/20"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />

          <label className="block text-sm">Wartość</label>
          <input
            className="w-full p-3 rounded bg-black/20"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-black/20 rounded">Anuluj</button>
            <button
              onClick={() => onSave({ id: entry?.id, label: label || 'Bez nazwy', value })}
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

export { InfoEntryModal }
