import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { readJSON, removeItem, writeJSON } from '../lib/storage'

const DRAFT_WRITE_DELAY_MS = 400

type TDraftStateResult<T> = [T, Dispatch<SetStateAction<T>>, () => void]

const useDraftState = <T>(
  draftKey: string,
  initialValue: T,
  enabled = true,
): TDraftStateResult<T> => {
  const [value, setValue] = useState<T>(() => readJSON<T | null>(draftKey, null) ?? initialValue)

  useEffect(() => {
    if (!enabled) return

    const timeout = setTimeout(() => {
      writeJSON(draftKey, value)
    }, DRAFT_WRITE_DELAY_MS)
    return () => clearTimeout(timeout)
  }, [draftKey, value, enabled])

  const clearDraft = useCallback(() => {
    removeItem(draftKey)
  }, [draftKey])

  return [value, setValue, clearDraft]
}

export { useDraftState }
