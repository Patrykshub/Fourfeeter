import { useIntl } from 'react-intl'
import type { FontOption } from '../hooks/useFontPreference'

const FONT_LABELS: Record<FontOption, string> = {
  sans: 'Sans',
  serif: 'Serif',
  mono: 'Mono',
}

interface IFontPickerProps {
  font: FontOption
  onChange: (font: FontOption) => void
}

const FontPicker = ({ font, onChange }: IFontPickerProps) => {
  const intl = useIntl()

  return (
    <label className="flex items-center gap-1 text-xs text-gray-400">
      <span className="hidden sm:inline">{intl.formatMessage({ id: 'footer.font' })}</span>
      <select
        value={font}
        onChange={(e) => onChange(e.target.value as FontOption)}
        className="bg-black/20 rounded px-1 py-1 text-xs text-gray-200"
      >
        {(Object.keys(FONT_LABELS) as FontOption[]).map((option) => (
          <option key={option} value={option}>
            {FONT_LABELS[option]}
          </option>
        ))}
      </select>
    </label>
  )
}

export { FontPicker }
