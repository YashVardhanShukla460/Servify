import api from './api'

export const createReview = async (payload) => {
  const { data } = await api.post('/reviews', payload)
  return data
}

export const getWorkerReviews = async (workerId, page = 1) => {
  const { data } = await api.get(`/reviews/worker/${workerId}?page=${page}`)
  return data
}
