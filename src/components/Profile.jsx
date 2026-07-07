import { useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../i18n/LocaleContext'
import { useTheme } from '../contexts/ThemeContext'
import AccountSettings from './AccountSettings'
import CategorySettings from './CategorySettings'
import ChangePasswordForm from './ChangePasswordForm'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function Profile({ expenses }) {
  const { locale, setLocale, t, formatAmount } = useLocale()
  const { theme, setTheme } = useTheme()
  const { isAuthenticated, logout } = useAuth()
  const [authMode, setAuthMode] = useState('login')

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, item) => sum + item.amount, 0)
    return { count: expenses.length, total }
  }, [expenses])

  return (
    <div className="profile">
      {!isAuthenticated ? (
        <section className="section section--lead">
          <div className="group group--padded">
            <p className="profile__hint">{t.authWelcomeHint}</p>

            <div className="auth-tabs segmented" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={authMode === 'login'}
                className={`auth-tabs__btn${authMode === 'login' ? ' auth-tabs__btn--active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                {t.authLogin}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authMode === 'register'}
                className={`auth-tabs__btn${authMode === 'register' ? ' auth-tabs__btn--active' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                {t.authRegister}
              </button>
            </div>

            {authMode === 'login' ? (
              <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="section">
            <h2 className="section__header">{t.profileAccount}</h2>
            <div className="group">
              <AccountSettings />
            </div>
          </section>

          <section className="section">
            <h2 className="section__header">{t.profileSecurity}</h2>
            <div className="group">
              <ChangePasswordForm />
            </div>
          </section>

          <button type="button" className="button button--danger" onClick={logout}>
            {t.authLogout}
          </button>
        </>
      )}

      <section className="section">
        <h2 className="section__header">{t.profileCategories}</h2>
        <div className="group group--padded">
          <CategorySettings />
        </div>
      </section>

      <section className="section">
        <h2 className="section__header">{t.profileSettings}</h2>
        <div className="group">
          <div className="profile-setting">
            <span className="profile-setting__label">{t.profileLanguage}</span>
            <div
              className="lang-switch segmented lang-switch--wide"
              role="group"
              aria-label={t.profileLanguage}
            >
              <button
                type="button"
                className={`lang-switch__btn${locale === 'ua' ? ' lang-switch__btn--active' : ''}`}
                onClick={() => setLocale('ua')}
              >
                UA
              </button>
              <button
                type="button"
                className={`lang-switch__btn${locale === 'en' ? ' lang-switch__btn--active' : ''}`}
                onClick={() => setLocale('en')}
              >
                EN
              </button>
            </div>
          </div>

          <div className="profile-setting">
            <span className="profile-setting__label">{t.profileTheme}</span>
            <div
              className="theme-switch segmented"
              role="group"
              aria-label={t.profileTheme}
            >
              <button
                type="button"
                className={`theme-switch__btn${theme === 'dark' ? ' theme-switch__btn--active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                {t.themeDark}
              </button>
              <button
                type="button"
                className={`theme-switch__btn${theme === 'light' ? ' theme-switch__btn--active' : ''}`}
                onClick={() => setTheme('light')}
              >
                {t.themeLight}
              </button>
              <button
                type="button"
                className={`theme-switch__btn${theme === 'system' ? ' theme-switch__btn--active' : ''}`}
                onClick={() => setTheme('system')}
              >
                {t.themeSystem}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section__header">{t.profileStats}</h2>
        <div className="group">
          <dl className="profile-stats">
            <div className="profile-stats__row">
              <dt>{t.profileTotalRecords}</dt>
              <dd>{stats.count}</dd>
            </div>
            <div className="profile-stats__row">
              <dt>{t.profileTotalSpent}</dt>
              <dd>{formatAmount(stats.total)}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
