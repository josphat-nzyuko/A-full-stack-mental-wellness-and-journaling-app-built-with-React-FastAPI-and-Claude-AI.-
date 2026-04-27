import api from './axios'

export const logMood = async (data) => {
  const response = await api.post('/mood/', data)
  return response.data
}

export const getMoodHistory = async (days = 30) => {
  const response = await api.get(`/mood/history?days=${days}`)
  return response.data
}