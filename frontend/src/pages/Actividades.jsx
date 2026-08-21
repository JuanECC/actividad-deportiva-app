// frontend/src/pages/Actividades.jsx
import React from 'react'
import ActivityLog from '../components/ActivityLog'

function Actividades({ actividades, onEliminar, loading, error }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando actividades...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p>⚠️ Error: {error}</p>
      </div>
    )
  }

  return (
    <section className="panel" aria-label="Todas las actividades">
      <div className="panel__header">
        <h2 className="panel__title">Todas las actividades</h2>
        <span className="panel__link">{actividades.length} registradas</span>
      </div>
      <ActivityLog 
        actividades={actividades} 
        onEliminar={onEliminar}
      />
    </section>
  )
}

export default Actividades