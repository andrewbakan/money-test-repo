import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../i18n/LocaleContext'
import { isNonEmpty } from '../utils/form'

function getErrorMessage(error, t) {
  switch (error.message) {
    case 'EMAIL_TAKEN':
      return t.authErrorEmailTaken
    case 'INVALID_CREDENTIALS':
      return t.authErrorInvalidCredentials
    case 'PASSWORD_TOO_SHORT':
      return t.authErrorPasswordShort
    case 'WRONG_PASSWORD':
      return t.authErrorWrongPassword
    case 'VALIDATION':
      return t.authErrorValidation
    default:
      return t.authErrorGeneric
  }
}

export default function LoginForm({ onSwitchToRegister }) {
  const { t } = useLocale()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const canSubmit = isNonEmpty(email) && isNonEmpty(password)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!canSubmit) {
      return
    }

    setLoading(true)

    try {
      await login({ email, password })
      setPassword('')
    } catch (err) {
      setError(getErrorMessage(err, t))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form form--inset" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field__label">{t.authEmail}</span>
        <input
          className="field__input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.authEmailPlaceholder}
          autoComplete="email"
          required
        />
      </label>

      <label className="field">
        <span className="field__label">{t.authPassword}</span>
        <input
          className="field__input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t.authPasswordPlaceholder}
          autoComplete="current-password"
          required
        />
      </label>

      {error && <p className="form__error">{error}</p>}

      <div className="form__actions">
        <button className="button" type="submit" disabled={loading || !canSubmit}>
          {loading ? t.authLoading : t.authLogin}
        </button>
      </div>

      <p className="auth-switch">
        {t.authNoAccount}{' '}
        <button
          type="button"
          className="auth-switch__btn"
          onClick={onSwitchToRegister}
        >
          {t.authRegister}
        </button>
      </p>
    </form>
  )
}
