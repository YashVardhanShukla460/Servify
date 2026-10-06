import api from './api'

export const getPendingWorkers = async () => {
  const { data } = await api.get('/workers/admin/pending')
  return data
}

export const updateWorkerStatus = async (workerId, status) => {
  const { data } = await api.patch(`/workers/admin/${workerId}/status`, { status })
  return data
}

export const getApprovedWorkers = async () => {
  const { data } = await api.get('/workers/admin/approved')
  return data
}

export const assignServicesToWorker = async (workerId, serviceIds) => {
  const { data } = await api.patch(`/workers/admin/${workerId}/services`, { services: serviceIds })
  return data
}
