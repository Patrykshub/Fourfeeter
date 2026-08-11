import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}))

import { supabase } from '../../lib/supabaseClient'
import { useAdminSession } from '../useAdminSession'

const mockGetSession = supabase.auth.getSession as unknown as ReturnType<typeof vi.fn>
const mockOnAuthStateChange = supabase.auth.onAuthStateChange as unknown as ReturnType<typeof vi.fn>
const mockSignInWithPassword = supabase.auth.signInWithPassword as unknown as ReturnType<typeof vi.fn>
const mockSignOut = supabase.auth.signOut as unknown as ReturnType<typeof vi.fn>

const unsubscribe = vi.fn()

beforeEach(() => {
  mockGetSession.mockReset().mockResolvedValue({ data: { session: null } })
  mockOnAuthStateChange.mockReset().mockReturnValue({ data: { subscription: { unsubscribe } } })
  mockSignInWithPassword.mockReset()
  mockSignOut.mockReset().mockResolvedValue({ error: null })
  unsubscribe.mockReset()
})

describe('useAdminSession', () => {
  it('is not admin when there is no existing session', async () => {
    const { result } = renderHook(() => useAdminSession())
    await waitFor(() => expect(mockGetSession).toHaveBeenCalled())
    expect(result.current.isAdmin).toBe(false)
  })

  it('is admin when a session already exists', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: '1' } } } })
    const { result } = renderHook(() => useAdminSession())
    await waitFor(() => expect(result.current.isAdmin).toBe(true))
  })

  it('updates isAdmin when the auth state changes', async () => {
    let capturedCallback: ((event: string, session: unknown) => void) | undefined
    mockOnAuthStateChange.mockImplementation((callback) => {
      capturedCallback = callback
      return { data: { subscription: { unsubscribe } } }
    })

    const { result } = renderHook(() => useAdminSession())
    await waitFor(() => expect(mockOnAuthStateChange).toHaveBeenCalled())

    act(() => {
      capturedCallback?.('SIGNED_IN', { user: { id: '1' } })
    })
    expect(result.current.isAdmin).toBe(true)

    act(() => {
      capturedCallback?.('SIGNED_OUT', null)
    })
    expect(result.current.isAdmin).toBe(false)
  })

  it('unsubscribes from auth state changes on unmount', () => {
    const { unmount } = renderHook(() => useAdminSession())
    unmount()
    expect(unsubscribe).toHaveBeenCalled()
  })

  it('login returns true and signs in on success', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null })
    const { result } = renderHook(() => useAdminSession())

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.login('a@b.com', 'password')
    })

    expect(success).toBe(true)
    expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: 'a@b.com', password: 'password' })
  })

  it('login returns false when supabase returns an error', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: new Error('invalid credentials') })
    const { result } = renderHook(() => useAdminSession())

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.login('a@b.com', 'wrong')
    })

    expect(success).toBe(false)
  })

  it('logout calls supabase signOut', async () => {
    const { result } = renderHook(() => useAdminSession())

    await act(async () => {
      await result.current.logout()
    })

    expect(mockSignOut).toHaveBeenCalled()
  })
})
