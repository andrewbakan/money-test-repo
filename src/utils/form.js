export const MIN_PASSWORD_LENGTH = 6

export function parseAmount(value) {
  if (value === '' || value == null) {
    return NaN
  }

  return parseFloat(String(value).replace(',', '.'))
}

export function isValidAmount(value) {
  const amount = parseAmount(value)
  return !Number.isNaN(amount) && amount > 0
}

export function isNonEmpty(value) {
  return String(value ?? '').trim().length > 0
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim())
}

export function isValidPassword(value) {
  return String(value ?? '').length >= MIN_PASSWORD_LENGTH
}

export function passwordsMatch(password, confirmPassword) {
  return password.length > 0 && password === confirmPassword
}
