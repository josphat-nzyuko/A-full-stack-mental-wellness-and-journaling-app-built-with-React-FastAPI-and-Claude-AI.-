import api from './axios'

export const createEntry = async (data) => {
  const response = await api.post('/journal/', data)
  return response.data
}

export const getAllEntries = async () => {
  const response = await api.get('/journal/')
  return response.data
}

export const getEntryById = async (id) => {
  const response = await api.get(`/journal/${id}`)
  return response.data
}

export const updateEntry = async (id, data) => {
  const response = await api.put(`/journal/${id}`, data)
  return response.data
}

export const deleteEntry = async (id) => {
  const response = await api.delete(`/journal/${id}`)
  return response.data
}