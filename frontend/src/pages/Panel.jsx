import React from 'react'
import Scoreboard from '../components/Scoreboard'
import ActivityLog from '../components/ActivityLog'
import SideColumn from '../components/SideColumn'

function Panel({ actividades, onEliminar, loading, error, rangoActivo }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando tus actividades...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p>⚠️ Error al cargar actividades: {error}</p>
      </div>
    )
  }

  return (
    <>
      <Scoreboard actividades={actividades} rangoActivo={rangoActivo} />
      <div className="grid">
        <ActivityLog actividades={actividades} onEliminar={onEliminar} />
        <SideColumn actividades={actividades} rangoActivo={rangoActivo} />
      </div>
    </>
  )
}

export default Panel