import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { useIntl } from 'react-intl'
import { useDraftState } from '../../hooks/useDraftState'
import { SaveCancelButtons } from './SaveCancelButtons'

interface IPageDescriptionProps {
  description: string | null
  isAdmin: boolean
  onChangeDescription: (text: string) => void
}

const DESCRIPTION_DRAFT_KEY = 'info_description_draft_v1'

const PageDescription = ({ description, isAdmin, onChangeDescription }: IPageDescriptionProps) => {
  const intl = useIntl()
  const [draft, setDraft, clearDraft] = useDraftState(DESCRIPTION_DRAFT_KEY, description ?? '', isAdmin)
  const [isEditing, setIsEditing] = useState(() => isAdmin && draft !== (description ?? ''))

  const handleSave = () => {
    onChangeDescription(draft)
    clearDraft()
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDraft(description ?? '')
    clearDraft()
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="mb-8 space-y-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="w-full rounded bg-black/20 p-2 text-sm text-white placeholder-gray-400"
        />
        <SaveCancelButtons size="sm" onSave={handleSave} onCancel={handleCancel} />
      </div>
    )
  }

  if (description) {
    return (
      <div className="mb-8 flex items-start justify-between gap-3">
        <p className="text-sm text-gray-200 whitespace-pre-wrap">{description}</p>
        {isAdmin && (
          <button
            onClick={() => setIsEditing(true)}
            aria-label={intl.formatMessage({ id: 'pageBanner.description' })}
            className="shrink-0 p-1 rounded bg-black/20"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>
    )
  }

  if (isAdmin) {
    return (
      <div className="mb-8">
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200"
        >
          <Edit2 size={14} />
          {intl.formatMessage({ id: 'pageBanner.addDescription' })}
        </button>
      </div>
    )
  }

  return null
}

export { PageDescription }
