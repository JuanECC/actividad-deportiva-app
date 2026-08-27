import React from 'react'

function ExerciseCard({ ejercicio, onSelect }) {
  return (
    <div className="exercise-card">
      <div className="exercise-card__header">
        <span className="exercise-card__name">Ejercicio #{ejercicio.id}</span>
        <span className="exercise-card__category">
          Cat. {ejercicio.category}
        </span>
      </div>
      <div className="exercise-card__body">
        <p className="exercise-card__detail">
          <strong>Músculos:</strong> {ejercicio.muscles?.join(', ') || 'No especificados'}
        </p>
        <p className="exercise-card__detail">
          <strong>Secundarios:</strong> {ejercicio.muscles_secondary?.join(', ') || 'No especificados'}
        </p>
        <p className="exercise-card__detail">
          <strong>Equipo:</strong> {ejercicio.equipment?.join(', ') || 'Sin equipamiento'}
        </p>
        <button 
          className="exercise-card__btn"
          onClick={() => onSelect && onSelect(ejercicio)}
        >
          + Registrar
        </button>
      </div>
    </div>
  )
}

export default ExerciseCard