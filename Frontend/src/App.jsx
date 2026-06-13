import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/global/Footer'
import Header from './components/global/Header'
import TicketDashboard from './features/tickets/components/TicketDashboard'
import TicketDetail from './features/tickets/components/TicketDetail'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthState'
import CatalogPage from './pages/CatalogPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ManagementPage from './pages/ManagementPage'
import OrderManagement from './features/orders/OrderManagement'
import ProductDetailPage from './pages/ProductDetailPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import UserManagement from './pages/UserManagement'
import {
  getHomePathForRole,
  isAdminRole,
  normalizeRole,
} from './utils/roleNavigation'

function RequireAuth({ children, managerOnly = false }) {
  const { isAuthenticated, canManage, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-[#283C1D]" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (managerOnly && !canManage) {
    return <Navigate to="/catalog" replace />
  }

  return children
}

function ProtectedAdminRoute({ element }) {
  const { user, isLoading } = useAuth()
  const isAdmin = isAdminRole(user)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-[#283C1D]" />
          <p className="text-stone-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  return element
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={getHomePathForRole(normalizeRole(user))} replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/catalog/:productId" element={<ProductDetailPage />} />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />
      <Route
        path="/change-password"
        element={
          <RequireAuth>
            <ChangePasswordPage />
          </RequireAuth>
        }
      />
      <Route
        path="/manage"
        element={
          <RequireAuth managerOnly>
            <ManagementPage />
          </RequireAuth>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
      <Route path="/tickets" element={<TicketDashboard />} />
      <Route path="/tickets/:id" element={<TicketDetail />} />
      <Route
        path="/orders"
        element={
          <RequireAuth>
            <OrderManagement />
          </RequireAuth>
        }
      />
      <Route path="/orders/*" element={<Navigate to="/orders" replace />} />
      <Route
        path="/admin/users"
        element={<ProtectedAdminRoute element={<UserManagement />} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[var(--social-bg)]/50 text-[var(--text-h)]">
        <Header />
        <AppRoutes />
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
