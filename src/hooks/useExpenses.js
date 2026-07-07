import { useEffect, useState } from 'react'
import { toDateInputValue } from '../utils/date'

const STORAGE_KEY = 'budget-tracker-expenses'

function loadExpenses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useExpenses() {
  const [expenses, setExpenses] = useState(loadExpenses)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
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
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    )
  }

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id))
  }

  const reassignCategory = (fromCategoryId, toCategoryId) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item.category === fromCategoryId
          ? { ...item, category: toCategoryId }
          : item,
      ),
    )
  }

  return { expenses, addExpense, updateExpense, deleteExpense, reassignCategory }
}
