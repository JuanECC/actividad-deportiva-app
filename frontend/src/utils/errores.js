export function mensajeError(
  error,
  fallback = 'No se pudo guardar. Intenta de nuevo.',
) {
  if (error?.code === 'permission-denied')
    return 'No tienes permiso para realizar esta operación.'
  if (error?.code === 'unavailable')
    return 'No hay conexión con el servicio. Revisa tu conexión e intenta de nuevo.'
  if (error?.code === 'auth/network-request-failed')
    return 'Revisa tu conexión e intenta de nuevo.'
  if (error?.code || error?.name === 'ZodError') return fallback
  return error?.message || fallback
}
