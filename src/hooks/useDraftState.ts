import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { app } from '../model/Application'

const DRAFT_WRITE_DELAY_MS = 400

type TDraftStateResult<T> = [T, Dispatch<SetStateAction<T>>, () => void]

export const useDraftState = <T>(
  draftKey: string,
  initialValue: T,
  enabled = true,
): TDraftStateResult<T> => {
  const [value, setValue] = useState<T>(() => app().storage.readJSON<T | null>(draftKey, null) ?? initialValue)

  useEffect(() => {
    if (!enabled) return

    const timeout = setTimeout(() => {
      app().storage.writeJSON(draftKey, value)
    }, DRAFT_WRITE_DELAY_MS)
    return () => clearTimeout(timeout)
  }, [draftKey, value, enabled])

  const clearDraft = useCallback(() => {
    app().storage.removeItem(draftKey)
  }, [draftKey])

  return [value, setValue, clearDraft]
}
