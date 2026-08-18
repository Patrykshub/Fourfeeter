import type { Session } from '@supabase/supabase-js'
import { app } from '../Application'

export type AuthStateListener = (session: Session | null) => void

export class AuthService {
  public async getSession(): Promise<Session | null> {
    const { data } = await app().supabase.auth.getSession()
    return data.session
  }

  public onAuthStateChange(listener: AuthStateListener): () => void {
    const { data } = app().supabase.auth.onAuthStateChange((_event, session) => {
      listener(session)
    })
    return () => data.subscription.unsubscribe()
  }

  public async login(email: string, password: string): Promise<boolean> {
    const { error } = await app().supabase.auth.signInWithPassword({ email, password })
    return !error
  }

  public async logout(): Promise<void> {
    await app().supabase.auth.signOut()
  }
}
