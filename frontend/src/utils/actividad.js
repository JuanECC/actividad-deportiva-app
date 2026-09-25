export function fechaLocal(value = new Date()) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
    return value
  const d = new Date(value)
  if (!Number.isFinite(d.getTime())) return ''
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}
export function fechaValida(v) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v || '')) return false
  const d = new Date(v + 'T12:00:00')
  return Number.isFinite(d.getTime()) && fechaLocal(d) === v
}
// New input: minutes, mm:ss, hh:mm:ss, or explicit hours/minutes.
export function minutosEntrada(value) {
  const v = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(',', '.')
  if (/^\d+(\.\d+)?$/.test(v)) return Number(v)
  if (/^\d+:\d{2}(:\d{2})?$/.test(v)) {
    const p = v.split(':').map(Number)
    if (p.slice(1).some((n) => n >= 60)) return NaN
    return p.length === 3 ? p[0] * 60 + p[1] + p[2] / 60 : p[0] + p[1] / 60
  }
  const m = v.match(
    /^(?:(\d+(?:\.\d+)?)\s*(?:horas?|hrs?|h))?\s*(?:(\d+(?:\.\d+)?)\s*(?:minutos?|mins?|m))?$/,
  )
  return m && (m[1] || m[2]) ? Number(m[1] || 0) * 60 + Number(m[2] || 0) : NaN
}
export function minutosActividad(a) {
  if (Number.isFinite(a.duracionMinutos)) return Math.max(0, a.duracionMinutos)
  // Legacy storage used hh:mm; do not silently reinterpret existing data.
  const v = String(a.duracion || '').trim()
  if (/^\d+:\d+$/.test(v)) {
    const [h, m] = v.split(':').map(Number)
    return h * 60 + m
  }
  const n = minutosEntrada(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}
export function duracionTexto(n) {
  const s = Math.round(Math.max(0, n || 0) * 60),
    h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60)
  return (h ? h + 'h ' : '') + m + 'min' + (s % 60 ? ' ' + (s % 60) + 's' : '')
}

export function duracionParaEditar(minutes) {
  const seconds = Math.round(Math.max(0, minutes || 0) * 60)
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = String(seconds % 60).padStart(2, '0')
  return hours
    ? `${hours}:${String(mins).padStart(2, '0')}:${secs}`
    : `${mins}:${secs}`
}

export function resumenPeriodo(items, rango, now = new Date()) {
  const start = new Date(fechaLocal(now) + 'T12:00:00')
  if (rango === 'Semana')
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  else if (rango === 'Año') start.setMonth(0, 1)
  else start.setDate(1)
  const previousEnd = new Date(start)
  previousEnd.setDate(previousEnd.getDate() - 1)
  const anterior = resumenActividades(filtrarRango(items, rango, previousEnd))
  const current = filtrarRango(items, rango, now)
  const count =
    rango === 'Semana'
      ? 7
      : rango === 'Año'
        ? 12
        : new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
  const barras = Array.from({ length: count }, (_, index) => {
    const date = new Date(start)
    if (rango === 'Año') date.setMonth(index)
    else date.setDate(start.getDate() + index)
    const key = fechaLocal(date).slice(0, rango === 'Año' ? 7 : 10)
    const distancia = current
      .filter((a) => fechaLocal(a.fecha).startsWith(key))
      .reduce((s, a) => s + distanciaKm(a), 0)
    const label =
      rango === 'Año'
        ? date.toLocaleDateString('es-MX', { month: 'short' })
        : rango === 'Semana'
          ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]
          : String(index + 1)
    return { key, label, distancia }
  })
  return { anterior, barras }
}
export function distanciaKm(a) {
  if (!['run', 'bike', 'swim'].includes(a.tipo)) return 0
  const n = Number(String(a.distancia).replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n / (a.tipo === 'swim' ? 1000 : 1) : 0
}
export function filtrarRango(items, rango = 'Mes', now = new Date()) {
  const end = fechaLocal(now),
    start = new Date(end + 'T12:00:00')
  if (rango === 'Semana')
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  else if (rango === 'Año') start.setMonth(0, 1)
  else start.setDate(1)
  return items.filter(
    (a) =>
      fechaLocal(a.fecha) >= fechaLocal(start) && fechaLocal(a.fecha) <= end,
  )
}
export function fechasPlan(plan) {
  const start = fechaLocal(plan.fecha)
  if (!fechaValida(start)) return []
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
    dates = []
  for (
    let i = 0;
    i < Math.min(12, Math.max(1, Number(plan.semanas) || 1)) * 7;
    i++
  ) {
    const d = new Date(start + 'T12:00:00')
    d.setDate(d.getDate() + i)
    if ((plan.diasSeleccionados || []).includes(days[(d.getDay() + 6) % 7]))
      dates.push(fechaLocal(d))
  }
  return dates
}
export function progresoPlan(plan, sesiones) {
  const dates = fechasPlan(plan),
    done = new Set(
      sesiones
        .filter((s) => s.planId === plan.id)
        .map((s) => fechaLocal(s.fecha)),
    )
  const completadas = dates.filter((f) => done.has(f)).length
  return {
    total: dates.length,
    completadas,
    completado: dates.length > 0 && completadas === dates.length,
  }
}
export function rachaActual(items, now = new Date()) {
  const dates = new Set(items.map((a) => fechaLocal(a.fecha))),
    day = new Date(fechaLocal(now) + 'T12:00:00')
  if (!dates.has(fechaLocal(day))) day.setDate(day.getDate() - 1)
  let n = 0
  while (dates.has(fechaLocal(day))) {
    n++
    day.setDate(day.getDate() - 1)
  }
  return n
}
export function resumenActividades(items) {
  const runs = items.filter(
    (a) => a.tipo === 'run' && distanciaKm(a) > 0 && minutosActividad(a) > 0,
  )
  const km = runs.reduce((s, a) => s + distanciaKm(a), 0)
  const sec = km
    ? Math.round((runs.reduce((s, a) => s + minutosActividad(a), 0) * 60) / km)
    : null
  return {
    distancia: items.reduce((s, a) => s + distanciaKm(a), 0),
    minutos: items.reduce((s, a) => s + minutosActividad(a), 0),
    sesiones: items.length,
    carreras: runs.length,
    ritmo:
      sec === null
        ? '—'
        : Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'),
  }
}
