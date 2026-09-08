import { useState } from 'react'
import { useDraftState } from './useDraftState'
import { useLocale } from '../i18n/LocaleContext'
import { LOCALE_SUFFIXES } from '../i18n/utils'
import type { SupportedLocale } from '../i18n/utils'
import type { IPageBannerDescriptions } from '../model/services/PageBannerService'

const descriptionsEqual = (a: IPageBannerDescriptions, b: IPageBannerDescriptions): boolean =>
  a.description_pl === b.description_pl && a.description_en === b.description_en && a.description_de === b.description_de

interface IUseLocalizedTextEditorArgs {
  draftKey: string
  descriptions: IPageBannerDescriptions
  isAdmin: boolean
  onSave: (next: IPageBannerDescriptions) => void
}

export const useLocalizedTextEditor = ({ draftKey, descriptions, isAdmin, onSave }: IUseLocalizedTextEditorArgs) => {
  const { locale: currentLocale } = useLocale()
  const [activeTab, setActiveTab] = useState<SupportedLocale>(currentLocale)
  const [draft, setDraft, clearDraft] = useDraftState<IPageBannerDescriptions>(draftKey, descriptions, isAdmin)
  const [isEditing, setIsEditing] = useState(() => isAdmin && !descriptionsEqual(draft, descriptions))

  const activeField = `description_${LOCALE_SUFFIXES[activeTab]}` as const
  const activeValue = draft[activeField] ?? ''
  const setActiveValue = (text: string) => setDraft((prev) => ({ ...prev, [activeField]: text || null }))

  const startEditing = () => setIsEditing(true)

  const handleSave = () => {
    onSave(draft)
    clearDraft()
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDraft(descriptions)
    clearDraft()
    setIsEditing(false)
  }

  const handleClear = () => {
    const cleared: IPageBannerDescriptions = { description_pl: null, description_en: null, description_de: null }
    setDraft(cleared)
    onSave(cleared)
    clearDraft()
    setIsEditing(false)
  }

  return {
    isEditing,
    startEditing,
    activeTab,
    setActiveTab,
    activeValue,
    setActiveValue,
    handleSave,
    handleCancel,
    handleClear,
  }
}
