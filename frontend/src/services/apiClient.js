const API_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
const API_WGER_URL = import.meta.env.VITE_API_URL || 'https://wger.de/api/v2'

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
      let mensaje = `Error ${response.status}: ${response.statusText}`
      try {
        const data = await response.json()
        mensaje = data.message || data.error || mensaje
      } catch {
        // no JSON
      }
      const error = new Error(mensaje)
      error.status = response.status
      throw error
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
      error.message = 'No se pudo conectar con el servidor. Revisa tu conexión.'
    }
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

export async function getBackendHealth() {
  return get('/api/health', API_BACKEND_URL)
}