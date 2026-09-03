import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Spinner from '../../components/common/Spinner'
import api from '../../services/api'

const LABELS = ['Home', 'Work', 'Other']
const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu & Kashmir','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal']

const EMPTY_FORM = { label: 'Home', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' }

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [editId,    setEditId]    = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/addresses')
      setAddresses(data.addresses)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd  = () => { setForm(EMPTY_FORM); setEditId(null); setError(''); setShowForm(true) }
  const openEdit = (a) => { setForm({ label: a.label, addressLine1: a.addressLine1, addressLine2: a.addressLine2 || '', city: a.city, state: a.state, pincode: a.pincode }); setEditId(a._id); setError(''); setShowForm(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      if (editId) await api.patch(`/addresses/${editId}`, form)
      else        await api.post('/addresses', form)
      setShowForm(false)
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save address.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return
    await api.delete(`/addresses/${id}`)
    await load()
  }

  const handleDefault = async (id) => {
    await api.patch(`/addresses/${id}/default`)
    await load()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <button onClick={openAdd} className="btn-primary">+ Add Address</button>
        </div>

        {loading && <div className="flex justify-center py-10"><Spinner size="lg" /></div>}

        {!loading && addresses.length === 0 && !showForm && (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">📍</div>
            <h3 className="font-semibold text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-gray-400 mb-4">Add your home or office address to speed up booking.</p>
            <button onClick={openAdd} className="btn-primary">Add Address</button>
          </div>
        )}

        {/* Address list */}
        <div className="space-y-3">
          {addresses.map(a => (
            <div key={a._id} className={`card flex items-start justify-between gap-4 ${a.isDefault ? 'border-2 border-blue-200' : ''}`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{a.label}</span>
                  {a.isDefault && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Default</span>}
                </div>
                <p className="text-gray-600 text-sm">{a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ''}</p>
                <p className="text-gray-500 text-sm">{a.city}, {a.state} — {a.pincode}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!a.isDefault && (
                  <button onClick={() => handleDefault(a._id)} className="text-xs text-blue-600 hover:underline">Set Default</button>
                )}
                <button onClick={() => openEdit(a)} className="text-xs text-gray-500 hover:underline">Edit</button>
                <button onClick={() => handleDelete(a._id)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">{editId ? 'Edit Address' : 'New Address'}</h2>
            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
              <div>
                <label className="form-label">Label</label>
                <div className="flex gap-2">
                  {LABELS.map(l => (
                    <button key={l} type="button"
                      onClick={() => setForm(p => ({ ...p, label: l }))}
                      className={`px-4 py-2 rounded-lg text-sm border transition-colors ${form.label === l ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              {[['addressLine1','Address Line 1','123 MG Road, Sector 5','text',true],
                ['addressLine2','Apartment / Floor (optional)','Flat 4B, Tower A','text',false],
                ['city','City','Noida','text',true],
                ['pincode','Pincode','201301','text',true]].map(([name, label, placeholder, type, required]) => (
                <div key={name}>
                  <label className="form-label">{label}</label>
                  <input type={type} className="input-field" placeholder={placeholder}
                    required={required} value={form[name]}
                    onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="form-label">State</label>
                <select className="input-field" value={form.state} required
                  onChange={e => setForm(p => ({ ...p, state: e.target.value }))}>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <><Spinner size="sm" />Saving...</> : 'Save Address'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AddressesPage
