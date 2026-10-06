import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Spinner from '../../components/common/Spinner'
import {
  getPendingWorkers,
  updateWorkerStatus,
  getApprovedWorkers,
  assignServicesToWorker,
} from '../../services/adminService'
import { fetchServices } from '../../services/serviceService'

// ── Pending Approvals Tab ─────────────────────────────────────────────
const PendingTab = () => {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const { workers } = await getPendingWorkers()
      setWorkers(workers)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleStatus = async (id, status) => {
    try {
      await updateWorkerStatus(id, status)
      await load()
    } catch (e) {
      alert(e.response?.data?.message || 'Update failed')
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  if (workers.length === 0) {
    return (
      <div className="card text-center py-16 text-gray-400">
        <div className="text-4xl mb-4">✅</div>
        <p className="font-medium text-gray-500">All caught up! No pending worker approvals.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {workers.map(w => (
        <div key={w._id} className="card flex flex-col md:flex-row gap-6">
          <div className="shrink-0 w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl text-gray-500 overflow-hidden">
            {w.user?.profileImage
              ? <img src={w.user.profileImage} alt="" className="w-full h-full object-cover" />
              : w.user?.name?.[0]}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{w.user?.name}</h3>
            <div className="text-sm text-gray-400 mb-2">Joined: {new Date(w.createdAt).toLocaleDateString()}</div>
            <div className="text-sm text-gray-600 space-y-1">
              <div><span className="font-medium text-gray-800">Email:</span> {w.user?.email}</div>
              <div><span className="font-medium text-gray-800">Bio:</span> {w.bio || 'Not provided'}</div>
              <div><span className="font-medium text-gray-800">Experience:</span> {w.experience} yrs</div>
              <div><span className="font-medium text-gray-800">Skills:</span> {w.skills?.join(', ') || 'None'}</div>
              <div><span className="font-medium text-gray-800">Areas:</span> {w.serviceAreas?.join(', ') || 'None'}</div>
            </div>
          </div>
          <div className="shrink-0 flex flex-col gap-2 justify-center w-full md:w-32">
            <button
              onClick={() => handleStatus(w._id, 'approved')}
              className="btn-primary bg-green-600 hover:bg-green-700 border-none py-2 text-sm w-full"
            >Approve ✓</button>
            <button
              onClick={() => handleStatus(w._id, 'rejected')}
              className="btn-secondary py-2 text-sm w-full text-red-600 border-red-600 hover:bg-red-50"
            >Reject ✗</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Assign Services Tab ───────────────────────────────────────────────
const AssignServicesTab = () => {
  const [workers,  setWorkers]  = useState([])
  const [services, setServices] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)   // worker being edited
  const [draft,    setDraft]    = useState([])     // selected service IDs for that worker
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState('')

  const load = async () => {
    try {
      const [wRes, sRes] = await Promise.all([getApprovedWorkers(), fetchServices({ limit: 100 })])
      setWorkers(wRes.workers)
      setServices(sRes.services)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openEdit = (w) => {
    setSelected(w)
    setDraft((w.services || []).map(s => s._id))
    setMsg('')
  }

  const toggleService = (id) => {
    setDraft(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleSave = async () => {
    setSaving(true); setMsg('')
    try {
      await assignServicesToWorker(selected._id, draft)
      setMsg('Services assigned successfully!')
      await load()
      // Update selected worker with fresh data
      setSelected(prev => ({
        ...prev,
        services: services.filter(s => draft.includes(s._id))
      }))
    } catch (e) {
      setMsg(e.response?.data?.message || 'Failed to save.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  if (workers.length === 0) {
    return (
      <div className="card text-center py-16 text-gray-400">
        <div className="text-4xl mb-4">👷</div>
        <p className="font-medium text-gray-500">No approved workers yet.</p>
        <p className="text-sm mt-1">Approve workers from the "Pending Approvals" tab first.</p>
      </div>
    )
  }

  // Group services by category
  const byCategory = services.reduce((acc, svc) => {
    const cat = svc.category?.name || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(svc)
    return acc
  }, {})

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: worker list */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Select a Worker</h3>
        {workers.map(w => (
          <div
            key={w._id}
            onClick={() => openEdit(w)}
            className={`card cursor-pointer transition-all hover:border-blue-300 hover:shadow-md ${selected?._id === w._id ? 'border-blue-500 ring-2 ring-blue-100' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                {w.user?.profileImage
                  ? <img src={w.user.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                  : w.user?.name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{w.user?.name}</div>
                <div className="text-xs text-gray-400 truncate">{w.user?.email}</div>
              </div>
              <div className="shrink-0">
                <span className="badge bg-blue-50 text-blue-700 border border-blue-100 text-xs">
                  {w.services?.length || 0} services
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right: service assignment */}
      <div>
        {!selected ? (
          <div className="card text-center py-16 text-gray-400 h-full flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">👈</div>
            <p>Select a worker to assign services</p>
          </div>
        ) : (
          <div className="card space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Assign Services</h3>
              <p className="text-sm text-gray-400">for <span className="font-medium text-gray-700">{selected.user?.name}</span></p>
            </div>

            {msg && (
              <div className={`text-sm rounded-xl px-4 py-3 ${msg.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {msg}
              </div>
            )}

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {Object.entries(byCategory).map(([cat, svcs]) => (
                <div key={cat}>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{cat}</div>
                  <div className="space-y-2">
                    {svcs.map(svc => (
                      <label
                        key={svc._id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          draft.includes(svc._id)
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-blue-600"
                          checked={draft.includes(svc._id)}
                          onChange={() => toggleService(svc._id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">{svc.name}</div>
                          <div className="text-xs text-gray-400">Base: ₹{svc.basePrice?.toLocaleString('en-IN')}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">{draft.length} service(s) selected</span>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                {saving ? <><Spinner size="sm" />Saving...</> : 'Save Assignment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Admin Dashboard ──────────────────────────────────────────────
const AdminDashboardPage = () => {
  const [tab, setTab] = useState('pending')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="card bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <h1 className="text-2xl font-bold">Admin Dashboard 👑</h1>
          <p className="mt-1 opacity-90 text-sm">Manage the marketplace, approve workers, and assign services.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { id: 'pending', label: '⏳ Pending Approvals' },
            { id: 'assign',  label: '🔧 Assign Services'  },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'pending' && <PendingTab />}
        {tab === 'assign'  && <AssignServicesTab />}
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboardPage
