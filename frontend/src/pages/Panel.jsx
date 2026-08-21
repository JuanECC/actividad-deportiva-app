// frontend/src/pages/Panel.jsx
import React from 'react'
import Scoreboard from '../components/Scoreboard'
import ActivityLog from '../components/ActivityLog'
import SideColumn from '../components/SideColumn'
import TestApi from '../components/TestApi'

function Panel({ actividades, onEliminar, loading, error }) {
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
      <Scoreboard actividades={actividades} />
      <div className="grid">
        <ActivityLog 
          actividades={actividades} 
          onEliminar={onEliminar}
        />
        <SideColumn actividades={actividades} />
      </div>
      <TestApi />
    </>
  )
}

export default Panel