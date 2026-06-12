import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  login as loginRequest,
  register as registerRequest,
} from '../features/auth/authApi'
import { loginApi, logoutApi, registerApi } from '../data/authApi'

const STORAGE_KEY = 'treeshop-auth-user'

export const AuthContext = createContext(null)

function readStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storedValue =
      window.localStorage.getItem(STORAGE_KEY) ||
      window.localStorage.getItem('currentUser')
    return storedValue ? JSON.parse(storedValue) : null
  } catch {
    return null
  }
}

function persistUser(user) {
  if (typeof window === 'undefined') {
    return
  }

  if (user) {
    const serialized = JSON.stringify(user)
    window.localStorage.setItem(STORAGE_KEY, serialized)
    window.localStorage.setItem('currentUser', serialized)
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem('currentUser')
  }
}

function normalizeUser(raw) {
  if (!raw) {
    return null
  }

  const role = raw.role ?? raw.roleName ?? null

  return {
    ...raw,
    role,
    roleName: raw.roleName ?? role,
  }
}

function canManageRole(user) {
  const role = user?.role ?? user?.roleName
  return role === 'MANAGER' || role === 'SYSTEM_ADMIN'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => normalizeUser(readStoredUser()))
  const [isLoading, setIsLoading] = useState(() => !readStoredUser())
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function fetchCurrentUser() {
      try {
        const response = await fetch('/api/users/me', {
          method: 'GET',
          credentials: 'include',
        })

        if (cancelled) {
          return
        }

        if (response.ok) {
          const userData = normalizeUser(await response.json())
          setUser(userData)
          persistUser(userData)
        } else {
          setUser(null)
          persistUser(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setUser(null)
          persistUser(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchCurrentUser()

    return () => {
      cancelled = true
    }
  }, [])

  async function login(email, password) {
    setIsLoading(true)
    setError(null)

    try {
      const loggedInUser = normalizeUser(await loginRequest(email, password))
      setUser(loggedInUser)
      persistUser(loggedInUser)
      return loggedInUser
    } catch (err) {
      setError(err.message || String(err))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function register(fullName, email, password) {
    setError(null)
    await registerRequest(fullName, email, password)
  }

  async function executeAuth(authOption = 'login', formData) {
    setIsLoading(true)
    setError(null)

    try {
      let userData
      if (authOption === 'login') {
        userData = normalizeUser(await loginApi(formData))
      } else if (authOption === 'register') {
        userData = normalizeUser(await registerApi(formData))
      } else {
        throw new Error(`Unsupported auth option: ${authOption}`)
      }

      setUser(userData)
      persistUser(userData)
      return userData
    } catch (err) {
      setError(err.message || String(err))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    try {
      await logoutApi()
    } finally {
      setUser(null)
      persistUser(null)
    }
  }

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      executeAuth,
      isLoading,
      error,
      isAuthenticated: Boolean(user),
      canManage: canManageRole(user),
      isAdmin: (user?.roleName ?? user?.role) === 'SYSTEM_ADMIN',
    }),
    [user, isLoading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
