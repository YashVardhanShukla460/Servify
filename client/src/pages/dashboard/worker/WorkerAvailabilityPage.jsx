import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import Spinner from '../../../components/common/Spinner'
import { fetchMyWorkerProfile, updateMyAvailability } from '../../../services/workerService'

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

const DEFAULT_AVAIL = DAYS.reduce((acc, day) => ({
  ...acc,
  [day]: { isAvailable: false, slots: [{ start: '09:00', end: '17:00' }] }
}), {})

const WorkerAvailabilityPage = () => {
  const [avail,   setAvail]   = useState(DEFAULT_AVAIL)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState('')
  const [err,     setErr]     = useState('')

  useEffect(() => {
    fetchMyWorkerProfile()
      .then(d => { if (d.worker.availability) setAvail({ ...DEFAULT_AVAIL, ...d.worker.availability }) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggle = (day) => setAvail(p => ({ ...p, [day]: { ...p[day], isAvailable: !p[day].isAvailable } }))
  const updateSlot = (day, field, val) => setAvail(p => ({ ...p, [day]: { ...p[day], slots: [{ ...p[day].slots[0], [field]: val }] } }))

  const handleSave = async () => {
    setSaving(true); setMsg(''); setErr('')
    try {
      await updateMyAvailability(avail)
      setMsg('Availability saved!')
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to save.')
    } finally { setSaving(false) }
  }

  if (loading) return <DashboardLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Availability</h1>
        <p className="text-gray-500 -mt-4 text-sm">Set which days and hours you are available to take bookings.</p>

        <div className="card max-w-2xl space-y-3">
          {msg && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">{msg}</div>}
          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{err}</div>}

          {DAYS.map(day => (
            <div key={day} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${avail[day].isAvailable ? 'border-blue-200 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}>
              {/* Toggle */}
              <button type="button" onClick={() => toggle(day)}
                className={`relative w-12 h-6 rounded-full transition-colors ${avail[day].isAvailable ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${avail[day].isAvailable ? 'translate-x-6' : ''}`} />
              </button>

              {/* Day name */}
              <span className={`w-24 capitalize font-medium ${avail[day].isAvailable ? 'text-gray-900' : 'text-gray-400'}`}>{day}</span>

              {/* Time range */}
              {avail[day].isAvailable ? (
                <div className="flex items-center gap-2">
                  <input type="time" className="input-field py-1 px-2 text-sm w-32"
                    value={avail[day].slots[0]?.start || '09:00'}
                    onChange={e => updateSlot(day, 'start', e.target.value)} />
                  <span className="text-gray-400">to</span>
                  <input type="time" className="input-field py-1 px-2 text-sm w-32"
                    value={avail[day].slots[0]?.end || '17:00'}
                    onChange={e => updateSlot(day, 'end', e.target.value)} />
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Not available</span>
              )}
            </div>
          ))}

          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 mt-2">
            {saving ? <><Spinner size="sm" />Saving...</> : 'Save Availability'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default WorkerAvailabilityPage
