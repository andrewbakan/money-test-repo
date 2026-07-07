import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { LocaleProvider } from './i18n/LocaleContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { seedDemoAccount, shouldBootstrapDemo } from './services/demo.js'

async function bootstrap() {
  if (shouldBootstrapDemo()) {
    await seedDemoAccount()
    const url = new URL(window.location.href)
    url.searchParams.delete('demo')
    window.history.replaceState({}, '', url)
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ThemeProvider>
        <LocaleProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </StrictMode>,
  )
}

bootstrap()
