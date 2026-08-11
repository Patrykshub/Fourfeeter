import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { FONT_STACKS, useFontPreference } from '../useFontPreference'

describe('useFontPreference', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.style.removeProperty('--font-body')
  })

  it('defaults to sans and sets the CSS variable', () => {
    const { result } = renderHook(() => useFontPreference())

    expect(result.current.font).toBe('sans')
    expect(document.documentElement.style.getPropertyValue('--font-body')).toBe(FONT_STACKS.sans)
  })

  it('restores a previously stored font', () => {
    localStorage.setItem('font_v1', JSON.stringify('mono'))
    const { result } = renderHook(() => useFontPreference())

    expect(result.current.font).toBe('mono')
    expect(document.documentElement.style.getPropertyValue('--font-body')).toBe(FONT_STACKS.mono)
  })

  it('setFont persists the choice and updates the CSS variable', () => {
    const { result } = renderHook(() => useFontPreference())

    act(() => {
      result.current.setFont('serif')
    })

    expect(result.current.font).toBe('serif')
    expect(localStorage.getItem('font_v1')).toBe(JSON.stringify('serif'))
    expect(document.documentElement.style.getPropertyValue('--font-body')).toBe(FONT_STACKS.serif)
  })
})
