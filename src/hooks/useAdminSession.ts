import { useEffect, useState } from 'react'

const SESSION_KEY = 'isAdmin'
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'secret123'

export function useAdminSession() {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, isAdmin ? '1' : '0')
  }, [isAdmin])

  function login(user: string, pass: string): boolean {
    const success = user === ADMIN_USER && pass === ADMIN_PASS
    if (success) setIsAdmin(true)
    return success
  }

  return { isAdmin, login }
}
