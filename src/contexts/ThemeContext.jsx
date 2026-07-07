import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'budget-tracker-theme'

const ThemeContext = createContext(null)

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const resolveTheme = (theme) =>
  theme === 'system' ? getSystemTheme() : theme

const loadTheme = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light' || stored === 'system') {
    return stored
  }
  return 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(loadTheme)
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    resolveTheme(loadTheme()),
  )

  const setTheme = (nextTheme) => {
    setThemeState(nextTheme)
    localStorage.setItem(STORAGE_KEY, nextTheme)
  }

  useEffect(() => {
    const nextResolved = resolveTheme(theme)
    setResolvedTheme(nextResolved)
    document.documentElement.dataset.theme = nextResolved
    document.documentElement.style.colorScheme = nextResolved
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') {
      return undefined
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const nextResolved = resolveTheme('system')
      setResolvedTheme(nextResolved)
      document.documentElement.dataset.theme = nextResolved
      document.documentElement.style.colorScheme = nextResolved
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
