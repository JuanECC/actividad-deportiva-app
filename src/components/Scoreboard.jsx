import React from 'react'

function Scoreboard() {
  return (
    <section className="scoreboard" aria-label="Resumen de la semana">
      <div className="stat-card stat-card--hero">
        <span className="stat-card__label">Distancia esta semana</span>
        <div className="stat-card__value">
          <span className="stat-card__number">42.6</span>
          <span className="stat-card__unit">km</span>
        </div>
        <div className="stat-card__delta stat-card__delta--up">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none"><path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          8.2 km vs. semana anterior
        </div>
        <div className="lanes" aria-hidden="true">
          <div className="lane"><span className="lane__fill" style={{ '--v': '35%' }}></span></div>
          <div className="lane"><span className="lane__fill" style={{ '--v': '62%' }}></span></div>
          <div className="lane"><span className="lane__fill" style={{ '--v': '20%' }}></span></div>
          <div className="lane"><span className="lane__fill" style={{ '--v': '80%' }}></span></div>
          <div className="lane"><span className="lane__fill" style={{ '--v': '48%' }}></span></div>
          <div className="lane"><span className="lane__fill" style={{ '--v': '95%' }}></span></div>
          <div className="lane"><span className="lane__fill" style={{ '--v': '15%' }}></span></div>
        </div>
        <div className="lanes__labels" aria-hidden="true">
          <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-card__label">Tiempo total</span>
        <div className="stat-card__value">
          <span className="stat-card__number stat-card__number--mono">5:12</span>
          <span className="stat-card__unit">hrs</span>
        </div>
        <p className="stat-card__foot">6 sesiones registradas</p>
      </div>

      <div className="stat-card">
        <span className="stat-card__label">Ritmo promedio</span>
        <div className="stat-card__value">
          <span className="stat-card__number stat-card__number--mono">5:24</span>
          <span className="stat-card__unit">/km</span>
        </div>
        <p className="stat-card__foot stat-card__foot--good">12 seg más rápido que tu media</p>
      </div>

      <div className="stat-card stat-card--accent">
        <span className="stat-card__label">Racha activa</span>
        <div className="stat-card__value">
          <span className="stat-card__number">12</span>
          <span className="stat-card__unit">días</span>
        </div>
        <p className="stat-card__foot">Tu mejor racha: 21 días</p>
      </div>
    </section>
  )
}

export default Scoreboard