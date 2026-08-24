import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { AuthService } from '../AuthService'

const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()
const mockSignInWithPassword = vi.fn()
const mockSignOut = vi.fn()

const unsubscribe = vi.fn()

let auth: AuthService

beforeEach(() => {
  mockGetSession.mockReset().mockResolvedValue({ data: { session: null } })
  mockOnAuthStateChange.mockReset().mockReturnValue({ data: { subscription: { unsubscribe } } })
  mockSignInWithPassword.mockReset()
  mockSignOut.mockReset().mockResolvedValue({ error: null })
  unsubscribe.mockReset()
  auth = new AuthService({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
    },
  } as unknown as SupabaseClient)
})

describe('getSession', () => {
  it('returns null when there is no existing session', async () => {
    await expect(auth.getSession()).resolves.toBeNull()
  })

  it('returns the session when one exists', async () => {
    const session = { user: { id: '1' } }
    mockGetSession.mockResolvedValue({ data: { session } })

    await expect(auth.getSession()).resolves.toBe(session)
  })
})

describe('onAuthStateChange', () => {
  it('forwards the session to the listener', () => {
    let capturedCallback: ((event: string, session: unknown) => void) | undefined
    mockOnAuthStateChange.mockImplementation((callback) => {
      capturedCallback = callback
      return { data: { subscription: { unsubscribe } } }
    })

    const listener = vi.fn()
    auth.onAuthStateChange(listener)

    const session = { user: { id: '1' } }
    capturedCallback?.('SIGNED_IN', session)
    expect(listener).toHaveBeenCalledWith(session)

    capturedCallback?.('SIGNED_OUT', null)
    expect(listener).toHaveBeenCalledWith(null)
  })

  it('returns a function that unsubscribes', () => {
    const dispose = auth.onAuthStateChange(vi.fn())
    dispose()
    expect(unsubscribe).toHaveBeenCalled()
  })
})

describe('login', () => {
  it('returns true and signs in on success', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null })

    await expect(auth.login('a@b.com', 'password')).resolves.toBe(true)
    expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: 'a@b.com', password: 'password' })
  })

  it('returns false when supabase returns an error', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: new Error('invalid credentials') })

    await expect(auth.login('a@b.com', 'wrong')).resolves.toBe(false)
  })
})

describe('logout', () => {
  it('calls supabase signOut', async () => {
    await auth.logout()
    expect(mockSignOut).toHaveBeenCalled()
  })
})
