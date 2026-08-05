import { useState } from 'react'
import { useIntl } from 'react-intl'
import type { IInfoEntry } from '../types'
import { ModalHeader } from './ModalHeader'

interface IInfoEntryModalProps {
  entry: IInfoEntry | null
  onClose: () => void
  onSave: (data: Omit<IInfoEntry, 'id'> & { id?: string }) => void
}

const InfoEntryModal = ({ entry, onClose, onSave }: IInfoEntryModalProps) => {
  const intl = useIntl()
  const [label, setLabel] = useState(entry?.label ?? '')
  const [value, setValue] = useState(entry?.value ?? '')

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#061018] max-w-sm w-full rounded-lg p-6">
        <ModalHeader
          title={intl.formatMessage({ id: entry ? 'info.editTitle' : 'info.addTitle' })}
          onClose={onClose}
        />

        <div className="mt-4 space-y-3">
          <label className="block text-sm">{intl.formatMessage({ id: 'info.labelField' })}</label>
          <input
            className="w-full p-3 rounded bg-black/20"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />

          <label className="block text-sm">{intl.formatMessage({ id: 'info.valueField' })}</label>
          <input
            className="w-full p-3 rounded bg-black/20"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-black/20 rounded">
              {intl.formatMessage({ id: 'common.cancel' })}
            </button>
            <button
              onClick={() =>
                onSave({
                  id: entry?.id,
                  label: label || intl.formatMessage({ id: 'info.unnamed' }),
                  value,
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

export { InfoEntryModal }
