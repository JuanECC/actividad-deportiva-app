import React, { useCallback } from 'react'

function Topbar({ onRegistrar, rangoActivo, onCambiarRango, nombreUsuario, sesionesHoy = [] }) {
  const fecha = new Date()
  const opciones = { weekday: 'long', day: 'numeric', month: 'long' }
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones)

  const hora = fecha.getHours()
  let saludo = 'Buenas'
  if (hora < 12) saludo = 'Buenos días'
  else if (hora < 20) saludo = 'Buenas tardes'
  else saludo = 'Buenas noches'

  const hayActividadHoy = sesionesHoy.length > 0
  const mensaje = hayActividadHoy
    ? `¡Hola ${nombreUsuario || 'Usuario'}! Ya completaste actividad hoy. ¡Excelente! 🎉`
    : `¡Hola ${nombreUsuario || 'Usuario'}! Aún no registras actividad hoy. ¡Vamos! 💪`

  const rangos = ['Semana', 'Mes', 'Año']

  const handleRegistrar = useCallback(() => {
    if (onRegistrar) onRegistrar()
  }, [onRegistrar])

  return (
    <header className="topbar">
      <div>
        <p className="topbar__eyebrow">{fechaFormateada}</p>
        <h1 className="topbar__title">
          {saludo}, {nombreUsuario || 'Usuario'}. {hayActividadHoy ? '¡Sigue así!' : '¡A moverse!'}
        </h1>
        <p className="topbar__mensaje">{mensaje}</p>
      </div>
      <div className="topbar__actions">
        <div className="segmented" role="tablist" aria-label="Rango de tiempo">
          {rangos.map(rango => (
            <button
              key={rango}
              className={`segmented__item ${rangoActivo === rango ? 'segmented__item--active' : ''}`}
              role="tab"
              aria-selected={rangoActivo === rango}
              onClick={() => onCambiarRango && onCambiarRango(rango)}
            >
              {rango}
            </button>
          ))}
        </div>
        <button className="btn btn--primary" onClick={handleRegistrar}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
          </svg>
          Registrar actividad
        </button>
      </div>
    </header>
  )
}

export default Topbar