// src/services/wgerApi.js
// Cliente específico para la API Wger (ejercicios y nutrición)
import { get } from './apiClient'

/**
 * Obtener lista de ejercicios
 * @param {Object} params - Parámetros de búsqueda
 * @param {number} params.limit - Número de resultados
 * @param {number} params.offset - Paginación
 * @param {number} params.category - Filtrar por categoría
 * @param {number} params.muscles - Filtrar por músculo
 * @param {number} params.equipment - Filtrar por equipamiento
 */
export async function getEjercicios(params = {}) {
  const queryParams = new URLSearchParams()
  
  // Idioma español por defecto
  queryParams.append('language', '2')
  
  // Agregar parámetros opcionales
  if (params.limit) queryParams.append('limit', params.limit)
  if (params.offset) queryParams.append('offset', params.offset)
  if (params.category) queryParams.append('category', params.category)
  if (params.muscles) queryParams.append('muscles', params.muscles)
  if (params.equipment) queryParams.append('equipment', params.equipment)
  
  return get(`/exercise/?${queryParams.toString()}`)
}

/**
 * Obtener grupos musculares
 */
export async function getMusculos() {
  return get('/muscle/?language=2')
}

/**
 * Obtener categorías de ejercicio
 */
export async function getCategorias() {
  return get('/exercisecategory/')
}

/**
 * Obtener equipamiento
 */
export async function getEquipamiento() {
  return get('/equipment/')
}

/**
 * Obtener ingredientes nutricionales
 * @param {Object} params - Parámetros de búsqueda
 */
export async function getIngredientes(params = {}) {
  const queryParams = new URLSearchParams()
  
  // Idioma español por defecto
  queryParams.append('language', '2')
  
  if (params.limit) queryParams.append('limit', params.limit)
  if (params.offset) queryParams.append('offset', params.offset)
  if (params.search) queryParams.append('search', params.search)
  
  return get(`/ingredient/?${queryParams.toString()}`)
}

/**
 * Obtener detalle de ejercicio (nombre y descripción en español)
 * @param {number} id - ID del ejercicio
 */
export async function getDetalleEjercicio(id) {
  return get(`/exerciseinfo/${id}/?language=2`)
}

/**
 * Obtener imágenes de un ejercicio
 * @param {number} exerciseId - ID del ejercicio
 */
export async function getImagenesEjercicio(exerciseId) {
  return get(`/exerciseimage/?exercise=${exerciseId}`)
}