import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StorageService } from '../StorageService'

let storage: StorageService

beforeEach(() => {
  localStorage.clear()
  storage = new StorageService()
})

describe('readJSON', () => {
  it('returns the fallback when nothing is stored', () => {
    expect(storage.readJSON('missing', 'fallback')).toBe('fallback')
  })

  it('returns the parsed stored value', () => {
    localStorage.setItem('key', JSON.stringify('value'))
    expect(storage.readJSON('key', 'fallback')).toBe('value')
  })

  it('returns the fallback when the stored value is not valid JSON', () => {
    localStorage.setItem('key', '{invalid')
    expect(storage.readJSON('key', 'fallback')).toBe('fallback')
  })
})

describe('writeJSON', () => {
  it('persists the value and returns true', () => {
    expect(storage.writeJSON('key', 'value')).toBe(true)
    expect(localStorage.getItem('key')).toBe(JSON.stringify('value'))
  })

  it('returns false and logs when localStorage throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(storage.writeJSON('key', 'value')).toBe(false)
    expect(consoleSpy).toHaveBeenCalled()

    vi.restoreAllMocks()
  })
})

describe('removeItem', () => {
  it('removes the stored value', () => {
    localStorage.setItem('key', JSON.stringify('value'))
    storage.removeItem('key')
    expect(localStorage.getItem('key')).toBeNull()
  })

  it('logs when localStorage throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('denied')
    })

    storage.removeItem('key')
    expect(consoleSpy).toHaveBeenCalled()

    vi.restoreAllMocks()
  })
})
