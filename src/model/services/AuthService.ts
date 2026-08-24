import type { Session, SupabaseClient } from '@supabase/supabase-js'

export type AuthStateListener = (session: Session | null) => void

export class AuthService {
  public constructor(private readonly supabase: SupabaseClient) {}

  public async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession()
    return data.session
  }

  public onAuthStateChange(listener: AuthStateListener): () => void {
    const { data } = this.supabase.auth.onAuthStateChange((_event, session) => {
      listener(session)
    })
    return () => data.subscription.unsubscribe()
  }

  public async login(email: string, password: string): Promise<boolean> {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Failed to log in', error)
      return false
    }
    return true
  }

  public async logout(): Promise<void> {
    await this.supabase.auth.signOut()
  }
}
