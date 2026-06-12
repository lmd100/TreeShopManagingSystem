import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../components/global/Container'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { changePassword } from '../features/auth/profileApi'

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (values.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    if (values.newPassword !== values.confirmPassword) {
      setError('Password confirmation does not match')
      return
    }

    setSubmitting(true)
    try {
      await changePassword(values.oldPassword, values.newPassword)
      navigate('/profile', { replace: true })
    } catch (changeError) {
      setError(changeError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <Container className="py-10">
        <Card className="mx-auto max-w-lg space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Change password</h1>
            <p className="mt-1 text-sm text-[var(--text)]">
              Enter your current password before choosing a new one.
            </p>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Current password"
              name="oldPassword"
              type="password"
              value={values.oldPassword}
              onChange={handleChange}
              required
            />
            <Input
              label="New password"
              name="newPassword"
              type="password"
              value={values.newPassword}
              onChange={handleChange}
              required
            />
            <Input
              label="Confirm new password"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              required
            />
            <div className="flex gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save password'}
              </Button>
              <Link to="/profile">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
            </div>
          </form>
        </Card>
      </Container>
    </main>
  )
}
