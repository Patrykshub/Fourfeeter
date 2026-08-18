import { useEffect, useState } from 'react'
import { app } from '../model/Application'

export const useAdminSession = () => {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    app()
      .auth.getSession()
      .then((session) => {
        setIsAdmin(!!session)
      })

    const unsubscribe = app().auth.onAuthStateChange((session) => {
      setIsAdmin(!!session)
    })

    return unsubscribe
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    return app().auth.login(email, password)
  }

  const logout = async () => {
    await app().auth.logout()
  }

  return { isAdmin, login, logout }
}
