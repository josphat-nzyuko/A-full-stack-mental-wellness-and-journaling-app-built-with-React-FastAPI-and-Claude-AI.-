import api from './axios'

export const getInsightsSummary = async () => {
  const response = await api.get('/insights/summary')
  return response.data
}