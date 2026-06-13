import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthState'
import { getProfile, updateProfile } from './profileApi'

export function useProfile() {
  const { updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getProfile()
      setProfile(data)
      setFormData({ fullName: data.fullName ?? '', phone: data.phone ?? '' })
    } catch (loadError) {
      setProfile(null)
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Profile loading is an intentional mount-time synchronization with the API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProfile()
  }, [loadProfile])

  function handleInputChange(event, field) {
    setFormData((current) => ({ ...current, [field]: event.target.value }))
  }

  function handleCancel() {
    setIsEditing(false)
    setFormData({
      fullName: profile?.fullName ?? '',
      phone: profile?.phone ?? '',
    })
  }

  async function handleSave() {
    if (!formData.fullName.trim()) {
      setError('Full name is required')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const updated = await updateProfile(formData)
      setProfile(updated)
      setFormData({ fullName: updated.fullName ?? '', phone: updated.phone ?? '' })
      updateUser({ fullName: updated.fullName, phone: updated.phone })
      setIsEditing(false)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    profile,
    loading,
    isEditing,
    formData,
    submitting,
    error,
    setIsEditing,
    handleInputChange,
    handleCancel,
    handleSave,
  }
}
