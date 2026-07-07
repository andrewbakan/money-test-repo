import { OTHER_CATEGORY_ID } from '../constants/categories'
import { isSameMonth, shiftMonth } from './date'

export function getMonthTotal(expenses, year, month) {
  return expenses
    .filter((item) => isSameMonth(item.date, year, month))
    .reduce((sum, item) => sum + item.amount, 0)
}

export function getMonthComparison(expenses, year, month) {
  const previousMonth = shiftMonth(year, month, -1)
  const currentTotal = getMonthTotal(expenses, year, month)
  const previousTotal = getMonthTotal(
    expenses,
    previousMonth.year,
    previousMonth.month,
  )

  return {
    currentTotal,
    previousTotal,
    diff: currentTotal - previousTotal,
    previousMonth,
  }
}

function resolveExpenseCategory(categoryId, knownCategoryIds) {
  if (knownCategoryIds.includes(categoryId)) {
    return categoryId
  }

  return OTHER_CATEGORY_ID
}

export function getCategoryBreakdown(expenses, year, month, categoryIds) {
  const filtered = expenses.filter((item) =>
    isSameMonth(item.date, year, month),
  )

  const totals = Object.fromEntries(categoryIds.map((category) => [category, 0]))

  for (const expense of filtered) {
    const category = resolveExpenseCategory(expense.category, categoryIds)
    totals[category] += expense.amount
  }

  const items = categoryIds
    .map((category) => ({
      category,
      amount: totals[category],
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const total = items.reduce((sum, item) => sum + item.amount, 0)

  return { total, items }
}

export function getCategoryExpenses(
  expenses,
  year,
  month,
  category,
  categoryIds,
) {
  return expenses
    .filter((item) => {
      if (!isSameMonth(item.date, year, month)) {
        return false
      }

      return resolveExpenseCategory(item.category, categoryIds) === category
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.amount - a.amount)
}

export function buildChartSegments(items, total) {
  if (total === 0) {
    return []
  }

  let current = 0

  return items.map((item) => {
    const percent = (item.amount / total) * 100
    const segment = {
      ...item,
      percent,
      start: current,
      end: current + percent,
    }
    current += percent
    return segment
  })
}
