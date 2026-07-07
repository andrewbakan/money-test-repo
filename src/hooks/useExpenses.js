import { useEffect, useState } from 'react'
import { demoExpenses, isDemoId, USE_DEMO_DATA } from '../demo/demoExpenses'
import { toDateInputValue } from '../utils/date'

const STORAGE_KEY = 'budget-tracker-expenses'

function loadStoredExpenses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadExpenses() {
  const stored = loadStoredExpenses()
  const userExpenses = stored.filter((item) => !isDemoId(item.id))

  if (USE_DEMO_DATA) {
    return [...demoExpenses, ...userExpenses]
  }

  return userExpenses
}

export function useExpenses() {
  const [expenses, setExpenses] = useState(loadExpenses)

  useEffect(() => {
    const userOnly = expenses.filter((item) => !isDemoId(item.id))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userOnly))
  }, [expenses])

  const addExpense = ({ name, amount, category, date = toDateInputValue() }) => {
    setExpenses((prev) => [
      {
        id: crypto.randomUUID(),
        name,
        amount,
        category,
        date,
      },
      ...prev,
    ])
  }

  const updateExpense = (id, updates) => {
    if (isDemoId(id)) {
      return
    }

    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    )
  }

  const deleteExpense = (id) => {
    if (isDemoId(id)) {
      return
    }

    setExpenses((prev) => prev.filter((item) => item.id !== id))
  }

  const reassignCategory = (fromCategoryId, toCategoryId) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item.category === fromCategoryId && !isDemoId(item.id)
          ? { ...item, category: toCategoryId }
          : item,
      ),
    )
  }

  return { expenses, addExpense, updateExpense, deleteExpense, reassignCategory }
}
