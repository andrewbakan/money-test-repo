import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  changeUserPassword,
  getInitials,
  getSessionUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from '../services/auth'
import { seedDemoAccount } from '../services/demo'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSessionUser)

  const register = useCallback(async (payload) => {
    const nextUser = await registerUser(payload)
    setUser(nextUser)
    return nextUser
  }, [])

  const login = useCallback(async (payload) => {
    const nextUser = await loginUser(payload)
    setUser(nextUser)
    return nextUser
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
  }, [])

  const loginDemo = useCallback(async () => {
    await seedDemoAccount()
    window.location.reload()
  }, [])

  const changePassword = useCallback(
    async (payload) => {
      if (!user) {
        throw new Error('NOT_AUTHENTICATED')
      }
      await changeUserPassword({ userId: user.id, ...payload })
    },
    [user],
  )

  const updateProfile = useCallback(
    async (payload) => {
      if (!user) {
        throw new Error('NOT_AUTHENTICATED')
      }
      const nextUser = await updateUserProfile({ userId: user.id, ...payload })
      setUser(nextUser)
      return nextUser
    },
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      initials: getInitials(user?.name ?? ''),
      register,
      login,
      loginDemo,
      logout,
      changePassword,
      updateProfile,
    }),
    [user, register, login, loginDemo, logout, changePassword, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
