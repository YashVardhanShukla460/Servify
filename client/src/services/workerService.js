import api from './api'

export const fetchWorkers = async (params = {}) => {
  const { data } = await api.get('/workers', { params })
  return data
}

export const fetchWorkerById = async (id) => {
  const { data } = await api.get(`/workers/${id}`)
  return data
}

export const fetchMyWorkerProfile = async () => {
  const { data } = await api.get('/workers/me')
  return data
}

export const updateMyWorkerProfile = async (payload) => {
  const { data } = await api.patch('/workers/me', payload)
  return data
}

export const updateMyAvailability = async (payload) => {
  const { data } = await api.patch('/workers/me/availability', payload)
  return data
}

export const updateMyPricing = async (payload) => {
  const { data } = await api.patch('/workers/me/pricing', payload)
  return data
}
