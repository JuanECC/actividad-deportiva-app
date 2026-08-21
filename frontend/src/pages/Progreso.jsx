// frontend/src/pages/Progreso.jsx
import React from 'react'
import Scoreboard from '../components/Scoreboard'

function Progreso({ actividades }) {
  return (
    <section aria-label="Progreso">
      <div className="panel__header">
        <h2 className="panel__title">📈 Progreso</h2>
      </div>
      <Scoreboard actividades={actividades} />
      
      <div className="panel" style={{ marginTop: '16px' }}>
        <div className="panel__header">
          <h2 className="panel__title">Gráficos de evolución</h2>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>
          Los gráficos detallados estarán disponibles en la siguiente versión.
        </p>
      </div>
    </section>
  )
}

export default Progreso