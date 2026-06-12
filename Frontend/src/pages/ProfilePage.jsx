import { Link } from 'react-router-dom'
import Container from '../components/global/Container'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { useProfile } from '../features/auth/useProfile'

export default function ProfilePage() {
  const {
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
  } = useProfile()

  if (loading) {
    return <div className="p-6 text-center text-[var(--text)]">Loading...</div>
  }

  if (!profile) {
    return <div className="p-6 text-center text-red-600">{error || 'Unable to load profile'}</div>
  }

  return (
    <main>
      <Container className="py-10">
        <Card className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Profile</h1>
              {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
            </div>
            <div className="flex gap-2">
              <Link to="/change-password">
                <Button variant="secondary">Change password</Button>
              </Link>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              ) : (
                <>
                  <Button variant="secondary" onClick={handleCancel} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button onClick={() => void handleSave()} disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save'}
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Input label="Email" value={profile.email} disabled />
            <Input
              label="Full name"
              value={formData.fullName}
              onChange={(event) => handleInputChange(event, 'fullName')}
              disabled={!isEditing || submitting}
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(event) => handleInputChange(event, 'phone')}
              disabled={!isEditing || submitting}
            />
            <Input label="Status" value={profile.status ? 'Active' : 'Banned'} disabled />
          </div>
        </Card>
      </Container>
    </main>
  )
}
