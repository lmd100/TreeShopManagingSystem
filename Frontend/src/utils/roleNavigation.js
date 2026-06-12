export const ROLES = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  MANAGER: 'MANAGER',
  SUPPORT_AGENT: 'SUPPORT_AGENT',
  SHIPPER: 'SHIPPER',
  CUSTOMER: 'CUSTOMER',
}

export function normalizeRole(userOrRole) {
  const raw =
    typeof userOrRole === 'string'
      ? userOrRole
      : userOrRole?.role ?? userOrRole?.roleName

  if (!raw) {
    return null
  }

  return String(raw).trim().toUpperCase().replace(/\s+/g, '_')
}

/** Default landing page after login, per API role */
export function getHomePathForRole(userOrRole) {
  switch (normalizeRole(userOrRole)) {
    case ROLES.SYSTEM_ADMIN:
      return '/admin/users'
    case ROLES.MANAGER:
      return '/manage'
    case ROLES.SUPPORT_AGENT:
      return '/tickets'
    case ROLES.SHIPPER:
      return '/orders'
    case ROLES.CUSTOMER:
    default:
      return '/catalog'
  }
}

/** Header / home quick links visible for each role */
export function getNavLinksForRole(userOrRole) {
  const role = normalizeRole(userOrRole)

  const common = [
    { to: '/', label: 'Trang chủ' },
    { to: '/catalog', label: 'Sản phẩm' },
  ]

  const roleLinks = {
    [ROLES.SYSTEM_ADMIN]: [
      { to: '/admin/users', label: 'Quản lý người dùng' },
      { to: '/manage', label: 'Quản lý sản phẩm' },
      { to: '/orders', label: 'Đơn hàng' },
      { to: '/tickets', label: 'Tickets' },
    ],
    [ROLES.MANAGER]: [
      { to: '/manage', label: 'Quản lý sản phẩm' },
      { to: '/orders', label: 'Đơn hàng' },
    ],
    [ROLES.SUPPORT_AGENT]: [{ to: '/tickets', label: 'Tickets' }],
    [ROLES.SHIPPER]: [{ to: '/orders', label: 'Đơn hàng' }],
    [ROLES.CUSTOMER]: [{ to: '/orders', label: 'Đơn hàng của tôi' }],
  }

  return [...common, ...(roleLinks[role] ?? roleLinks[ROLES.CUSTOMER])]
}

export function resolvePostLoginPath(userOrRole, fromPath) {
  const home = getHomePathForRole(userOrRole)

  if (!fromPath || fromPath === '/login' || fromPath === '/register') {
    return home
  }

  if (typeof fromPath === 'string' && fromPath.startsWith('/')) {
    return fromPath
  }

  return home
}

export function isAdminRole(userOrRole) {
  return normalizeRole(userOrRole) === ROLES.SYSTEM_ADMIN
}

export function canManageCatalog(userOrRole) {
  const role = normalizeRole(userOrRole)
  return role === ROLES.MANAGER || role === ROLES.SYSTEM_ADMIN
}
