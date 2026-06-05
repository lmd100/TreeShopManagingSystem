import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Container from './Container'

export default function Header() {
  const { user, isAuthenticated, canManage, logout } = useAuth()

  return (
    <header className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.9)] backdrop-blur">
      <Container className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <Link to="/" className="block text-base font-semibold text-[var(--text-h)]">
            Tree Shop Managing System
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <nav className="flex flex-wrap items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--social-bg)] p-1">
            <Link
              to="/"
              className="rounded-full px-3 py-2 text-[var(--text-h)] transition hover:bg-white"
            >
              Trang chủ
            </Link>
            <Link
              to="/catalog"
              className="rounded-full px-3 py-2 text-[var(--text-h)] transition hover:bg-white"
            >
              Sản phẩm
            </Link>
            <Link
              to={canManage ? '/manage' : '/login'}
              className="rounded-full px-3 py-2 text-[var(--text-h)] transition hover:bg-white"
            >
              Quản lý
            </Link>
          </nav>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--social-bg)] px-3 py-1.5">
              <span className="text-xs text-[var(--text)]">
                {user?.fullName || user?.email || 'Đã đăng nhập'}
              </span>
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
              to="/login"
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </Container>
    </header>
  )
}
