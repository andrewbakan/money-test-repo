import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../i18n/LocaleContext'

export default function AccountSettings() {
  const { t } = useLocale()
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setName(user?.name ?? '')
  }, [user?.name])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await updateProfile({ name })
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2000)
    } catch {
      setError(t.authErrorValidation)
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
          maxLength={40}
          required
        />
      </label>

      <label className="field">
        <span className="field__label">{t.authEmail}</span>
        <input
          className="field__input field__input--readonly"
          type="email"
          value={user?.email ?? ''}
          readOnly
        />
      </label>

      {error && <p className="form__error">{error}</p>}
      {saved && <p className="form__success">{t.authProfileSaved}</p>}

      <div className="form__actions">
        <button className="button" type="submit" disabled={loading}>
          {loading ? t.authLoading : t.authSaveProfile}
        </button>
      </div>
    </form>
  )
}
