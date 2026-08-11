import { useIntl } from 'react-intl'
import type { FontOption } from '../hooks/useFontPreference'
import { LabeledSelect } from './LabeledSelect'

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
    <LabeledSelect
      label={intl.formatMessage({ id: 'footer.font' })}
      value={font}
      onChange={(value) => onChange(value as FontOption)}
      options={(Object.keys(FONT_LABELS) as FontOption[]).map((option) => ({
        value: option,
        label: FONT_LABELS[option],
      }))}
    />
  )
}

export { FontPicker }
