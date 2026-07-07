import { useEffect, useState } from 'react'
import AddExpense from './components/AddExpense'
import Analytics from './components/Analytics'
import Profile from './components/Profile'
import TabBar from './components/TabBar'
import GradientDefs from './components/GradientDefs'
import { CategoriesProvider } from './contexts/CategoriesContext'
import { useAuth } from './contexts/AuthContext'
import { IconPerson } from './components/icons/Icons'
import { useExpenses } from './hooks/useExpenses'
import { useLocale } from './i18n/LocaleContext'

function AppContent({
  expenses,
  addExpense,
  updateExpense,
  deleteExpense,
}) {
  const { t } = useLocale()
  const { user, isAuthenticated, initials } = useAuth()
  const [activeTab, setActiveTab] = useState('add')
  const [headerElevated, setHeaderElevated] = useState(false)

  useEffect(() => {
    const onScroll = () => setHeaderElevated(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
    setHeaderElevated(false)
  }, [activeTab])

  const screenTitles = {
    add: t.tabAdd,
    analytics: t.tabAnalytics,
    profile: t.tabProfile,
  }

  const subtitle =
    activeTab === 'profile' && isAuthenticated
      ? user.email
      : activeTab === 'add' && isAuthenticated && user?.name
        ? t.profileGreeting.replace('{name}', user.name)
        : null

  return (
    <div className="app">
      <header className={`header${headerElevated ? ' header--elevated' : ''}`}>
        <div className="nav-bar">
          <div className="nav-bar__titles">
            <h1 className="header__large-title">{screenTitles[activeTab]}</h1>
            {subtitle && <p className="header__subtitle">{subtitle}</p>}
          </div>
          {activeTab !== 'profile' && (
            <button
              type="button"
              className={`header__avatar${isAuthenticated ? ' header__avatar--filled' : ''}`}
              onClick={() => setActiveTab('profile')}
              aria-label={t.tabProfile}
            >
              <span className="header__avatar-inner">
                {isAuthenticated ? (
                  initials
                ) : (
                  <IconPerson className="header__avatar-icon" gradient />
                )}
              </span>
            </button>
          )}
        </div>
      </header>

      <main className="main">
        {activeTab === 'add' && (
          <AddExpense
            onAdd={addExpense}
            onUpdate={updateExpense}
            onDelete={deleteExpense}
            expenses={expenses}
          />
        )}
        {activeTab === 'analytics' && (
          <Analytics
            expenses={expenses}
            onUpdate={updateExpense}
            onDelete={deleteExpense}
          />
        )}
        {activeTab === 'profile' && <Profile expenses={expenses} />}
      </main>

      <TabBar
        activeTab={activeTab}
        onChange={setActiveTab}
        labels={{
          add: t.tabAdd,
          analytics: t.tabAnalytics,
        }}
      />
    </div>
  )
}

function App() {
  const expenseApi = useExpenses()

  return (
    <CategoriesProvider reassignExpenses={expenseApi.reassignCategory}>
      <GradientDefs />
      <AppContent {...expenseApi} />
    </CategoriesProvider>
  )
}

export default App
