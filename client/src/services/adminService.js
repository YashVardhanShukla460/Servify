import api from './api'

export const getPendingWorkers = async () => {
  const { data } = await api.get('/workers/admin/pending')
  return data
}

export const updateWorkerStatus = async (workerId, status) => {
  const { data } = await api.patch(`/workers/admin/${workerId}/status`, { status })
  return data
}
