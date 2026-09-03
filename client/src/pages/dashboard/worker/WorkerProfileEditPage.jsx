import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import Spinner from '../../../components/common/Spinner'
import { fetchMyWorkerProfile, updateMyWorkerProfile } from '../../../services/workerService'

const WorkerProfileEditPage = () => {
  const [form,    setForm]    = useState({ bio: '', experience: '', skills: '', serviceAreas: '' })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState('')
  const [err,     setErr]     = useState('')

  useEffect(() => {
    fetchMyWorkerProfile()
      .then(d => {
        const w = d.worker
        setForm({
          bio:          w.bio || '',
          experience:   w.experience || '',
          skills:       (w.skills || []).join(', '),
          serviceAreas: (w.serviceAreas || []).join(', '),
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true); setMsg(''); setErr('')
    try {
      await updateMyWorkerProfile({
        bio:          form.bio,
        experience:   Number(form.experience),
        skills:       form.skills.split(',').map(s => s.trim()).filter(Boolean),
        serviceAreas: form.serviceAreas.split(',').map(s => s.trim()).filter(Boolean),
      })
      setMsg('Profile updated successfully!')
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to update profile.')
    } finally { setSaving(false) }
  }

  if (loading) return <DashboardLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Worker Profile</h1>
        <div className="card max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {msg && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">{msg}</div>}
            {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{err}</div>}

            <div>
              <label className="form-label">Bio</label>
              <textarea rows={4} className="input-field resize-none" placeholder="Tell customers about your experience, certifications, and what makes you great at your work..."
                value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
            </div>

            <div>
              <label className="form-label">Years of Experience</label>
              <input type="number" min="0" max="50" className="input-field" value={form.experience}
                onChange={e => setForm(p => ({ ...p, experience: e.target.value }))} />
            </div>

            <div>
              <label className="form-label">Skills <span className="text-gray-400 font-normal">(comma separated)</span></label>
              <input type="text" className="input-field" placeholder="e.g. Deep cleaning, Sofa cleaning, Kitchen cleaning"
                value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} />
              <p className="text-xs text-gray-400 mt-1">These appear as badges on your public profile.</p>
            </div>

            <div>
              <label className="form-label">Service Areas <span className="text-gray-400 font-normal">(comma separated)</span></label>
              <input type="text" className="input-field" placeholder="e.g. Noida, Greater Noida, Delhi NCR"
                value={form.serviceAreas} onChange={e => setForm(p => ({ ...p, serviceAreas: e.target.value }))} />
              <p className="text-xs text-gray-400 mt-1">Customers search by area — be specific about the localities you cover.</p>
            </div>

            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <><Spinner size="sm" />Saving...</> : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default WorkerProfileEditPage
