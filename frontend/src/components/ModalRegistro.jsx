import React, { useState, useEffect } from 'react'
import { deportes } from '../utils/deportes'
import { actividadSchema, validarConZod } from '../utils/validations'

const camposPorTipo = {
  run: {
    distanciaLabel: 'Distancia (km)',
    distanciaPlaceholder: 'Ej: 8.4',
    ritmoLabel: 'Ritmo (min/km)',
    ritmoPlaceholder: 'Ej: 5:01'
  },
  bike: {
    distanciaLabel: 'Distancia (km)',
    distanciaPlaceholder: 'Ej: 24.1',
    ritmoLabel: 'Velocidad (km/h)',
    ritmoPlaceholder: 'Ej: 24.7'
  },
  swim: {
    distanciaLabel: 'Distancia (m)',
    distanciaPlaceholder: 'Ej: 1800',
    ritmoLabel: 'Ritmo (min/100m)',
    ritmoPlaceholder: 'Ej: 2:07'
  },
  strength: {
    rounds: {
      distanciaLabel: 'Número de rondas',
      distanciaPlaceholder: 'Ej: 5',
      ritmoLabel: 'Descanso (seg)',
      ritmoPlaceholder: 'Ej: 60'
    },
    tiempo: {
      distanciaLabel: 'Tiempo por round (min)',
      distanciaPlaceholder: 'Ej: 3',
      ritmoLabel: 'Descanso (seg)',
      ritmoPlaceholder: 'Ej: 60'
    }
  },
  sport: {
    distanciaLabel: 'Puntuación / Goles',
    distanciaPlaceholder: 'Ej: 2 goles, 25 puntos',
    ritmoLabel: 'Rendimiento',
    ritmoPlaceholder: 'Ej: 70%, 3 asistencias'
  }
}

const formInitial = {
  tipo: 'run',
  deporte: '',
  nombre: '',
  distancia: '',
  duracion: '',
  ritmo: '',
  tag: 'Entrenamiento',
  tagType: '',
  modoFuerza: 'rounds'
}

const diasSemana = [
  { id: 'L', label: 'L' },
  { id: 'M', label: 'M' },
  { id: 'X', label: 'X' },
  { id: 'J', label: 'J' },
  { id: 'V', label: 'V' },
  { id: 'S', label: 'S' },
  { id: 'D', label: 'D' }
]

const normalizarDistancia = (valor, tipo) => {
  if (tipo === 'strength') return valor.trim()
  const limpio = valor.replace(/[^\d.,]/g, '').replace(',', '.')
  return limpio || valor.trim()
}

const normalizarDuracion = (valor) => {
  const v = valor.trim().toLowerCase()
  if (v.includes(':')) {
    const [h, m] = v.split(':')
    return `${h}:${m.padStart(2, '0')}`
  }
  const matchH = v.match(/(\d+)\s*(h|hr|hrs|horas?)/)
  if (matchH) return `${matchH[1]}:00`
  const matchM = v.match(/(\d+)\s*(min|mins?)/)
  if (matchM) {
    const totalMin = parseInt(matchM[1], 10)
    const h = Math.floor(totalMin / 60)
    const m = totalMin % 60
    return `${h}:${m.toString().padStart(2, '0')}`
  }
  if (!isNaN(v) && v !== '') return `0:${v.padStart(2, '0')}`
  return valor.trim()
}

