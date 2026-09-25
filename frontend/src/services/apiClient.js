const API_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
const API_WGER_URL = import.meta.env.VITE_API_URL || 'https://wger.de/api/v2'
export async function apiClient(
  endpoint,
  options = {},
  baseUrl = API_WGER_URL,
) {
  const controller = new AbortController()
  const abort = () => controller.abort()
  if (options.signal?.aborted) controller.abort()
  options.signal?.addEventListener('abort', abort, { once: true })
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(baseUrl.replace(/\/$/, '') + endpoint, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    })
    if (!response.ok)
      throw new Error(
        response.status === 429
          ? 'Demasiadas consultas. Espera un momento e intenta de nuevo.'
          : 'El servicio no pudo responder. Intenta de nuevo.',
      )
    try {
      return await response.json()
    } catch {
      throw new Error('El servicio devolvió una respuesta inválida.')
    }
  } catch (error) {
    if (options.signal?.aborted) throw error
    if (error.name === 'AbortError')
      throw new Error('El servicio tardó demasiado. Intenta de nuevo.')
    if (error instanceof TypeError)
      throw new Error('No se pudo conectar. Revisa tu conexión.')
    throw error
  } finally {
    clearTimeout(timer)
    options.signal?.removeEventListener('abort', abort)
  }
}
export const get = (endpoint, baseUrl, options = {}) =>
  apiClient(endpoint, { ...options, method: 'GET' }, baseUrl)
export const post = (endpoint, body, baseUrl) =>
  apiClient(endpoint, { method: 'POST', body: JSON.stringify(body) }, baseUrl)
export const getBackendHealth = () => get('/api/health', API_BACKEND_URL)
