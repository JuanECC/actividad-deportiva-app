import React, { useMemo } from 'react'

function Progreso({ actividades }) {
  const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

  const diasConActividad = useMemo(() => {
    const dias = new Set()
    actividades.forEach(act => {
      const fecha = new Date(act.fecha)
      const dia = diasSemana[fecha.getDay() === 0 ? 6 : fecha.getDay() - 1]
      dias.add(dia)
      // Si la actividad tiene días seleccionados, los agregamos
      if (act.diasSeleccionados && Array.isArray(act.diasSeleccionados)) {
        act.diasSeleccionados.forEach(d => dias.add(d))
      }
    })
    return dias
  }, [actividades])

  return (
    <section aria-label="Progreso">
      <div className="panel">
        <div className="panel__header">
          <h2 className="panel__title">📅 Calendario de constancia</h2>
        </div>
        <div className="calendario-check">
          {diasSemana.map(dia => (
            <div
              key={dia}
              className={`dia-check ${diasConActividad.has(dia) ? 'dia-check--activo' : ''}`}
            >
              <span className="dia-check__label">{dia}</span>
              <span className="dia-check__icon">
                {diasConActividad.has(dia) ? '✅' : '⬜'}
              </span>
            </div>
          ))}
        </div>
        <p className="calendario-nota">
          Los días marcados indican que registraste actividad o la planeaste.
        </p>
      </div>

      <div className="panel" style={{ marginTop: '16px' }}>
        <div className="panel__header">
          <h2 className="panel__title">Resumen de actividad</h2>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>
          Total de actividades: <strong>{actividades.length}</strong>
        </p>
        <p style={{ color: 'var(--text-muted)' }}>
          Días con actividad esta semana: <strong>{diasConActividad.size}/7</strong>
        </p>
      </div>
    </section>
  )
}

export default Progreso