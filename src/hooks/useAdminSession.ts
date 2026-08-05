import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useAdminSession() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function login(email: string, password: string): Promise<boolean> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return !error
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  return { isAdmin, login, logout }
}
