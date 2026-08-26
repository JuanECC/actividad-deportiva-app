import { get } from './apiClient'

export async function getEjercicios(params = {}) {
  const queryParams = new URLSearchParams()
  queryParams.append('language', '2')
  if (params.limit) queryParams.append('limit', params.limit)
  if (params.offset) queryParams.append('offset', params.offset)
  if (params.category) queryParams.append('category', params.category)
  if (params.muscles) queryParams.append('muscles', params.muscles)
  if (params.equipment) queryParams.append('equipment', params.equipment)
  return get(`/exercise/?${queryParams.toString()}`)
}

export async function getMusculos() {
  return get('/muscle/?language=2')
}

export async function getCategorias() {
  return get('/exercisecategory/')
}

export async function getEquipamiento() {
  return get('/equipment/')
}

export async function getIngredientes(params = {}) {
  const queryParams = new URLSearchParams()
  queryParams.append('language', '2')
  if (params.limit) queryParams.append('limit', params.limit)
  if (params.offset) queryParams.append('offset', params.offset)
  if (params.search) queryParams.append('search', params.search)
  return get(`/ingredient/?${queryParams.toString()}`)
}

export async function getDetalleEjercicio(id) {
  return get(`/exerciseinfo/${id}/?language=2`)
}

export async function getImagenesEjercicio(exerciseId) {
  return get(`/exerciseimage/?exercise=${exerciseId}`)
}