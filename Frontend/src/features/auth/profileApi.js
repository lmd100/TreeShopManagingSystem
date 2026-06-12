import { requestJson } from '../../utils/api'

export function getProfile() {
  return requestJson('/api/profile')
}

export function updateProfile({ fullName, phone }) {
  return requestJson('/api/profile', {
    method: 'PUT',
    body: { fullName, phone },
  })
}

export function changePassword(oldPassword, newPassword) {
  return requestJson('/api/profile/change-password', {
    method: 'POST',
    body: { oldPassword, newPassword },
  })
}
