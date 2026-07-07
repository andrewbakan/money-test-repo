import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../i18n/LocaleContext'

function getErrorMessage(error, t) {
  switch (error.message) {
    case 'EMAIL_TAKEN':
      return t.authErrorEmailTaken
    case 'PASSWORD_TOO_SHORT':
      return t.authErrorPasswordShort
    case 'VALIDATION':
      return t.authErrorValidation
    default:
      return t.authErrorGeneric
  }
}

export default function RegisterForm({ onSwitchToLogin }) {
  const { t } = useLocale()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t.authErrorPasswordMismatch)
      return
    }

    setLoading(true)

    try {
      await register({ name, email, password })
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(getErrorMessage(err, t))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form form--inset" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field__label">{t.profileName}</span>
        <input
          className="field__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.profileNamePlaceholder}
          autoComplete="name"
          required
        />
      </label>

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
          placeholder={t.authPasswordHint}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </label>

      <label className="field">
        <span className="field__label">{t.authPasswordConfirm}</span>
        <input
          className="field__input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t.authPasswordConfirmPlaceholder}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </label>

      {error && <p className="form__error">{error}</p>}

      <div className="form__actions">
        <button className="button" type="submit" disabled={loading}>
          {loading ? t.authLoading : t.authCreateAccount}
        </button>
      </div>

      <p className="auth-switch">
        {t.authHaveAccount}{' '}
        <button
          type="button"
          className="auth-switch__btn"
          onClick={onSwitchToLogin}
        >
          {t.authLogin}
        </button>
      </p>
    </form>
  )
}
