import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getNavLinksForRole, normalizeRole } from '../../utils/roleNavigation'
import Container from './Container'

function NavItem({ to, label }) {
  const location = useLocation()
  const isActive =
    location.pathname === to ||
    (to !== '/' && location.pathname.startsWith(`${to}/`))

  return (
    <Link
      to={to}
      className={`rounded-full px-3 py-2 transition hover:bg-white ${
        isActive
          ? 'bg-white font-medium text-[var(--accent)]'
          : 'text-[var(--text-h)]'
      }`}
    >
      {label}
    </Link>
  )
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const role = normalizeRole(user)
  const navLinks = isAuthenticated ? getNavLinksForRole(role) : getNavLinksForRole(null)

  const guestLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/catalog', label: 'Sản phẩm' },
  ]

  return (
    <header className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.9)] backdrop-blur">
      <Container className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <Link to="/" className="block text-base font-semibold text-[var(--text-h)]">
            Tree Shop Managing System
          </Link>
          {isAuthenticated && role ? (
            <p className="text-xs text-[var(--text)]">Vai trò: {role.replace(/_/g, ' ')}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <nav className="flex flex-wrap items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--social-bg)] p-1">
            {(isAuthenticated ? navLinks : guestLinks).map((item) => (
              <NavItem key={item.to} to={item.to} label={item.label} />
            ))}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="rounded-full px-3 py-2 text-[var(--text-h)] transition hover:bg-white"
              >
                Đăng nhập
              </Link>
            ) : null}
          </nav>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--social-bg)] px-3 py-1.5">
              <Link to="/profile" className="text-xs text-[var(--text)] hover:underline">
                {user?.fullName || user?.email || 'Hồ sơ'}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--text-h)] transition hover:bg-[var(--border)]"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              to="/register"
              className="rounded-full border border-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--accent-bg)]"
            >
              Đăng ký
            </Link>
          )}
        </div>
      </Container>
    </header>
  )
}

export { Header }
