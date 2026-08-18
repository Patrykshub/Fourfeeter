import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()
const mockLogin = vi.fn()
const mockLogout = vi.fn()

vi.mock('../../model/Application', () => ({
  app: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      login: mockLogin,
      logout: mockLogout,
    },
  }),
}))

import { useAdminSession } from '../useAdminSession'

const unsubscribe = vi.fn()

beforeEach(() => {
  mockGetSession.mockReset().mockResolvedValue(null)
  mockOnAuthStateChange.mockReset().mockReturnValue(unsubscribe)
  mockLogin.mockReset()
  mockLogout.mockReset().mockResolvedValue(undefined)
  unsubscribe.mockReset()
})

describe('useAdminSession', () => {
  it('is not admin when there is no existing session', async () => {
    const { result } = renderHook(() => useAdminSession())
    await waitFor(() => expect(mockGetSession).toHaveBeenCalled())
    expect(result.current.isAdmin).toBe(false)
  })

  it('is admin when a session already exists', async () => {
    mockGetSession.mockResolvedValue({ user: { id: '1' } })
    const { result } = renderHook(() => useAdminSession())
    await waitFor(() => expect(result.current.isAdmin).toBe(true))
  })

  it('updates isAdmin when the auth state changes', async () => {
    let capturedListener: ((session: unknown) => void) | undefined
    mockOnAuthStateChange.mockImplementation((listener) => {
      capturedListener = listener
      return unsubscribe
    })

    const { result } = renderHook(() => useAdminSession())
    await waitFor(() => expect(mockOnAuthStateChange).toHaveBeenCalled())

    act(() => {
      capturedListener?.({ user: { id: '1' } })
    })
    expect(result.current.isAdmin).toBe(true)

    act(() => {
      capturedListener?.(null)
    })
    expect(result.current.isAdmin).toBe(false)
  })

  it('unsubscribes from auth state changes on unmount', () => {
    const { unmount } = renderHook(() => useAdminSession())
    unmount()
    expect(unsubscribe).toHaveBeenCalled()
  })

  it('login returns true and signs in on success', async () => {
    mockLogin.mockResolvedValue(true)
    const { result } = renderHook(() => useAdminSession())

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.login('a@b.com', 'password')
    })

    expect(success).toBe(true)
    expect(mockLogin).toHaveBeenCalledWith('a@b.com', 'password')
  })

  it('login returns false when the auth service returns false', async () => {
    mockLogin.mockResolvedValue(false)
    const { result } = renderHook(() => useAdminSession())

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.login('a@b.com', 'wrong')
    })

    expect(success).toBe(false)
  })

  it('logout calls the auth service logout', async () => {
    const { result } = renderHook(() => useAdminSession())

    await act(async () => {
      await result.current.logout()
    })

    expect(mockLogout).toHaveBeenCalled()
  })
})
