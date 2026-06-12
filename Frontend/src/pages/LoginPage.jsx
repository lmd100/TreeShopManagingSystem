import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { resolvePostLoginPath } from '../utils/roleNavigation'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [values, setValues] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fromPath = location.state?.from?.pathname

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const loggedInUser = await login(values.email, values.password)
      navigate(resolvePostLoginPath(loggedInUser.role, fromPath), { replace: true })
    } catch (loginError) {
      setError(loginError.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="min-h-[calc(100vh-4rem)] flex">
        {/* Left panel */}
        <div className="w-[40%] bg-[#7a9ab0] flex flex-col items-center justify-center p-12 text-white">
          <h2 className="text-xl font-bold tracking-widest uppercase mb-4">Register</h2>
          <p className="mb-8 text-center text-sm text-white/90">
            Don't have an account? Register one!
          </p>
          <button
              onClick={() => navigate('/register')}
              className="border border-white text-white px-6 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-[#7a9ab0] transition-colors duration-200"
          >
            Register an account
          </button>
        </div>

        {/* Right panel */}
        <div className="w-[60%] bg-white flex flex-col items-center justify-center px-16 py-12">
          <div className="w-full max-w-md">
            <h1
                className="text-2xl font-bold tracking-wider uppercase mb-8"
                style={{ color: '#2c3e2d', fontFamily: 'Georgia, serif' }}
            >
              Login
            </h1>

            {error && (
                <div className="text-red-600 text-sm mb-6 p-3 bg-red-50 border border-red-200">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm text-gray-700 mb-1.5">
                  Username or email address *
                </label>
                <input
                    type="email"
                    name="email"
                    required
                    value={values.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-500 transition-colors"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm text-gray-700 mb-1.5">
                  Password *
                </label>
                <input
                    type="password"
                    name="password"
                    required
                    value={values.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-500 transition-colors"
                />
              </div>

              <div className="flex items-center mb-6">
                <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 border border-gray-400 mr-2.5 cursor-pointer accent-[#2c5f2e]"
                />
                <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 text-xs font-bold tracking-widest uppercase text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#2c5f2e' }}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <p className="mt-6 text-sm text-gray-500 cursor-pointer hover:underline w-fit">
              Lost your password?
            </p>
          </div>
        </div>
      </div>
  )
}