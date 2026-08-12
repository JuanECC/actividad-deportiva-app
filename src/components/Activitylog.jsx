import React from 'react'

function ActivityLog() {
  const activities = [
    { icon: 'run', name: 'Carrera matutina — Parque Central', meta: 'Hoy · 06:42 a. m.', stat1: '8.4 km', stat2: '42:10', stat3: '5:01 /km', tag: 'Récord', tagType: 'pr' },
    { icon: 'bike', name: 'Rodaje suave — Ruta del río', meta: 'Ayer · 05:15 p. m.', stat1: '24.1 km', stat2: '58:32', stat3: '24.7 km/h', tag: 'Recuperación', tagType: '' },
    { icon: 'swim', name: 'Natación — Alberca municipal', meta: 'Lun · 07:00 a. m.', stat1: '1,800 m', stat2: '38:00', stat3: '2:07 /100m', tag: 'Técnica', tagType: '' },
    { icon: 'strength', name: 'Fuerza — Tren inferior', meta: 'Dom · 06:30 p. m.', stat1: '5 ejerc.', stat2: '51:00', stat3: '4,200 kg', tag: 'Volumen', tagType: '' },
    { icon: 'run', name: 'Intervalos — Pista atlética', meta: 'Sáb · 08:10 a. m.', stat1: '10.2 km', stat2: '47:55', stat3: '4:41 /km', tag: 'Velocidad', tagType: '' },
  ]

  const iconMap = {
    run: <svg viewBox="0 0 24 24" fill="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" fill="currentColor"/></svg>,
    bike: <svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="17" r="3.2" stroke="currentColor" strokeWidth="2"/><circle cx="18" cy="17" r="3.2" stroke="currentColor" strokeWidth="2"/><path d="M6 17 10 8h4l3 5M10 8l2 4h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    swim: <svg viewBox="0 0 24 24" fill="none"><path d="M2 16c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="17" cy="6" r="1.6" fill="currentColor"/><path d="M9 12l4-3 2 2-3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    strength: <svg viewBox="0 0 24 24" fill="none"><path d="M3 12h2M19 12h2M6 8v8M18 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  }

  return (
    <section className="panel panel--log" aria-label="Actividades recientes">
      <div className="panel__header">
        <h2 className="panel__title">Actividades recientes</h2>
        <a className="panel__link" href="#">Ver todas</a>
      </div>

      <ul className="log">
        {activities.map((act, index) => (
          <li key={index} className="log__row">
            <span className={`log__icon log__icon--${act.icon}`} aria-hidden="true">
              {iconMap[act.icon]}
            </span>
            <div className="log__info">
              <span className="log__name">{act.name}</span>
              <span className="log__meta">{act.meta}</span>
            </div>
            <span className="log__stat">{act.stat1}</span>
            <span className="log__stat log__stat--mono">{act.stat2}</span>
            <span className="log__stat log__stat--mono">{act.stat3}</span>
            <span className={`tag ${act.tagType === 'pr' ? 'tag--pr' : ''}`}>{act.tag}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ActivityLog