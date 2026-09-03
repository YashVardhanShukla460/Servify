import api from './api'

export const createBooking = async (payload) => {
  const { data } = await api.post('/bookings', payload)
  return data
}

export const getCustomerBookings = async () => {
  const { data } = await api.get('/bookings/customer')
  return data
}

export const getWorkerBookings = async () => {
  const { data } = await api.get('/bookings/worker')
  return data
}

export const updateBookingStatus = async (id, status) => {
  const { data } = await api.patch(`/bookings/${id}/status`, { status })
  return data
}
