export function toDateInputValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function isSameMonth(dateStr, year, month) {
  const date = parseLocalDate(dateStr)
  return date.getFullYear() === year && date.getMonth() === month
}

export function isSameDay(dateStr, reference = new Date()) {
  return dateStr === toDateInputValue(reference)
}

export function shiftMonth(year, month, delta) {
  const date = new Date(year, month + delta, 1)
  return { year: date.getFullYear(), month: date.getMonth() }
}
