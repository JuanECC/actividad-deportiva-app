import { useState, useRef } from 'react'
import { fechasPlan, fechaLocal, progresoPlan } from '../utils/actividad'
import { mensajeError } from '../utils/errores'
import { useConfirmacion } from '../context/useConfirmacion'
export default function Progreso({
  planes,
  sesiones,
  desmarcarSesion,
  onRegistrarSesion,
  loading,
  error,
}) {
  const confirmar = useConfirmacion()
  const [pending, setPending] = useState(''),
    [failure, setFailure] = useState(''),
    busy = useRef(false)
  const toggle = async (plan, date, done) => {
    if (busy.current) return
    if (!done) {
      onRegistrarSesion({
        ...plan,
        id: undefined,
        esPlan: false,
        planId: plan.id,
        fecha: date,
        diasSeleccionados: [],
        semanas: 1,
      })
      return
    }
    if (!(await confirmar('¿Quitar las sesiones de este día del historial? Esta acción no se puede deshacer.')))
      return
    busy.current = true
    setPending(plan.id + date)
    setFailure('')
    try {
      await desmarcarSesion(plan, date)
    } catch (e) {
      setFailure(mensajeError(e, 'No se pudo actualizar la sesión.'))
    } finally {
      busy.current = false
      setPending('')
    }
  }
  if (loading) return <p role="status">Cargando planes…</p>
  if (error) return <p role="alert">{error}</p>
  return (
    <section aria-label="Calendario de planes">
      <h2>Calendario de actividades</h2>
      {failure && (
        <p className="login-error" role="alert">
          {failure}
        </p>
      )}
      {!planes.length && (
        <p>
          No tienes planes. Selecciona días al registrar una actividad para
          crear uno.
        </p>
      )}
      <div className="planes-list">
        {planes.map((plan) => {
          const progress = progresoPlan(plan, sesiones),
            dates = fechasPlan(plan),
            months = [...new Set(dates.map((f) => f.slice(0, 7)))]
          return (
            <article className="plan-calendar" key={plan.id}>
              <h3>
                {plan.nombre}
                {progress.completado ? ' · Completado' : ''}
              </h3>
              <p>
                {progress.completadas} de {progress.total} sesiones
              </p>
              {months.map((month) => (
                <section key={month}>
                  <h4>
                    {new Date(month + '-01T12:00:00').toLocaleDateString(
                      'es-MX',
                      { month: 'long', year: 'numeric' },
                    )}
                  </h4>
                  <div className="plan-calendar__grid">
                    {dates
                      .filter((d) => d.startsWith(month))
                      .map((date) => {
                        const done = sesiones.some(
                            (s) =>
                              s.planId === plan.id &&
                              fechaLocal(s.fecha) === date,
                          ),
                          label = new Date(
                            date + 'T12:00:00',
                          ).toLocaleDateString('es-MX', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })
                        return (
                          <button
                            key={date}
                            className={
                              'plan-day ' + (done ? 'plan-day--done' : '')
                            }
                            aria-pressed={done}
                            aria-label={
                              (done ? 'Desmarcar ' : 'Completar ') + label
                            }
                            disabled={!!pending || date > fechaLocal()}
                            onClick={() => toggle(plan, date, done)}
                          >
                            {pending === plan.id + date ? '…' : label}
                          </button>
                        )
                      })}
                  </div>
                </section>
              ))}
            </article>
          )
        })}
      </div>
    </section>
  )
}
