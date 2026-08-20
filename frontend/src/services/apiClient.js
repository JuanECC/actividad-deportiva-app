// frontend/src/services/apiClient.js
// Cliente HTTP base para consumir APIs

const API_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
const API_WGER_URL = import.meta.env.VITE_API_URL || 'https://wger.de/api/v2'

/**
 * Cliente HTTP genérico
 * @param {string} endpoint - Ruta del endpoint
 * @param {Object} options - Opciones de fetch
 * @param {string} baseUrl - URL base (por defecto Wger)
 */
export async function apiClient(endpoint, options = {}, baseUrl = API_WGER_URL) {
  const url = `${baseUrl}${endpoint}`
  
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

export function get(endpoint, baseUrl) {
  return apiClient(endpoint, { method: 'GET' }, baseUrl)
}

export function post(endpoint, body, baseUrl) {
  return apiClient(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  }, baseUrl)
}

// Función específica para llamar al backend propio
export async function getBackendHealth() {
  return get('/api/health', API_BACKEND_URL)
}