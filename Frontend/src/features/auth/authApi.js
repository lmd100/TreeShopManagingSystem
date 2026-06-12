const BASE = '/api/auth'

export async function login(email, password) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (res.status === 401) {
    throw new Error('Invalid email or password')
  }

  if (!res.ok) {
    throw new Error('Login failed')
  }

  return res.json() // LoginResponse → stored as `user` in AuthContext
}

export async function register(fullName, email, password) {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password }),
  })

  if (res.status === 409) {
    throw new Error('Email already registered')
  }

  if (!res.ok) {
    throw new Error('Registration failed')
  }
  // 201 Created, no body — just returns
}

export async function logout() {
  const res = await fetch(`${BASE}/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Logout failed')
  }
}
