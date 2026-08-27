import React from 'react'
import { deportes } from '../utils/deportes'

function SportsCatalog({ onSelectSport }) {
  return (
    <div className="sports-grid">
      {deportes.map(deporte => (
        <div key={deporte.id} className="sport-card">
          <div className="sport-card__header">
            <span className="sport-card__emoji">{deporte.icono}</span>
            <span className="sport-card__name">{deporte.nombre}</span>
          </div>
          <button
            className="exercise-card__btn"
            onClick={() => onSelectSport && onSelectSport(deporte)}
          >
            + Registrar
          </button>
        </div>
      ))}
    </div>
  )
}

export default SportsCatalog