import React from 'react'

function Topbar() {
  return (
    <header className="topbar">
      <div>
        <p className="topbar__eyebrow">Martes, 11 de agosto</p>
        <h1 className="topbar__title">Buenas, Diego. Vas bien esta semana.</h1>
      </div>
      <div className="topbar__actions">
        <div className="segmented" role="tablist" aria-label="Rango de tiempo">
          <button className="segmented__item" role="tab">Semana</button>
          <button className="segmented__item segmented__item--active" role="tab" aria-selected="true">Mes</button>
          <button className="segmented__item" role="tab">Año</button>
        </div>
        <button className="btn btn--primary">
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>
          Registrar actividad
        </button>
      </div>
    </header>
  )
}

export default Topbar