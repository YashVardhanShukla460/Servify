/**
 * BookingPage — multi-step flow to book a service
 *
 * Flow:
 * 1. Select Date & Time (based on worker's availability)
 * 2. Select Address
 * 3. Confirm Details & Book
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Spinner from '../components/common/Spinner'
import { fetchWorkerById } from '../services/workerService'
import { createBooking } from '../services/bookingService'
import api from '../services/api'

const DAYS = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']

const generateTimeSlots = (start, end) => {
  const slots = []
  let [sh, sm] = start.split(':').map(Number)
  let [eh, em] = end.split(':').map(Number)
  let curMins = sh * 60 + sm
  const endMins = eh * 60 + em

  while (curMins + 60 <= endMins) {
    const h = Math.floor(curMins / 60)
    const m = curMins % 60
    const shrt = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
    
    curMins += 60 // 1 hour slots for simplicity
    const h2 = Math.floor(curMins / 60)
    const m2 = curMins % 60
    const endt = `${String(h2).padStart(2,'0')}:${String(m2).padStart(2,'0')}`
    
    slots.push({ start: shrt, end: endt, label: `${shrt} - ${endt}` })
  }
  return slots
}

const BookingPage = () => {
  const { workerId, serviceId } = useParams()
  const navigate = useNavigate()

  const [step,       setStep]       = useState(1) // 1: DateTime, 2: Address, 3: Confirm
  const [worker,     setWorker]     = useState(null)
  const [service,    setService]    = useState(null)
  const [addresses,  setAddresses]  = useState([])
  
  // Selections
  const [date,       setDate]       = useState('')
  const [timeSlot,   setTimeSlot]   = useState(null)
  const [addressId,  setAddressId]  = useState('')
  const [notes,      setNotes]      = useState('')

  const [loading,    setLoading]    = useState(true)
  const [booking,    setBooking]    = useState(false)
  const [error,      setError]      = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        const [wRes, aRes] = await Promise.all([
          fetchWorkerById(workerId),
          api.get('/addresses')
        ])
        setWorker(wRes.worker)
        const svc = wRes.worker.services.find(s => s._id === serviceId)
        const pricing = wRes.worker.pricing.find(p => p.service?._id === serviceId)
        
        setService({ ...svc, customPrice: pricing?.price ?? svc.basePrice, customUnit: pricing?.unit ?? 'per visit' })
        
        const addrs = aRes.data.addresses
        setAddresses(addrs)
        if (addrs.length > 0) {
          const def = addrs.find(a => a.isDefault) || addrs[0]
          setAddressId(def._id)
        }
      } catch {
        setError('Failed to load booking details.')
      } finally { setLoading(false) }
    }
    init()
  }, [workerId, serviceId])

  // Get available slots for selected date
  const getAvailableSlots = () => {
    if (!date || !worker) return []
    const dayName = DAYS[new Date(date).getDay()]
    const dayAvail = worker.availability?.[dayName]
    
    if (!dayAvail?.isAvailable || !dayAvail.slots?.length) return []
    return generateTimeSlots(dayAvail.slots[0].start, dayAvail.slots[0].end)
  }

  const handleBook = async () => {
    setBooking(true); setError('')
    try {
      await createBooking({ workerId, serviceId, addressId, date, timeSlot, notes })
      navigate('/dashboard')
    } catch (e) {
      setError(e.response?.data?.message || 'Booking failed.')
      setBooking(false)
    }
  }

  if (loading) return <MainLayout><div className="flex justify-center py-32"><Spinner size="lg" /></div></MainLayout>
  if (error && !worker) return <MainLayout><div className="text-center py-24 text-red-500">{error}</div></MainLayout>

  const slots = getAvailableSlots()

  return (
    <MainLayout>
      <div className="page-container py-10 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Book Service</h1>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 -translate-y-1/2 transition-all" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
          {[1,2,3].map(s => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {s}
            </div>
          ))}
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">{error}</div>}

        <div className="card">
          {/* STEP 1: DATE & TIME */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">1. Select Date & Time</h2>
              
              <div>
                <label className="form-label">Choose Date</label>
                <input type="date" className="input-field max-w-xs" 
                  min={new Date().toISOString().split('T')[0]}
                  value={date} onChange={e => { setDate(e.target.value); setTimeSlot(null) }} />
              </div>

              {date && (
                <div>
                  <label className="form-label">Available Slots for {new Date(date).toLocaleDateString('en-US', {weekday:'long', month:'short', day:'numeric'})}</label>
                  {slots.length === 0 ? (
                    <p className="text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">Worker is not available on this day. Please select another date.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {slots.map(s => (
                        <button key={s.label} onClick={() => setTimeSlot(s)}
                          className={`py-2 px-3 border rounded-lg text-sm text-center transition-colors ${timeSlot?.label === s.label ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 hover:border-blue-300'}`}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button onClick={() => setStep(2)} disabled={!date || !timeSlot} className="btn-primary">Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 2: ADDRESS */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">2. Select Service Address</h2>
              
              {addresses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">You don&apos;t have any saved addresses.</p>
                  <Link to="/dashboard/addresses" target="_blank" className="btn-secondary text-sm">Add Address in Dashboard</Link>
                  <p className="text-xs text-gray-400 mt-2">Refresh this page after adding.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map(a => (
                    <div key={a._id} onClick={() => setAddressId(a._id)}
                      className={`cursor-pointer p-4 border rounded-xl transition-all ${addressId === a._id ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${addressId === a._id ? 'border-blue-600' : 'border-gray-300'}`}>
                          {addressId === a._id && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{a.label}</div>
                          <div className="text-sm text-gray-500">{a.addressLine1}, {a.city}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button onClick={() => setStep(1)} className="btn-secondary">← Back</button>
                <button onClick={() => setStep(3)} disabled={!addressId} className="btn-primary">Review & Confirm →</button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRM */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">3. Confirm Booking</h2>
              
              <div className="bg-gray-50 p-5 rounded-xl space-y-4">
                <div className="flex justify-between border-b border-gray-200 pb-4">
                  <div>
                    <div className="text-sm text-gray-500">Service</div>
                    <div className="font-semibold text-gray-900">{service?.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="font-bold text-blue-600 text-lg">₹{service?.customPrice} <span className="text-xs text-gray-500 font-normal">{service?.customUnit}</span></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Worker</div>
                    <div className="font-medium text-gray-900">{worker?.user?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Date & Time</div>
                    <div className="font-medium text-gray-900">{new Date(date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-600">{timeSlot?.label}</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label">Additional Notes (Optional)</label>
                <textarea rows={2} className="input-field resize-none" placeholder="E.g. Call when you reach the gate..."
                  value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button onClick={() => setStep(2)} className="btn-secondary" disabled={booking}>← Back</button>
                <button onClick={handleBook} disabled={booking} className="btn-primary flex items-center gap-2">
                  {booking ? <><Spinner size="sm"/>Confirming...</> : 'Confirm & Book'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default BookingPage
