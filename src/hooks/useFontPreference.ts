import { useEffect, useState } from 'react'
import { app } from '../model/Application'

const STORAGE_KEY = 'font_v1'

export const FONT_STACKS = {
  sans: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
} as const

export type FontOption = keyof typeof FONT_STACKS

export const useFontPreference = () => {
  const [font, setFont] = useState<FontOption>(() => app().storage.readJSON<FontOption>(STORAGE_KEY, 'sans'))

  useEffect(() => {
    app().storage.writeJSON(STORAGE_KEY, font)
    document.documentElement.style.setProperty('--font-body', FONT_STACKS[font])
  }, [font])

  return { font, setFont }
}
