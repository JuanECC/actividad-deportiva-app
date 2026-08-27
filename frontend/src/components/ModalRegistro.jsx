import React, { useState, useEffect } from 'react'
import { useSports } from '../hooks/useSports'

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
    distanciaLabel: 'Nº ejercicios',
    distanciaPlaceholder: 'Ej: 5',
    ritmoLabel: 'Peso total (kg)',
    ritmoPlaceholder: 'Ej: 4200'
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
  tagType: ''
}

function ModalRegistro({ isOpen, onClose, onRegistrar, initialData }) {
  const [formData, setFormData] = useState(formInitial)
  const [errors, setErrors] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [errorGuardado, setErrorGuardado] = useState('')
  const { sports, loading: loadingSports } = useSports()

  const tiposActividad = [
    { id: 'run', label: '🏃 Carrera' },
    { id: 'bike', label: '🚴 Ciclismo' },
    { id: 'swim', label: '🏊 Natación' },
    { id: 'strength', label: '🏋️ Fuerza' }
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
      } else {
        setFormData(formInitial)
      }
      setErrors({})
      setErrorGuardado('')
    }
  }, [isOpen, initialData])

  const campos = camposPorTipo[formData.tipo] || camposPorTipo.run

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

    const newErrors = {}
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (!formData.distancia.trim()) newErrors.distancia = 'Este campo es obligatorio'
    if (!formData.duracion.trim()) newErrors.duracion = 'La duración es obligatoria'
    if (!formData.ritmo.trim()) newErrors.ritmo = 'Este campo es obligatorio'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const nuevaActividad = {
      tipo: formData.tipo,
      deporte: formData.deporte,
      nombre: formData.nombre.trim(),
      fecha: new Date().toISOString(),
      meta: `Hoy · ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
      distancia: formData.distancia.trim(),
      duracion: formData.duracion.trim(),
      ritmo: formData.ritmo.trim(),
      tag: formData.tag,
      tagType: formData.tag === 'Récord' ? 'pr' : ''
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
              disabled={guardando || loadingSports}
            >
              <option value="">Selecciona un deporte</option>
              {sports.map(sport => (
                <option key={sport.idSport} value={sport.strSport}>
                  {sport.strSport}
                </option>
              ))}
            </select>
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
                placeholder="Ej: 42:10"
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