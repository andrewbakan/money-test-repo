import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  isSystemCategory,
  OTHER_CATEGORY_ID,
  pickCustomCategoryColor,
  SYSTEM_CATEGORY_COLORS,
  SYSTEM_CATEGORY_IDS,
} from '../constants/categories'
import { useLocale } from '../i18n/LocaleContext'

const STORAGE_KEY = 'budget-tracker-custom-categories'

const CategoriesContext = createContext(null)

function loadCustomCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CategoriesProvider({ children, reassignExpenses }) {
  const { t } = useLocale()
  const [customCategories, setCustomCategories] = useState(loadCustomCategories)

  const persistCustom = useCallback((next) => {
    setCustomCategories(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const categoryIds = useMemo(
    () => [...SYSTEM_CATEGORY_IDS, ...customCategories.map((item) => item.id)],
    [customCategories],
  )

  const categories = useMemo(
    () => [
      ...SYSTEM_CATEGORY_IDS.map((id) => ({
        id,
        color: SYSTEM_CATEGORY_COLORS[id],
        isSystem: true,
      })),
      ...customCategories.map((item) => ({
        id: item.id,
        color: item.color,
        isSystem: false,
      })),
    ],
    [customCategories],
  )

  const categoryLabel = useCallback(
    (id) => {
      if (isSystemCategory(id)) {
        return t.categories[id] ?? id
      }

      const custom = customCategories.find((item) => item.id === id)
      return custom?.name ?? t.categories[OTHER_CATEGORY_ID]
    },
    [customCategories, t.categories],
  )

  const categoryColor = useCallback(
    (id) => {
      if (isSystemCategory(id)) {
        return SYSTEM_CATEGORY_COLORS[id] ?? SYSTEM_CATEGORY_COLORS[OTHER_CATEGORY_ID]
      }

      const custom = customCategories.find((item) => item.id === id)
      return custom?.color ?? SYSTEM_CATEGORY_COLORS[OTHER_CATEGORY_ID]
    },
    [customCategories],
  )

  const resolveCategoryId = useCallback(
    (id) => {
      if (!id) {
        return OTHER_CATEGORY_ID
      }

      if (isSystemCategory(id)) {
        return id
      }

      return customCategories.some((item) => item.id === id)
        ? id
        : OTHER_CATEGORY_ID
    },
    [customCategories],
  )

  const addCategory = useCallback(
    (name) => {
      const trimmed = name.trim()
      if (!trimmed) {
        return { ok: false, error: 'empty' }
      }

      const normalized = trimmed.toLowerCase()
      const duplicate = categories.some(
        (item) => categoryLabel(item.id).toLowerCase() === normalized,
      )

      if (duplicate) {
        return { ok: false, error: 'duplicate' }
      }

      const usedColors = customCategories.map((item) => item.color)
      const newCategory = {
        id: `custom-${crypto.randomUUID()}`,
        name: trimmed,
        color: pickCustomCategoryColor(usedColors),
      }

      persistCustom([...customCategories, newCategory])
      return { ok: true, id: newCategory.id }
    },
    [categories, categoryLabel, customCategories, persistCustom],
  )

  const deleteCategory = useCallback(
    (id) => {
      if (isSystemCategory(id)) {
        return { ok: false, error: 'system' }
      }

      reassignExpenses?.(id, OTHER_CATEGORY_ID)
      persistCustom(customCategories.filter((item) => item.id !== id))
      return { ok: true }
    },
    [customCategories, persistCustom, reassignExpenses],
  )

  const value = useMemo(
    () => ({
      categories,
      categoryIds,
      categoryLabel,
      categoryColor,
      resolveCategoryId,
      addCategory,
      deleteCategory,
      isSystemCategory,
    }),
    [
      categories,
      categoryIds,
      categoryLabel,
      categoryColor,
      resolveCategoryId,
      addCategory,
      deleteCategory,
    ],
  )

  return (
    <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error('useCategories must be used within CategoriesProvider')
  }
  return context
}
