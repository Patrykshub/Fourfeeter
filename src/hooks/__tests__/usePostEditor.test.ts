import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { usePostEditor } from '../usePostEditor'
import type { IPost } from '../../types'

const post: IPost = {
  id: '1',
  title_pl: 'Tytuł',
  title_en: 'Title',
  title_de: 'Titel',
  content_pl: 'Treść',
  content_en: 'Content',
  content_de: 'Inhalt',
  image: 'img.png',
  date: '2026-01-01',
}

const setup = () => {
  const savePost = vi.fn()
  const deletePost = vi.fn()
  const { result } = renderHook(() => usePostEditor({ savePost, deletePost }))
  return { result, savePost, deletePost }
}

describe('usePostEditor', () => {
  it('starts with the form closed and nothing being edited', () => {
    const { result } = setup()
    expect(result.current.isFormOpen).toBe(false)
    expect(result.current.editing).toBeNull()
    expect(result.current.pendingDeleteId).toBeNull()
  })

  it('openEditor with no post opens the form for creating a new post', () => {
    const { result } = setup()
    act(() => result.current.openEditor())
    expect(result.current.isFormOpen).toBe(true)
    expect(result.current.editing).toBeNull()
  })

  it('openEditor with a post opens the form for editing it', () => {
    const { result } = setup()
    act(() => result.current.openEditor(post))
    expect(result.current.isFormOpen).toBe(true)
    expect(result.current.editing).toBe(post)
  })

  it('closeEditor closes the form', () => {
    const { result } = setup()
    act(() => result.current.openEditor(post))
    act(() => result.current.closeEditor())
    expect(result.current.isFormOpen).toBe(false)
  })

  it('handleSave saves the post and closes the form', () => {
    const { result, savePost } = setup()
    const data = {
      title_pl: 'Nowy',
      title_en: 'New',
      title_de: 'Neu',
      content_pl: 'Treść',
      content_en: 'Body',
      content_de: 'Inhalt',
      image: 'new.png',
    }
    act(() => result.current.openEditor())
    act(() => result.current.handleSave(data))
    expect(savePost).toHaveBeenCalledWith(data)
    expect(result.current.isFormOpen).toBe(false)
  })

  it('handleDelete stores the pending id without deleting immediately', () => {
    const { result, deletePost } = setup()
    act(() => result.current.handleDelete('1'))
    expect(result.current.pendingDeleteId).toBe('1')
    expect(deletePost).not.toHaveBeenCalled()
  })

  it('confirmDelete deletes the pending post and clears the pending id', () => {
    const { result, deletePost } = setup()
    act(() => result.current.handleDelete('1'))
    act(() => result.current.confirmDelete())
    expect(deletePost).toHaveBeenCalledWith('1')
    expect(result.current.pendingDeleteId).toBeNull()
  })

  it('confirmDelete does nothing when there is no pending id', () => {
    const { result, deletePost } = setup()
    act(() => result.current.confirmDelete())
    expect(deletePost).not.toHaveBeenCalled()
  })

  it('cancelDelete clears the pending id without deleting', () => {
    const { result, deletePost } = setup()
    act(() => result.current.handleDelete('1'))
    act(() => result.current.cancelDelete())
    expect(result.current.pendingDeleteId).toBeNull()
    expect(deletePost).not.toHaveBeenCalled()
  })
})
