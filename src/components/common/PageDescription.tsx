import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { useIntl } from 'react-intl'
import { useDraftState } from '../../hooks/useDraftState'
import { useLocale } from '../../i18n/LocaleContext'
import { LOCALE_LABELS } from '../../i18n/utils'
import type { SupportedLocale } from '../../i18n/utils'
import type { IPageBannerDescriptions, PageBannerKey } from '../../model/services/PageBannerService'
import { SaveCancelButtons } from './SaveCancelButtons'

interface IPageDescriptionProps {
  pageKey: PageBannerKey
  description: string | null
  descriptions: IPageBannerDescriptions
  isAdmin: boolean
  onChangeDescriptions: (next: IPageBannerDescriptions) => void
}

const LOCALE_SUFFIXES: Record<SupportedLocale, 'pl' | 'en' | 'de'> = {
  'pl-PL': 'pl',
  'en-GB': 'en',
  'de-DE': 'de',
}

const LOCALES: SupportedLocale[] = ['pl-PL', 'en-GB', 'de-DE']

const descriptionsEqual = (a: IPageBannerDescriptions, b: IPageBannerDescriptions): boolean =>
  a.description_pl === b.description_pl && a.description_en === b.description_en && a.description_de === b.description_de

export const PageDescription = ({ pageKey, description, descriptions, isAdmin, onChangeDescriptions }: IPageDescriptionProps) => {
  const intl = useIntl()
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
      <div className="mb-8 space-y-2">
        <div className="flex gap-2">
          {LOCALES.map((localeOption) => (
            <button
              key={localeOption}
              type="button"
              onClick={() => setActiveTab(localeOption)}
              className={`px-3 py-1 rounded text-sm ${
                activeTab === localeOption ? 'bg-neon text-black' : 'bg-black/20'
              }`}
            >
              {LOCALE_LABELS[localeOption]}
            </button>
          ))}
        </div>
        <textarea
          value={activeValue}
          onChange={(e) => setActiveValue(e.target.value)}
          rows={3}
          className="w-full rounded bg-black/20 p-2 text-base text-white placeholder-gray-400"
        />
        <SaveCancelButtons size="sm" onSave={handleSave} onCancel={handleCancel} />
      </div>
    )
  }

  if (description) {
    return (
      <div className="mb-8 flex items-start justify-between gap-3">
        <p className="text-base leading-relaxed text-gray-200 whitespace-pre-wrap">{description}</p>
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
