import React, { useMemo } from 'react'

const DIAS_SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function generarFechas(plan) {
  const fechas = []
  const start = new Date(plan.fecha)
  const semanas = plan.semanas || 1
  const dias = plan.diasSeleccionados || []

  for (let semana = 0; semana < semanas; semana++) {
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + semana * 7 + i)
      const diaNombre = DIAS_SEMANA[(date.getDay() + 6) % 7]
      if (dias.includes(diaNombre)) {
        fechas.push(date.toISOString())
      }
    }
  }
  return fechas
}

function PlanCalendar({ plan, sesiones, marcarSesion, desmarcarSesion, esHistorial }) {
  const fechas = useMemo(() => generarFechas(plan), [plan])

  const estaCompletada = (fecha) => {
    const f = new Date(fecha)
    return sesiones.some(s =>
      s.planId === plan.id &&
      new Date(s.fecha).getDate() === f.getDate() &&
      new Date(s.fecha).getMonth() === f.getMonth() &&
      new Date(s.fecha).getFullYear() === f.getFullYear()
    )
  }

  return (
    <div className={`plan-calendar ${esHistorial ? 'plan-calendar--historial' : ''}`}>
      <h3>{plan.nombre}</h3>
      <p className="plan-calendar__meta">
        {plan.diasSeleccionados.join(', ')} · {plan.semanas} semana(s)
      </p>
      <div className="plan-calendar__grid">
        {fechas.map(fecha => {
          const completada = estaCompletada(fecha)
          return (
            <button
              key={fecha}
              className={`plan-day ${completada ? 'plan-day--done' : ''}`}
              onClick={() => {
                if (esHistorial) return
                completada ? desmarcarSesion(plan, fecha) : marcarSesion(plan, fecha)
              }}
              title={new Date(fecha).toLocaleDateString('es-ES')}
              disabled={esHistorial}
            >
              {new Date(fecha).getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Progreso({ planes, sesiones, marcarSesion, desmarcarSesion }) {
  const planesActivos = planes.filter(p => !p.completado)
  const planesCompletados = planes.filter(p => p.completado)

  return (
    <section aria-label="Progreso">
      <div className="panel__header">
        <h2 className="panel__title">📅 Calendario de actividades</h2>
      </div>

      {planesActivos.length === 0 && planesCompletados.length === 0 ? (
        <div className="panel">
          <p style={{ color: 'var(--text-muted)' }}>
            No tienes planes de actividad. Crea uno desde el registro con días y semanas.
          </p>
        </div>
      ) : (
        <div className="planes-list">
          {planesActivos.map(plan => (
            <PlanCalendar
              key={plan.id}
              plan={plan}
              sesiones={sesiones}
              marcarSesion={marcarSesion}
              desmarcarSesion={desmarcarSesion}
              esHistorial={false}
            />
          ))}
        </div>
      )}

      {planesCompletados.length > 0 && (
        <>
          <h2 className="panel__title" style={{ marginTop: '32px' }}>🏆 Historial de planes completados</h2>
          <div className="planes-list" style={{ marginTop: '16px' }}>
            {planesCompletados.map(plan => (
              <PlanCalendar
                key={plan.id}
                plan={plan}
                sesiones={sesiones}
                esHistorial={true}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default Progreso