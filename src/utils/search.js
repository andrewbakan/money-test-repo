import { isSameMonth } from './date'

export function filterExpensesByQuery(expenses, query, { year, month } = {}) {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return []
  }

  return expenses
    .filter((item) => {
      if (year !== undefined && month !== undefined && !isSameMonth(item.date, year, month)) {
        return false
      }

      return item.name.toLowerCase().includes(normalized)
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.amount - a.amount)
}
