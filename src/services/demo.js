import { toDateInputValue } from '../utils/date'
import { hashPassword } from '../utils/password'

const USERS_KEY = 'budget-tracker-users'
const SESSION_KEY = 'budget-tracker-session'
const EXPENSES_KEY = 'budget-tracker-expenses'

export const DEMO_USER_ID = '00000000-0000-4000-8000-000000000001'
export const DEMO_EMAIL = 'demo@budget.app'
export const DEMO_PASSWORD = 'demo123'
export const DEMO_NAME = 'Марія Коваль'

const EXPENSE_TEMPLATES = [
  { name: 'Silpo', category: 'food', min: 120, max: 980 },
  { name: 'ATB', category: 'food', min: 85, max: 640 },
  { name: 'Кавʼярня', category: 'food', min: 65, max: 180 },
  { name: 'Bolt', category: 'transport', min: 90, max: 320 },
  { name: 'Заправка', category: 'transport', min: 450, max: 1800 },
  { name: 'Метро', category: 'transport', min: 16, max: 32 },
  { name: 'Netflix', category: 'entertainment', min: 199, max: 299 },
  { name: 'Кінотеатр', category: 'entertainment', min: 180, max: 420 },
  { name: 'Spotify', category: 'entertainment', min: 99, max: 149 },
  { name: 'Zara', category: 'shopping', min: 350, max: 2400 },
  { name: 'Rozetka', category: 'shopping', min: 199, max: 3200 },
  { name: 'Косметика', category: 'shopping', min: 120, max: 890 },
  { name: 'Аптека', category: 'other', min: 80, max: 520 },
  { name: 'Комунальні', category: 'other', min: 900, max: 2800 },
  { name: 'Підписка iCloud', category: 'other', min: 49, max: 99 },
]

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function saveSession(userId) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }))
}

function randomInt(min, max) {
  return Math.round(min + Math.random() * (max - min))
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)]
}

export function generateDemoExpenses(referenceDate = new Date()) {
  const expenses = []
  const today = toDateInputValue(referenceDate)

  for (let dayOffset = 0; dayOffset < 92; dayOffset += 1) {
    const date = new Date(referenceDate)
    date.setDate(date.getDate() - dayOffset)
    const dateValue = toDateInputValue(date)
    const entriesToday = dayOffset === 0 ? 3 : dayOffset < 7 ? randomInt(1, 3) : Math.random() > 0.45 ? 1 : 0

    for (let index = 0; index < entriesToday; index += 1) {
      const template = pickRandom(EXPENSE_TEMPLATES)
      expenses.push({
        id: crypto.randomUUID(),
        name: template.name,
        amount: randomInt(template.min, template.max),
        category: template.category,
        date: dateValue,
      })
    }
  }

  expenses.push(
    {
      id: crypto.randomUUID(),
      name: 'Обід у ресторані',
      amount: 485,
      category: 'food',
      date: today,
    },
    {
      id: crypto.randomUUID(),
      name: 'Таксі дод дому',
      amount: 156,
      category: 'transport',
      date: today,
    },
  )

  return expenses.sort((a, b) => b.date.localeCompare(a.date) || b.amount - a.amount)
}

export async function seedDemoAccount() {
  const users = loadUsers()
  const passwordHash = await hashPassword(DEMO_PASSWORD)
  const existingIndex = users.findIndex((user) => user.email === DEMO_EMAIL)

  const demoUser = {
    id: DEMO_USER_ID,
    name: DEMO_NAME,
    email: DEMO_EMAIL,
    passwordHash,
  }

  if (existingIndex === -1) {
    saveUsers([...users, demoUser])
  } else {
    const nextUsers = [...users]
    nextUsers[existingIndex] = { ...nextUsers[existingIndex], ...demoUser }
    saveUsers(nextUsers)
  }

  saveSession(DEMO_USER_ID)
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(generateDemoExpenses()))

  return {
    id: DEMO_USER_ID,
    name: DEMO_NAME,
    email: DEMO_EMAIL,
  }
}

export function shouldBootstrapDemo() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) {
      return false
    }
  } catch {
    return false
  }

  return new URLSearchParams(window.location.search).has('demo')
}
