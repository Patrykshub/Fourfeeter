import { useIntl } from 'react-intl'

type TSaveCancelButtonsSize = 'sm' | 'md'

interface ISaveCancelButtonsProps {
  onSave: () => void
  onCancel: () => void
  size?: TSaveCancelButtonsSize
}

interface ISaveCancelButtonsSizeClasses {
  container: string
  button: string
}

const SIZE_CLASSES: Record<TSaveCancelButtonsSize, ISaveCancelButtonsSizeClasses> = {
  sm: { container: 'gap-2', button: 'px-3 py-1 text-sm' },
  md: { container: 'gap-3', button: 'px-4 py-2' },
}

export const SaveCancelButtons = ({ onSave, onCancel, size = 'md' }: ISaveCancelButtonsProps) => {
  const intl = useIntl()
  const { container, button } = SIZE_CLASSES[size]

  return (
    <div className={`flex justify-end ${container}`}>
      <button onClick={onCancel} className={`${button} bg-black/20 rounded`}>
        {intl.formatMessage({ id: 'common.cancel' })}
      </button>
      <button onClick={onSave} className={`${button} bg-neon text-black rounded`}>
        {intl.formatMessage({ id: 'common.save' })}
      </button>
    </div>
  )
}
