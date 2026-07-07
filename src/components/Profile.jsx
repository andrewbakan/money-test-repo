import { useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../i18n/LocaleContext'
import { useTheme } from '../contexts/ThemeContext'
import AccountSettings from './AccountSettings'
import CategorySettings from './CategorySettings'
import ChangePasswordForm from './ChangePasswordForm'
import CollapsibleSection from './CollapsibleSection'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import {
  IconChart,
  IconLock,
  IconPerson,
  IconSettings,
  IconTags,
} from './icons/Icons'

export default function Profile({ expenses }) {
  const { locale, setLocale, t, formatAmount } = useLocale()
  const { theme, setTheme } = useTheme()
  const { isAuthenticated, logout, loginDemo } = useAuth()
  const [authMode, setAuthMode] = useState('login')
  const [demoLoading, setDemoLoading] = useState(false)

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, item) => sum + item.amount, 0)
    return { count: expenses.length, total }
  }, [expenses])

  const handleDemoLogin = async () => {
    setDemoLoading(true)
    try {
      await loginDemo()
    } catch {
      setDemoLoading(false)
    }
  }

  return (
    <div className="profile">
      {!isAuthenticated && (
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

            <div className="profile-demo">
              <button
                type="button"
                className="button button--secondary"
                onClick={handleDemoLogin}
                disabled={demoLoading}
              >
                {demoLoading ? t.authLoading : t.authTryDemo}
              </button>
              <p className="profile-demo__hint">{t.authTryDemoHint}</p>
            </div>
          </div>
        </section>
      )}

      <CollapsibleSection title={t.profileCategories} icon={IconTags}>
        <div className="group group--padded">
          <CategorySettings />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={t.profileSettings} icon={IconSettings}>
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
      </CollapsibleSection>

      <CollapsibleSection title={t.profileStats} icon={IconChart}>
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
      </CollapsibleSection>

      {isAuthenticated && (
        <>
          <CollapsibleSection
            title={t.profileAccount}
            icon={IconPerson}
            defaultExpanded={false}
          >
            <div className="group">
              <AccountSettings />
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title={t.profileSecurity}
            icon={IconLock}
            defaultExpanded={false}
          >
            <div className="group">
              <ChangePasswordForm />
            </div>
          </CollapsibleSection>

          <button type="button" className="button button--danger" onClick={logout}>
            {t.authLogout}
          </button>
        </>
      )}
    </div>
  )
}
