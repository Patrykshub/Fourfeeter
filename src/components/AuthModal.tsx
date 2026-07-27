import { useState } from 'react'

export function AuthModal({
  onClose,
  onLogin,
}: {
  onClose: () => void
  onLogin: (user: string, pass: string) => boolean
}) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [hasError, setHasError] = useState(false)

  function handleLogin() {
    const success = onLogin(user, pass)
    if (success) {
      onClose()
    } else {
      setHasError(true)
      setPass('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#061018] max-w-sm w-full rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Admin Login</h3>
          <button onClick={onClose} className="p-1">✕</button>
        </div>
        <div className="mt-4 space-y-3">
          <input
            className="w-full p-3 rounded bg-black/20"
            placeholder="Login"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            className="w-full p-3 rounded bg-black/20"
            placeholder="Hasło"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {hasError && <div className="text-xs text-red-400">Nieprawidłowe dane logowania</div>}
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-black/20 rounded">Anuluj</button>
            <button onClick={handleLogin} className="px-4 py-2 bg-neon text-black rounded">Zaloguj</button>
          </div>
        </div>
      </div>
    </div>
  )
}
