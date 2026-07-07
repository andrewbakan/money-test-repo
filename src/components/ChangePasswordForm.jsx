import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../i18n/LocaleContext'
import {
  isNonEmpty,
  isValidPassword,
  passwordsMatch,
} from '../utils/form'

function getErrorMessage(error, t) {
  switch (error.message) {
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

export default function ChangePasswordForm() {
  const { t } = useLocale()
  const { changePassword } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const canSubmit =
    isNonEmpty(currentPassword) &&
    isValidPassword(newPassword) &&
    passwordsMatch(newPassword, confirmPassword)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess(false)

    if (!canSubmit) {
      return
    }

    if (newPassword !== confirmPassword) {
      setError(t.authErrorPasswordMismatch)
      return
    }

    setLoading(true)

    try {
      await changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess(true)
      window.setTimeout(() => setSuccess(false), 2500)
    } catch (err) {
      setError(getErrorMessage(err, t))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form form--inset" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field__label">{t.authCurrentPassword}</span>
        <input
          className="field__input"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      <label className="field">
        <span className="field__label">{t.authNewPassword}</span>
        <input
          className="field__input"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
          autoComplete="new-password"
          minLength={6}
          required
        />
      </label>

      {error && <p className="form__error">{error}</p>}
      {success && <p className="form__success">{t.authPasswordChanged}</p>}

      <div className="form__actions">
        <button className="button" type="submit" disabled={loading || !canSubmit}>
          {loading ? t.authLoading : t.authChangePassword}
        </button>
      </div>
    </form>
  )
}
