import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { useIntl } from 'react-intl'
import { useDraftState } from '../../hooks/useDraftState'
import { useLocale } from '../../i18n/LocaleContext'
import { LOCALE_SUFFIXES } from '../../i18n/utils'
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

const descriptionsEqual = (a: IPageBannerDescriptions, b: IPageBannerDescriptions): boolean =>
  a.description_pl === b.description_pl && a.description_en === b.description_en && a.description_de === b.description_de

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
  const { locale: currentLocale } = useLocale()
  const [activeTab, setActiveTab] = useState<SupportedLocale>(currentLocale)
  const draftKey = `page_description_draft_v1_${pageKey}`
  const [draft, setDraft, clearDraft] = useDraftState<IPageBannerDescriptions>(draftKey, descriptions, isAdmin)
  const [isEditing, setIsEditing] = useState(() => isAdmin && !descriptionsEqual(draft, descriptions))

  const activeField = `description_${LOCALE_SUFFIXES[activeTab]}` as const
  const activeValue = draft[activeField] ?? ''
  const setActiveValue = (text: string) => setDraft((prev) => ({ ...prev, [activeField]: text || null }))

  const handleSave = () => {
    onChangeDescriptions(draft)
    clearDraft()
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDraft(descriptions)
    clearDraft()
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <EditForm
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        value={activeValue}
        onChangeValue={setActiveValue}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  if (description) {
    return <ReadView description={description} isAdmin={isAdmin} onEdit={() => setIsEditing(true)} />
  }

  if (isAdmin) {
    return <AddDescriptionPrompt onClick={() => setIsEditing(true)} />
  }

  return null
}
