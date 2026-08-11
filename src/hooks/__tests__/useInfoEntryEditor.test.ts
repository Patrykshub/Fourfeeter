import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useInfoEntryEditor } from '../useInfoEntryEditor'
import type { IInfoEntry } from '../../types'

const entry: IInfoEntry = { id: '1', label: 'Label', value: 'Value' }

const setup = () => {
  const saveEntry = vi.fn()
  const deleteEntry = vi.fn()
  const { result } = renderHook(() => useInfoEntryEditor({ saveEntry, deleteEntry }))
  return { result, saveEntry, deleteEntry }
}

describe('useInfoEntryEditor', () => {
  it('starts with the form closed and nothing being edited', () => {
    const { result } = setup()
    expect(result.current.isFormOpen).toBe(false)
    expect(result.current.editing).toBeNull()
    expect(result.current.pendingDeleteId).toBeNull()
  })

  it('openEditor with no entry opens the form for creating a new entry', () => {
    const { result } = setup()
    act(() => result.current.openEditor())
    expect(result.current.isFormOpen).toBe(true)
    expect(result.current.editing).toBeNull()
  })

  it('openEditor with an entry opens the form for editing it', () => {
    const { result } = setup()
    act(() => result.current.openEditor(entry))
    expect(result.current.isFormOpen).toBe(true)
    expect(result.current.editing).toBe(entry)
  })

  it('closeEditor closes the form', () => {
    const { result } = setup()
    act(() => result.current.openEditor(entry))
    act(() => result.current.closeEditor())
    expect(result.current.isFormOpen).toBe(false)
  })

  it('handleSave saves the entry and closes the form', () => {
    const { result, saveEntry } = setup()
    const data = { label: 'New', value: 'Val' }
    act(() => result.current.openEditor())
    act(() => result.current.handleSave(data))
    expect(saveEntry).toHaveBeenCalledWith(data)
    expect(result.current.isFormOpen).toBe(false)
  })

  it('handleDelete stores the pending id without deleting immediately', () => {
    const { result, deleteEntry } = setup()
    act(() => result.current.handleDelete('1'))
    expect(result.current.pendingDeleteId).toBe('1')
    expect(deleteEntry).not.toHaveBeenCalled()
  })

  it('confirmDelete deletes the pending entry and clears the pending id', () => {
    const { result, deleteEntry } = setup()
    act(() => result.current.handleDelete('1'))
    act(() => result.current.confirmDelete())
    expect(deleteEntry).toHaveBeenCalledWith('1')
    expect(result.current.pendingDeleteId).toBeNull()
  })

  it('confirmDelete does nothing when there is no pending id', () => {
    const { result, deleteEntry } = setup()
    act(() => result.current.confirmDelete())
    expect(deleteEntry).not.toHaveBeenCalled()
  })

  it('cancelDelete clears the pending id without deleting', () => {
    const { result, deleteEntry } = setup()
    act(() => result.current.handleDelete('1'))
    act(() => result.current.cancelDelete())
    expect(result.current.pendingDeleteId).toBeNull()
    expect(deleteEntry).not.toHaveBeenCalled()
  })
})
