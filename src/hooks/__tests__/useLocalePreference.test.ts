import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useLocalePreference } from '../useLocalePreference'

describe('useLocalePreference', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to pl-PL when nothing is stored', () => {
    const { result } = renderHook(() => useLocalePreference())
    expect(result.current.locale).toBe('pl-PL')
  })

  it('restores a previously stored locale', () => {
    localStorage.setItem('locale_v1', JSON.stringify('de-DE'))
    const { result } = renderHook(() => useLocalePreference())
    expect(result.current.locale).toBe('de-DE')
  })

  it('setLocale persists the choice and updates state', () => {
    const { result } = renderHook(() => useLocalePreference())

    act(() => {
      result.current.setLocale('en-GB')
    })

    expect(result.current.locale).toBe('en-GB')
    expect(localStorage.getItem('locale_v1')).toBe(JSON.stringify('en-GB'))
  })
})
