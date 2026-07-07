import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

const STORAGE_KEY = 'budget-tracker-locale'

const LocaleContext = createContext(null)

const detectLocale = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'ua') {
    return stored
  }

  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('uk') ? 'ua' : 'en'
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(detectLocale)

  const setLocale = (nextLocale) => {
    setLocaleState(nextLocale)
    localStorage.setItem(STORAGE_KEY, nextLocale)
  }

  const t = translations[locale]

  useEffect(() => {
    document.documentElement.lang = locale === 'ua' ? 'uk' : 'en'
    document.title = t.appTitle
  }, [locale, t.appTitle])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      formatAmount: (amount) =>
        new Intl.NumberFormat(locale === 'ua' ? 'uk-UA' : 'en-US', {
          style: 'currency',
          currency: 'UAH',
          minimumFractionDigits: 2,
        }).format(amount),
      formatMonth: (year, month) =>
        new Intl.DateTimeFormat(locale === 'ua' ? 'uk-UA' : 'en-US', {
          month: 'long',
          year: 'numeric',
        }).format(new Date(year, month, 1)),
      formatDay: (dateStr) =>
        new Intl.DateTimeFormat(locale === 'ua' ? 'uk-UA' : 'en-US', {
          day: 'numeric',
          month: 'short',
        }).format(
          (() => {
            const [year, month, day] = dateStr.split('-').map(Number)
            return new Date(year, month - 1, day)
          })(),
        ),
      formatMonthShort: (year, month) =>
        new Intl.DateTimeFormat(locale === 'ua' ? 'uk-UA' : 'en-US', {
          month: 'short',
        }).format(new Date(year, month, 1)),
      formatMonthCompact: (year, month) => {
        const formatted = new Intl.DateTimeFormat(
          locale === 'ua' ? 'uk-UA' : 'en-US',
          { month: 'short', year: 'numeric' },
        ).format(new Date(year, month, 1))
        return locale === 'ua'
          ? formatted.replace(/\s*р\.?\s*$/, '')
          : formatted
      },
      categoryLabel: (value) => t.categories[value] ?? value,
    }),
    [locale, t],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return context
}
