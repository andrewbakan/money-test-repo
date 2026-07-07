export function filterExpensesByQuery(expenses, query) {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return []
  }

  return expenses
    .filter((item) => item.name.toLowerCase().includes(normalized))
    .sort((a, b) => b.date.localeCompare(a.date) || b.amount - a.amount)
}
