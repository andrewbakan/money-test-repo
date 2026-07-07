import { hashPassword } from '../utils/password'

const USERS_KEY = 'budget-tracker-users'
const SESSION_KEY = 'budget-tracker-session'

// Local storage auth — replace with API calls when backend is ready.

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

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

export function getSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) {
      return null
    }

    const { userId } = JSON.parse(raw)
    const user = loadUsers().find((item) => item.id === userId)
    return user ? toPublicUser(user) : null
  } catch {
    return null
  }
}

export async function registerUser({ name, email, password }) {
  const trimmedName = name.trim()
  const normalizedEmail = email.trim().toLowerCase()

  if (!trimmedName || !normalizedEmail || !password) {
    throw new Error('VALIDATION')
  }

  if (password.length < 6) {
    throw new Error('PASSWORD_TOO_SHORT')
  }

  const users = loadUsers()
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('EMAIL_TAKEN')
  }

  const newUser = {
    id: crypto.randomUUID(),
    name: trimmedName,
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
  }

  saveUsers([...users, newUser])
  saveSession(newUser.id)

  return toPublicUser(newUser)
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = loadUsers().find((item) => item.email === normalizedEmail)

  if (!user) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const passwordHash = await hashPassword(password)
  if (user.passwordHash !== passwordHash) {
    throw new Error('INVALID_CREDENTIALS')
  }

  saveSession(user.id)
  return toPublicUser(user)
}

export function logoutUser() {
  clearSession()
}

export async function changeUserPassword({
  userId,
  currentPassword,
  newPassword,
}) {
  if (newPassword.length < 6) {
    throw new Error('PASSWORD_TOO_SHORT')
  }

  const users = loadUsers()
  const index = users.findIndex((user) => user.id === userId)

  if (index === -1) {
    throw new Error('NOT_FOUND')
  }

  const currentHash = await hashPassword(currentPassword)
  if (users[index].passwordHash !== currentHash) {
    throw new Error('WRONG_PASSWORD')
  }

  users[index] = {
    ...users[index],
    passwordHash: await hashPassword(newPassword),
  }

  saveUsers(users)
}

export async function updateUserProfile({ userId, name }) {
  const trimmedName = name.trim()

  if (!trimmedName) {
    throw new Error('VALIDATION')
  }

  const users = loadUsers()
  const index = users.findIndex((user) => user.id === userId)

  if (index === -1) {
    throw new Error('NOT_FOUND')
  }

  users[index] = { ...users[index], name: trimmedName }
  saveUsers(users)

  return toPublicUser(users[index])
}

export function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return '?'
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}
