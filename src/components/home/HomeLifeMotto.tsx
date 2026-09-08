import { useIntl } from 'react-intl'
import { Edit2, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useLocalizedTextEditor } from '../../hooks/useLocalizedTextEditor'
import { AdminActions } from '../common/AdminActions'
import { LocaleTabs } from '../common/LocaleTabs'
import { SaveCancelButtons } from '../common/SaveCancelButtons'
import type { IPageBannerDescriptions } from '../../model/services/PageBannerService'
import { heroFadeIn } from './motionVariants'

interface IHomeLifeMottoProps {
  motto: string | null
  descriptions: IPageBannerDescriptions
  isAdmin: boolean
  onChangeMotto: (next: IPageBannerDescriptions) => void
}

export const HomeLifeMotto = ({ motto, descriptions, isAdmin, onChangeMotto }: IHomeLifeMottoProps) => {
  const intl = useIntl()
  const editor = useLocalizedTextEditor({
    draftKey: 'home_life_motto_draft_v1',
    descriptions,
    isAdmin,
    onSave: onChangeMotto,
  })

  if (editor.isEditing) {
    return (
      <div className="my-12 max-w-xl mx-auto space-y-2">
        <LocaleTabs activeTab={editor.activeTab} onChange={editor.setActiveTab} />
        <textarea
          value={editor.activeValue}
          onChange={(e) => editor.setActiveValue(e.target.value)}
          rows={3}
          className="w-full rounded bg-black/20 p-2 text-base text-white placeholder-gray-400 text-center"
        />
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={editor.handleClear}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200"
          >
            <Trash2 size={14} />
            {intl.formatMessage({ id: 'home.motto.remove' })}
          </button>
          <SaveCancelButtons size="sm" onSave={editor.handleSave} onCancel={editor.handleCancel} />
        </div>
      </div>
    )
  }

  if (motto) {
    return (
      <div className="my-12 min-h-[220px] flex flex-col items-center justify-center gap-3 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={motto}
            variants={heroFadeIn}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="max-w-3xl text-3xl sm:text-5xl font-serif italic text-white"
          >
            {motto}
          </motion.p>
        </AnimatePresence>
        {isAdmin && (
          <AdminActions compact onEdit={editor.startEditing} onDelete={editor.handleClear} />
        )}
      </div>
    )
  }

  if (isAdmin) {
    return (
      <div className="my-12 flex justify-center">
        <button
          onClick={editor.startEditing}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200"
        >
          <Edit2 size={14} />
          {intl.formatMessage({ id: 'home.motto.add' })}
        </button>
      </div>
    )
  }

  return null
}
