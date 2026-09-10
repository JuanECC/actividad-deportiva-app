import React from 'react'

function ExerciseCard({ ejercicio, mapaMusculos, onSelect }) {
  const musculosPrincipales = (ejercicio.muscles || [])
    .map(id => mapaMusculos[id])
    .filter(Boolean)

  const musculosSecundarios = (ejercicio.muscles_secondary || [])
    .map(id => mapaMusculos[id])
    .filter(Boolean)

  // Elegir el primer músculo con grupo conocido
  const grupoPrincipal =
    musculosPrincipales.find(m => m.grupo !== 'Otro') || musculosPrincipales[0]

  const nombreMostrar =
    grupoPrincipal?.nombreEn ||
    grupoPrincipal?.nombre ||
    `Ejercicio #${ejercicio.id}`

  return (
    <div className="exercise-card">
      <div className="exercise-card__header">
        <div className="exercise-card__title">
          <span className="exercise-card__emoji">
            {grupoPrincipal?.icono || '🏋️'}
          </span>
          <span className="exercise-card__name">{nombreMostrar}</span>
        </div>
        <span className="exercise-card__category">{ejercicio.category}</span>
      </div>

      <div className="exercise-card__body">
        <div className="exercise-card__group">
          <strong>Grupo:</strong> {grupoPrincipal?.grupo || 'Sin clasificar'}
        </div>
        <p className="exercise-card__detail">
          <strong>Músculos:</strong>{' '}
          {musculosPrincipales.length > 0
            ? musculosPrincipales.map(m => m.nombreEn || m.nombre).join(', ')
            : 'No especificados'}
        </p>
        {musculosSecundarios.length > 0 && (
          <p className="exercise-card__detail">
            <strong>Secundarios:</strong>{' '}
            {musculosSecundarios.map(m => m.nombreEn || m.nombre).join(', ')}
          </p>
        )}
      </div>

      <button
        className="exercise-card__btn"
        onClick={() => onSelect && onSelect(ejercicio)}
      >
        + Registrar
      </button>
    </div>
  )
}

export default ExerciseCard