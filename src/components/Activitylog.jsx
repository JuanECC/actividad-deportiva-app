import React from 'react'

function ActivityLog({ actividades, onEliminar }) {
  const iconMap = {
    run: <svg viewBox="0 0 24 24" fill="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" fill="currentColor"/></svg>,
    bike: <svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="17" r="3.2" stroke="currentColor" strokeWidth="2"/><circle cx="18" cy="17" r="3.2" stroke="currentColor" strokeWidth="2"/><path d="M6 17 10 8h4l3 5M10 8l2 4h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    swim: <svg viewBox="0 0 24 24" fill="none"><path d="M2 16c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="17" cy="6" r="1.6" fill="currentColor"/><path d="M9 12l4-3 2 2-3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    strength: <svg viewBox="0 0 24 24" fill="none"><path d="M3 12h2M19 12h2M6 8v8M18 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
  }

  const handleEliminar = (id, nombre) => {
    if (window.confirm(`¿Eliminar "${nombre}"?`)) {
      onEliminar(id)
    }
  }

  if (actividades.length === 0) {
    return (
      <section className="panel panel--log" aria-label="Actividades recientes">
        <div className="panel__header">
          <h2 className="panel__title">Actividades recientes</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          <p>No hay actividades registradas</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            ¡Registra tu primera actividad!
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="panel panel--log" aria-label="Actividades recientes">
      <div className="panel__header">
        <h2 className="panel__title">Actividades recientes</h2>
        <a className="panel__link" href="#">Ver todas</a>
      </div>

      <ul className="log">
        {actividades.map((act) => (
          <li key={act.id} className="log__row">
            <span className={`log__icon log__icon--${act.tipo}`} aria-hidden="true">
              {iconMap[act.tipo] || iconMap.run}
            </span>
            <div className="log__info">
              <span className="log__name">{act.nombre}</span>
              <span className="log__meta">{act.meta}</span>
            </div>
            <span className="log__stat">{act.distancia}</span>
            <span className="log__stat log__stat--mono">{act.duracion}</span>
            <span className="log__stat log__stat--mono">{act.ritmo}</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className={`tag ${act.tagType === 'pr' ? 'tag--pr' : ''}`}>
                {act.tag}
              </span>
              <button 
                onClick={() => handleEliminar(act.id, act.nombre)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-faint)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--alert)'
                  e.target.style.background = 'rgba(255,91,60,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--text-faint)'
                  e.target.style.background = 'transparent'
                }}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ActivityLog