import React from 'react'
import { useSports } from '../hooks/useSports'
import { traducirDeporte } from '../utils/traducciones'

const mapearTipoDeporte = (sportName = '') => {
  const name = sportName.toLowerCase()
  if (name.includes('swim')) return 'swim'
  if (name.includes('cycl') || name.includes('bike')) return 'bike'
  if (name.includes('run') || name.includes('athlet')) return 'run'
  return 'strength'
}

function SportsCatalog({ onSelectSport }) {
  const { sports, loading, error } = useSports()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando deportes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p>⚠️ Error al cargar deportes: {error}</p>
      </div>
    )
  }

  return (
    <div className="sports-grid">
      {sports.length > 0 ? (
        sports.map(sport => {
          const nombreEspanol = traducirDeporte(sport.strSport)
          return (
            <div key={sport.idSport} className="sport-card">
              <div className="sport-card__header">
                <img 
                  src={sport.strSportThumb || '/icons.svg'} 
                  alt={nombreEspanol}
                  className="sport-card__image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100/191b16/cbff4d?text=SPORT'
                  }}
                />
                <span className="sport-card__name">{nombreEspanol}</span>
                {nombreEspanol !== sport.strSport && (
                  <span className="sport-card__original">{sport.strSport}</span>
                )}
              </div>
              <button
                className="exercise-card__btn"
                onClick={() => onSelectSport && onSelectSport({
                  ...sport,
                  strSportEs: nombreEspanol
                })}
              >
                + Registrar
              </button>
            </div>
          )
        })
      ) : (
        <p style={{ color: 'var(--text-muted)' }}>No se encontraron deportes.</p>
      )}
    </div>
  )
}

export default SportsCatalog