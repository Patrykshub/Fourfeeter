import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDraftState } from '../useDraftState'

describe('useDraftState', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('falls back to the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useDraftState('draft-key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('restores a previously stored draft', () => {
    localStorage.setItem('draft-key', JSON.stringify('stored'))
    const { result } = renderHook(() => useDraftState('draft-key', 'initial'))
    expect(result.current[0]).toBe('stored')
  })

  it('debounces writes to storage', () => {
    const { result } = renderHook(() => useDraftState('draft-key', 'initial'))

    act(() => {
      result.current[1]('updated')
    })
    expect(localStorage.getItem('draft-key')).toBeNull()

    act(() => {
      vi.advanceTimersByTime(399)
    })
    expect(localStorage.getItem('draft-key')).toBeNull()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(localStorage.getItem('draft-key')).toBe(JSON.stringify('updated'))
  })

  it('does not persist to storage when disabled', () => {
    const { result } = renderHook(() => useDraftState('draft-key', 'initial', false))

    act(() => {
      result.current[1]('updated')
    })
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(localStorage.getItem('draft-key')).toBeNull()
  })

  it('clearDraft removes the stored draft', () => {
    localStorage.setItem('draft-key', JSON.stringify('stored'))
    const { result } = renderHook(() => useDraftState('draft-key', 'initial'))

    act(() => {
      result.current[2]()
    })

    expect(localStorage.getItem('draft-key')).toBeNull()
  })
})
