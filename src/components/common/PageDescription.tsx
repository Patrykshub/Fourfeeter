import { useIntl } from 'react-intl'
import { Edit2 } from 'lucide-react'
import { useLocalizedTextEditor } from '../../hooks/useLocalizedTextEditor'
import type { SupportedLocale } from '../../i18n/utils'
import type { IPageBannerDescriptions, PageBannerKey } from '../../model/services/PageBannerService'
import { LocaleTabs } from './LocaleTabs'
import { SaveCancelButtons } from './SaveCancelButtons'

interface IPageDescriptionProps {
  pageKey: PageBannerKey
  description: string | null
  descriptions: IPageBannerDescriptions
  isAdmin: boolean
  onChangeDescriptions: (next: IPageBannerDescriptions) => void
}

interface IEditFormProps {
  activeTab: SupportedLocale
  onChangeTab: (locale: SupportedLocale) => void
  value: string
  onChangeValue: (text: string) => void
  onSave: () => void
  onCancel: () => void
}

const EditForm = ({ activeTab, onChangeTab, value, onChangeValue, onSave, onCancel }: IEditFormProps) => (
  <div className="mb-8 space-y-2">
    <LocaleTabs activeTab={activeTab} onChange={onChangeTab} />
    <textarea
      value={value}
      onChange={(e) => onChangeValue(e.target.value)}
      rows={3}
      className="w-full rounded bg-black/20 p-2 text-base text-white placeholder-gray-400"
    />
    <SaveCancelButtons size="sm" onSave={onSave} onCancel={onCancel} />
  </div>
)

interface IReadViewProps {
  description: string
  isAdmin: boolean
  onEdit: () => void
}

const ReadView = ({ description, isAdmin, onEdit }: IReadViewProps) => {
  const intl = useIntl()

  return (
    <div className="mb-8 flex items-start justify-between gap-3">
      <p className="text-base leading-relaxed text-gray-200 whitespace-pre-wrap">{description}</p>
      {isAdmin && (
        <button
          onClick={onEdit}
          aria-label={intl.formatMessage({ id: 'pageBanner.description' })}
          className="shrink-0 p-1 rounded bg-black/20"
        >
          <Edit2 size={16} />
        </button>
      )}
    </div>
  )
}

const AddDescriptionPrompt = ({ onClick }: { onClick: () => void }) => {
  const intl = useIntl()

  return (
    <div className="mb-8">
      <button onClick={onClick} className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200">
        <Edit2 size={14} />
        {intl.formatMessage({ id: 'pageBanner.addDescription' })}
      </button>
    </div>
  )
}

export const PageDescription = ({ pageKey, description, descriptions, isAdmin, onChangeDescriptions }: IPageDescriptionProps) => {
  const editor = useLocalizedTextEditor({
    draftKey: `page_description_draft_v1_${pageKey}`,
    descriptions,
    isAdmin,
    onSave: onChangeDescriptions,
  })

  if (editor.isEditing) {
    return (
      <EditForm
        activeTab={editor.activeTab}
        onChangeTab={editor.setActiveTab}
        value={editor.activeValue}
        onChangeValue={editor.setActiveValue}
        onSave={editor.handleSave}
        onCancel={editor.handleCancel}
      />
    )
  }

  if (description) {
    return <ReadView description={description} isAdmin={isAdmin} onEdit={editor.startEditing} />
  }

  if (isAdmin) {
    return <AddDescriptionPrompt onClick={editor.startEditing} />
  }

  return null
}