function ModalRegistro({ isOpen, onClose, onRegistrar, initialData }) {
  const [formData, setFormData] = useState(formInitial)
  const [errors, setErrors] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [errorGuardado, setErrorGuardado] = useState('')
  const [diasSeleccionados, setDiasSeleccionados] = useState([])
  const [semanas, setSemanas] = useState(1)
  const [modoFuerza, setModoFuerza] = useState('rounds')

  const tiposActividad = [
    { id: 'run', label: '🏃 Carrera' },
    { id: 'bike', label: '🚴 Ciclismo' },
    { id: 'swim', label: '🏊 Natación' },
    { id: 'strength', label: '🏋️ Fuerza' },
    { id: 'sport', label: '🏅 Deporte' }
  ]

  const tagsDisponibles = [
    { value: 'Entrenamiento', label: 'Entrenamiento' },
    { value: 'Récord', label: '⭐ Récord' },
    { value: 'Recuperación', label: '🧘 Recuperación' },
    { value: 'Técnica', label: '🎯 Técnica' },
    { value: 'Velocidad', label: '⚡ Velocidad' },
    { value: 'Volumen', label: '📈 Volumen' }
  ]

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...formInitial, ...initialData })
        setDiasSeleccionados(initialData.diasSeleccionados || [])
        setSemanas(initialData.semanas || 1)
        setModoFuerza(initialData.modoFuerza || 'rounds')
      } else {
        setFormData(formInitial)
        setDiasSeleccionados([])
        setSemanas(1)
        setModoFuerza('rounds')
      }
      setErrors({})
      setErrorGuardado('')
    }
  }, [isOpen, initialData])

  useEffect(() => {
    if (formData.deporte) {
      const deporteSeleccionado = deportes.find(d => d.nombre === formData.deporte)
      if (deporteSeleccionado) {
        setFormData(prev => ({ ...prev, tipo: deporteSeleccionado.tipo }))
      }
    }
  }, [formData.deporte])

  const campos = formData.tipo === 'strength'
    ? camposPorTipo.strength[modoFuerza]
    : camposPorTipo[formData.tipo] || camposPorTipo.sport

  const toggleDia = (dia) => {
    setDiasSeleccionados(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorGuardado('')

    const { ok, errors: zodErrors } = validarConZod(actividadSchema, {
      tipo: formData.tipo,
      deporte: formData.deporte || 'sin_deporte',
      nombre: formData.nombre,
      distancia: formData.distancia,
      duracion: formData.duracion,
      ritmo: formData.ritmo,
      tag: formData.tag
    })

    if (!ok) {
      setErrors(zodErrors)
      return
    }

    const nuevaActividad = {
      tipo: formData.tipo,
      deporte: formData.deporte,
      nombre: formData.nombre.trim(),
      fecha: new Date().toISOString(),
      fechaInicio: new Date().toISOString(),
      meta: `Hoy · ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
      distancia: normalizarDistancia(formData.distancia, formData.tipo),
      duracion: normalizarDuracion(formData.duracion),
      ritmo: formData.ritmo.trim(),
      tag: formData.tag,
      tagType: formData.tag === 'Récord' ? 'pr' : '',
      diasSeleccionados,
      semanas,
      modoFuerza: formData.tipo === 'strength' ? modoFuerza : undefined
    }

    try {
      setGuardando(true)
      await onRegistrar(nuevaActividad)
      onClose()
    } catch (err) {
      console.error('Error al guardar actividad:', err)
      setErrorGuardado('No se pudo guardar la actividad. Intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 Registrar Actividad</h2>
          <button className="modal-close" onClick={onClose} disabled={guardando}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label htmlFor="deporte">Deporte *</label>
            <select
              id="deporte"
              name="deporte"
              value={formData.deporte || ''}
              onChange={handleChange}
              disabled={guardando}
            >
              <option value="">Selecciona un deporte</option>
              {deportes.map(deporte => (
                <option key={deporte.id} value={deporte.nombre}>
                  {deporte.icono} {deporte.nombre}
                </option>
              ))}
            </select>
            {errors.deporte && <span className="modal-error">{errors.deporte}</span>}
          </div>

          <div className="modal-field">
            <label>Tipo de actividad</label>
            <div className="modal-tipo-grid">
              {tiposActividad.map(tipo => (
                <button
                  key={tipo.id}
                  type="button"
                  className={`modal-tipo-btn ${formData.tipo === tipo.id ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, tipo: tipo.id }))}
                  disabled={guardando}
                >
                  {tipo.label}
                </button>
              ))}
            </div>
          </div>

          {formData.tipo === 'strength' && (
            <div className="modal-field">
              <label htmlFor="modoFuerza">Tipo de registro</label>
              <select
                id="modoFuerza"
                name="modoFuerza"
                value={modoFuerza}
                onChange={(e) => setModoFuerza(e.target.value)}
                disabled={guardando}
              >
                <option value="rounds">Por rondas</option>
                <option value="tiempo">Por tiempo</option>
              </select>
            </div>
          )}

          <div className="modal-field">
            <label>Días de la semana</label>
            <div className="dias-semana">
              {diasSemana.map(dia => (
                <button
                  key={dia.id}
                  type="button"
                  className={`dia-btn ${diasSeleccionados.includes(dia.id) ? 'dia-btn--active' : ''}`}
                  onClick={() => toggleDia(dia.id)}
                  disabled={guardando}
                >
                  {dia.label}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-field">
            <label htmlFor="semanas">¿Cuántas semanas?</label>
            <input
              id="semanas"
              name="semanas"
              type="number"
              min="1"
              max="12"
              value={semanas}
              onChange={(e) => setSemanas(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
              disabled={guardando}
            />
          </div>

          <div className="modal-field">
            <label htmlFor="nombre">Nombre de la actividad *</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ej: Carrera matutina — Parque Central"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? 'error' : ''}
              disabled={guardando}
            />
            {errors.nombre && <span className="modal-error">{errors.nombre}</span>}
          </div>

          <div className="modal-field">
            <label htmlFor="distancia">{campos.distanciaLabel} *</label>
            <input
              id="distancia"
              name="distancia"
              type="text"
              placeholder={campos.distanciaPlaceholder}
              value={formData.distancia}
              onChange={handleChange}
              className={errors.distancia ? 'error' : ''}
              disabled={guardando}
            />
            {errors.distancia && <span className="modal-error">{errors.distancia}</span>}
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="duracion">Duración *</label>
              <input
                id="duracion"
                name="duracion"
                type="text"
                placeholder="Ej: 42:10, 1h 30min"
                value={formData.duracion}
                onChange={handleChange}
                className={errors.duracion ? 'error' : ''}
                disabled={guardando}
              />
              {errors.duracion && <span className="modal-error">{errors.duracion}</span>}
            </div>

            <div className="modal-field">
              <label htmlFor="ritmo">{campos.ritmoLabel} *</label>
              <input
                id="ritmo"
                name="ritmo"
                type="text"
                placeholder={campos.ritmoPlaceholder}
                value={formData.ritmo}
                onChange={handleChange}
                className={errors.ritmo ? 'error' : ''}
                disabled={guardando}
              />
              {errors.ritmo && <span className="modal-error">{errors.ritmo}</span>}
            </div>
          </div>

          <div className="modal-field">
            <label htmlFor="tag">Etiqueta</label>
            <select
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              disabled={guardando}
            >
              {tagsDisponibles.map(tag => (
                <option key={tag.value} value={tag.value}>
                  {tag.label}
                </option>
              ))}
            </select>
          </div>

          {errorGuardado && (
            <div className="login-error">
              <span>⚠️ {errorGuardado}</span>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn-cancel"
              onClick={onClose}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="modal-btn-submit"
              disabled={guardando}
            >
              {guardando ? '⏳ Guardando...' : '✅ Registrar Actividad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalRegistro