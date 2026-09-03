import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../layouts/DashboardLayout'
import Spinner from '../../components/common/Spinner'
import api from '../../services/api'
import { setCredentials } from '../../redux/slices/authSlice'

const ProfilePage = () => {
  const { user }  = useSelector(state => state.auth)
  const dispatch  = useDispatch()

  const [form,     setForm]    = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [pwForm,   setPwForm]  = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving,   setSaving]  = useState(false)
  const [savingPw, setSavingPw]= useState(false)
  const [msg,      setMsg]     = useState({ profile: '', password: '' })
  const [err,      setErr]     = useState({ profile: '', password: '' })

  const handleProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg(p => ({ ...p, profile: '' }))
    setErr(p => ({ ...p, profile: '' }))
    try {
      const { data } = await api.patch('/users/me', { name: form.name, phone: form.phone })
      dispatch(setCredentials({ user: data.user }))
      setMsg(p => ({ ...p, profile: 'Profile updated successfully!' }))
    } catch (e) {
      setErr(p => ({ ...p, profile: e.response?.data?.message || 'Update failed.' }))
    } finally { setSaving(false) }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setErr(p => ({ ...p, password: 'Passwords do not match.' }))
      return
    }
    setSavingPw(true)
    setMsg(p => ({ ...p, password: '' }))
    setErr(p => ({ ...p, password: '' }))
    try {
      await api.patch('/users/me/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      setMsg(p => ({ ...p, password: 'Password changed successfully!' }))
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (e) {
      setErr(p => ({ ...p, password: e.response?.data?.message || 'Failed to change password.' }))
    } finally { setSavingPw(false) }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

        {/* Profile Info */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Personal Information</h2>
          <form onSubmit={handleProfile} className="space-y-4 max-w-md">
            {msg.profile && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">{msg.profile}</div>}
            {err.profile && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{err.profile}</div>}
            <div>
              <label className="form-label">Full name</label>
              <input className="input-field" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="form-label">Email address</label>
              <input className="input-field bg-gray-50" value={user?.email} disabled />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>
            <div>
              <label className="form-label">Phone number</label>
              <input className="input-field" value={form.phone} placeholder="+91 98765 43210"
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <><Spinner size="sm" /> Saving...</> : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handlePassword} className="space-y-4 max-w-md">
            {msg.password && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">{msg.password}</div>}
            {err.password && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{err.password}</div>}
            {['currentPassword','newPassword','confirmPassword'].map(field => (
              <div key={field}>
                <label className="form-label">
                  {field === 'currentPassword' ? 'Current password' : field === 'newPassword' ? 'New password' : 'Confirm new password'}
                </label>
                <input type="password" className="input-field" value={pwForm[field]} required
                  onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))} />
              </div>
            ))}
            <button type="submit" disabled={savingPw} className="btn-primary flex items-center gap-2">
              {savingPw ? <><Spinner size="sm" /> Updating...</> : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ProfilePage
