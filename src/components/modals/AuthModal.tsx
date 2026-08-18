import { useState } from 'react'
import { useIntl } from 'react-intl'
import { ModalHeader } from './ModalHeader'
import { ModalShell } from './ModalShell'

interface IAuthModalProps {
  onClose: () => void
  onLogin: (user: string, pass: string) => Promise<boolean>
}

export const AuthModal = ({ onClose, onLogin }: IAuthModalProps) => {
  const intl = useIntl()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [hasError, setHasError] = useState(false)

  const handleLogin = async () => {
    const success = await onLogin(user, pass)
    if (success) {
      onClose()
    } else {
      setHasError(true)
      setPass('')
    }
  }

  return (
    <ModalShell maxWidth="sm">
      <ModalHeader title={intl.formatMessage({ id: 'auth.title' })} onClose={onClose} />
      <div className="mt-4 space-y-3">
        <input
          className="w-full p-3 rounded bg-black/20"
          placeholder={intl.formatMessage({ id: 'auth.emailPlaceholder' })}
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className="w-full p-3 rounded bg-black/20"
          placeholder={intl.formatMessage({ id: 'auth.passwordPlaceholder' })}
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        {hasError && (
          <div className="text-xs text-red-400">{intl.formatMessage({ id: 'auth.error' })}</div>
        )}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-black/20 rounded">
            {intl.formatMessage({ id: 'common.cancel' })}
          </button>
          <button onClick={handleLogin} className="px-4 py-2 bg-neon text-black rounded">
            {intl.formatMessage({ id: 'auth.submit' })}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
