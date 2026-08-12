import React from 'react'

function SideColumn() {
  return (
    <div className="side-col">
      {/* Objetivos */}
      <section className="panel" aria-label="Objetivos del mes">
        <div className="panel__header">
          <h2 className="panel__title">Objetivos del mes</h2>
        </div>

        <div className="goal">
          <div className="goal__top">
            <span className="goal__name">Distancia mensual</span>
            <span className="goal__value">142 / 180 km</span>
          </div>
          <div className="progress">
            <span className="progress__fill" style={{ '--p': '79%' }}></span>
          </div>
        </div>

        <div className="goal">
          <div className="goal__top">
            <span className="goal__name">Sesiones de fuerza</span>
            <span className="goal__value">6 / 8 sesiones</span>
          </div>
          <div className="progress">
            <span className="progress__fill" style={{ '--p': '75%' }}></span>
          </div>
        </div>

        <div className="goal">
          <div className="goal__top">
            <span className="goal__name">Horas de sueño activo</span>
            <span className="goal__value">18 / 30 hrs</span>
          </div>
          <div className="progress">
            <span className="progress__fill progress__fill--low" style={{ '--p': '60%' }}></span>
          </div>
        </div>
      </section>

      {/* Récords personales */}
      <section className="panel panel--records" aria-label="Récords personales">
        <div className="panel__header">
          <h2 className="panel__title">Récords personales</h2>
        </div>

        <ul className="records">
          <li className="records__row">
            <span className="records__label">5K</span>
            <span className="records__value">19:42</span>
            <span className="records__date">3 jul</span>
          </li>
          <li className="records__row">
            <span className="records__label">10K</span>
            <span className="records__value">41:05</span>
            <span className="records__date">28 jun</span>
          </li>
          <li className="records__row">
            <span className="records__label">21K</span>
            <span className="records__value">1:34:50</span>
            <span className="records__date">14 may</span>
          </li>
          <li className="records__row">
            <span className="records__label">Sentadilla</span>
            <span className="records__value">110 kg</span>
            <span className="records__date">9 ago</span>
          </li>
        </ul>
      </section>
    </div>
  )
}

export default SideColumn