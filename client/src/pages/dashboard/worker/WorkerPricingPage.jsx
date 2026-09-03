import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import Spinner from '../../../components/common/Spinner'
import { fetchMyWorkerProfile, updateMyPricing } from '../../../services/workerService'

const WorkerPricingPage = () => {
  const [services, setServices] = useState([])
  const [pricing,  setPricing]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState('')
  const [err,      setErr]      = useState('')

  useEffect(() => {
    fetchMyWorkerProfile().then(d => {
      const worker = d.worker
      setServices(worker.services || [])
      // Build a map: serviceId -> current price entry
      const priceMap = {}
      ;(worker.pricing || []).forEach(p => { priceMap[p.service?._id ?? p.service] = p })
      // Init form state for each service
      setPricing((worker.services || []).map(svc => ({
        service: svc._id,
        name:    svc.name,
        price:   priceMap[svc._id]?.price ?? svc.basePrice ?? 0,
        unit:    priceMap[svc._id]?.unit  ?? 'per visit',
      })))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const updatePrice = (serviceId, field, val) =>
    setPricing(p => p.map(item => item.service === serviceId ? { ...item, [field]: val } : item))

  const handleSave = async () => {
    setSaving(true); setMsg(''); setErr('')
    try {
      await updateMyPricing({ pricing: pricing.map(({ service, price, unit }) => ({ service, price: Number(price), unit })) })
      setMsg('Pricing saved successfully!')
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to save pricing.')
    } finally { setSaving(false) }
  }

  if (loading) return <DashboardLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Pricing</h1>
        <p className="text-gray-500 -mt-4 text-sm">Set your rates for each service. Customers see these on your profile.</p>

        {pricing.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">
            <p>You haven&apos;t been assigned any services yet.</p>
            <p className="text-sm mt-1">Contact admin to link services to your profile.</p>
          </div>
        ) : (
          <div className="card max-w-2xl">
            {msg && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">{msg}</div>}
            {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{err}</div>}

            <div className="space-y-4">
              {pricing.map(item => (
                <div key={item.service} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <div className="flex-1 font-medium text-gray-900">{item.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">₹</span>
                    <input type="number" min="0" className="input-field w-28 py-1.5 text-center font-semibold"
                      value={item.price}
                      onChange={e => updatePrice(item.service, 'price', e.target.value)} />
                    <select className="input-field text-sm py-1.5"
                      value={item.unit}
                      onChange={e => updatePrice(item.service, 'unit', e.target.value)}>
                      <option>per visit</option>
                      <option>per hour</option>
                      <option>per day</option>
                      <option>fixed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 mt-5">
              {saving ? <><Spinner size="sm" />Saving...</> : 'Save Pricing'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default WorkerPricingPage
