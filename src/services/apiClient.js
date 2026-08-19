// src/services/apiClient.js
// Cliente HTTP base para consumir APIs externas

const BASE_URL = import.meta.env.VITE_API_URL || 'https://wger.de/api/v2'

/**
 * Cliente HTTP genérico para hacer peticiones a la API
 * @param {string} endpoint - Ruta del endpoint (ej: '/exercise/')
 * @param {Object} options - Opciones de fetch (method, headers, body)
 * @returns {Promise<Object>} Respuesta JSON
 */
export async function apiClient(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`[apiClient] Error en ${endpoint}:`, error.message)
    throw error
  }
}

/**
 * Helper para peticiones GET
 */
export function get(endpoint) {
  return apiClient(endpoint, { method: 'GET' })
}

/**
 * Helper para peticiones POST
 */
export function post(endpoint, body) {
  return apiClient(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}