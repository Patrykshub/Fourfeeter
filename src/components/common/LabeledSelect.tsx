import type { ReactNode } from 'react'
import type React from 'react'

interface ILabeledSelectOption {
  value: string
  label: string
}

interface ILabeledSelectProps {
  label: ReactNode
  value: string
  onChange: (value: string) => void
  options: ILabeledSelectOption[]
}

export const LabeledSelect: React.FC<ILabeledSelectProps> = ({ label, value, onChange, options }) => {
  return (
    <label className="flex items-center gap-1 text-xs text-gray-400">
      <span className="hidden sm:inline">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-black/20 rounded px-1 py-1 text-xs text-gray-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
