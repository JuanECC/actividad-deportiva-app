import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { duracionTexto, minutosActividad, fechaLocal } from '../utils/actividad'
import { mensajeError } from '../utils/errores'
import { useConfirmacion } from '../context/useConfirmacion'
export default function ActivityLog({ actividades, onEliminar, onEditar }) {
  const confirmar = useConfirmacion()
  const [error, setError] = useState(''),
    [pending, setPending] = useState(null),
    [limit, setLimit] = useState(10),
    busy = useRef(false)
  const remove = async (a) => {
    if (busy.current || !(await confirmar('¿Eliminar "' + a.nombre + '"? Esta acción no se puede deshacer.'))) return
    busy.current = true
    setPending(a.id)
    setError('')
    try {
      await onEliminar(a.id)
    } catch (e) {
      setError(mensajeError(e, 'No se pudo eliminar.'))
    } finally {
      busy.current = false
      setPending(null)
    }
  }
  const metric = (a) =>
    a.tipo === 'strength'
      ? a.distancia + (a.modoFuerza === 'tiempo' ? ' min/ronda' : ' rondas')
      : a.tipo === 'sport'
        ? a.distancia
        : a.distancia + (a.tipo === 'swim' ? ' m' : ' km')
  return (
    <section className="panel panel--log" aria-label="Historial de actividades">
      <div className="panel__header">
        <h2 className="panel__title">Actividades</h2>
        <Link className="panel__link" to="/actividades">
          Ver actividades y planes
        </Link>
      </div>
      {error && (
        <p role="alert" className="login-error">
          {error}
        </p>
      )}
      {!actividades.length ? (
        <p>No hay sesiones en este periodo.</p>
      ) : (
        <ul className="log">
          {actividades.slice(0, limit).map((a) => (
            <li className="log__row" key={a.id}>
              <span className="log__icon" aria-hidden="true">
                {{
                  run: '🏃',
                  bike: '🚴',
                  swim: '🏊',
                  strength: '🏋️',
                  sport: '🏅',
                }[a.tipo] || '🏅'}
              </span>
              <div className="log__info">
                <span className="log__name" title={a.nombre}>
                  {a.nombre}
                </span>
                <span className="log__meta">
                  {fechaLocal(a.fecha)}
                  {a.planId ? ' · Sesión de plan' : ''}
                </span>
              </div>
              <div className="log__metrics">
                <span>{metric(a)}</span>
                <span>{duracionTexto(minutosActividad(a))}</span>
                {a.ritmo && (
                  <span>
                    {a.ritmo}
                    {a.tipo === 'run'
                      ? ' min/km'
                      : a.tipo === 'swim'
                        ? ' min/100m'
                        : a.tipo === 'bike'
                          ? ' km/h'
                          : ''}
                  </span>
                )}
              </div>
              <div className="log__actions">
                <span className="tag">{a.tag}</span>
                {onEditar && (
                  <button
                    disabled={pending !== null}
                    onClick={() => onEditar(a)}
                    aria-label={'Editar ' + a.nombre}
                  >
                    Editar
                  </button>
                )}
                <button
                  className="log__delete"
                  disabled={pending !== null}
                  onClick={() => remove(a)}
                  aria-label={'Eliminar ' + a.nombre}
                >
                  {pending === a.id ? '…' : '✕'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {actividades.length > limit && (
        <button className="btn" onClick={() => setLimit((n) => n + 10)}>
          Mostrar más ({actividades.length - limit})
        </button>
      )}
    </section>
  )
}
