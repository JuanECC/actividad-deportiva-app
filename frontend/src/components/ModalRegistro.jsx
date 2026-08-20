// src/components/ModalRegistro.jsx
import React, { useState } from 'react'

function ModalRegistro({ isOpen, onClose, onRegistrar }) {
  const [formData, setFormData] = useState({
    tipo: 'run',
    nombre: '',
    distancia: '',
    duracion: '',
    ritmo: '',
    tag: 'Entrenamiento',
    tagType: ''
  })

  const [errors, setErrors] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [errorGuardado, setErrorGuardado] = useState('')

  // Tipos de actividad con sus emojis
  const tiposActividad = [
    { id: 'run', label: '🏃 Carrera' },
    { id: 'bike', label: '🚴 Ciclismo' },
    { id: 'swim', label: '🏊 Natación' },
    { id: 'strength', label: '🏋️ Fuerza' }
  ]

  // Tags predefinidos
  const tagsDisponibles = [
    { value: 'Entrenamiento', label: 'Entrenamiento' },
    { value: 'Récord', label: '⭐ Récord' },
    { value: 'Recuperación', label: '🧘 Recuperación' },
    { value: 'Técnica', label: '🎯 Técnica' },
    { value: 'Velocidad', label: '⚡ Velocidad' },
    { value: 'Volumen', label: '📈 Volumen' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Resetear errores
    setErrorGuardado('')
    
    // Validaciones
    const newErrors = {}
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (!formData.distancia.trim()) newErrors.distancia = 'La distancia es obligatoria'
    if (!formData.duracion.trim()) newErrors.duracion = 'La duración es obligatoria'
    if (!formData.ritmo.trim()) newErrors.ritmo = 'El ritmo es obligatorio'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Crear objeto de actividad (sin id ni fecha, Firestore los genera)
    const nuevaActividad = {
      tipo: formData.tipo,
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
      // Enviar al padre (que ahora guarda en Firestore)
      await onRegistrar(nuevaActividad)
      
      // Resetear formulario
      setFormData({
        tipo: 'run',
        nombre: '',
        distancia: '',
        duracion: '',
        ritmo: '',
        tag: 'Entrenamiento',
        tagType: ''
      })
      
      // Cerrar modal
      onClose()
    } catch (err) {
      console.error('Error al guardar actividad:', err)
      setErrorGuardado('No se pudo guardar la actividad. Intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  // Si no está abierto, no renderizar nada
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 Registrar Actividad</h2>
          <button className="modal-close" onClick={onClose} disabled={guardando}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Tipo de actividad */}
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

          {/* Nombre */}
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

          {/* Distancia */}
          <div className="modal-field">
            <label htmlFor="distancia">Distancia *</label>
            <input
              id="distancia"
              name="distancia"
              type="text"
              placeholder="Ej: 8.4 km, 1,800 m, 5 ejerc."
              value={formData.distancia}
              onChange={handleChange}
              className={errors.distancia ? 'error' : ''}
              disabled={guardando}
            />
            {errors.distancia && <span className="modal-error">{errors.distancia}</span>}
          </div>

          {/* Duración y Ritmo (2 columnas) */}
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
              <label htmlFor="ritmo">Ritmo *</label>
              <input
                id="ritmo"
                name="ritmo"
                type="text"
                placeholder="Ej: 5:01 /km, 24.7 km/h"
                value={formData.ritmo}
                onChange={handleChange}
                className={errors.ritmo ? 'error' : ''}
                disabled={guardando}
              />
              {errors.ritmo && <span className="modal-error">{errors.ritmo}</span>}
            </div>
          </div>

          {/* Tag */}
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

          {/* Error al guardar */}
          {errorGuardado && (
            <div className="login-error">
              <span>⚠️ {errorGuardado}</span>
            </div>
          )}

          {/* Botones */}
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