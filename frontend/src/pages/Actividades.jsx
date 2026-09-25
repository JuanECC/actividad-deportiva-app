import { useState, useRef } from 'react'
import ActivityLog from '../components/ActivityLog'
import SportsCatalog from '../components/SportsCatalog'
import GymCatalog from '../components/GymCatalog'
import { progresoPlan } from '../utils/actividad'
import { mensajeError } from '../utils/errores'
import { useConfirmacion } from '../context/useConfirmacion'
export default function Actividades({
  actividades,
  onEliminar,
  onEditar,
  loading,
  error,
  onRegistrarActividad,
}) {
  const confirmar = useConfirmacion()
  const [tab, setTab] = useState('deportes'),
    [pending, setPending] = useState(null),
    [failure, setFailure] = useState(''),
    busy = useRef(false)
  const planes = actividades.filter((a) => a.esPlan),
    sessions = actividades.filter((a) => !a.esPlan)
  const remove = async (p) => {
    if (
      busy.current ||
      !(await confirmar(
        '¿Eliminar el plan "' +
          p.nombre +
          '"? Las sesiones realizadas se conservarán en el historial.',
      ))
    )
      return
    busy.current = true
    setPending(p.id)
    setFailure('')
    try {
      await onEliminar(p.id)
    } catch (e) {
      setFailure(mensajeError(e, 'No se pudo eliminar el plan.'))
    } finally {
      busy.current = false
      setPending(null)
    }
  }
  return (
    <section>
      <h2>Actividades y planes</h2>
      {failure && <p role="alert">{failure}</p>}
      {loading ? (
        <p role="status">Cargando actividades…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          <div className="panel">
            <h3>Planes</h3>
            {!planes.length && <p>Aún no tienes planes.</p>}
            {planes.map((p) => {
              const s = progresoPlan(p, sessions)
              return (
                <article className="plan-resumen" key={p.id}>
                  <h3>{p.nombre}</h3>
                  <p>
                    {s.completadas} de {s.total} sesiones ·{' '}
                    {s.completado ? 'Completado' : 'En curso'}
                  </p>
                  <div className="progress">
                    <span
                      className="progress__fill"
                      style={{
                        '--p':
                          (s.total ? (s.completadas / s.total) * 100 : 0) + '%',
                      }}
                    />
                  </div>
                  <button
                    onClick={() => onEditar(p)}
                    disabled={pending !== null}
                  >
                    Editar
                  </button>
                  <button onClick={() => remove(p)} disabled={pending !== null}>
                    {pending === p.id ? 'Eliminando…' : 'Eliminar plan'}
                  </button>
                </article>
              )
            })}
          </div>
          <ActivityLog
            actividades={sessions}
            onEliminar={onEliminar}
            onEditar={onEditar}
          />
        </>
      )}
      <div className="panel">
        <div className="panel__header">
          <h3>Catálogo</h3>
          <div className="catalog-tabs">
            {['deportes', 'gimnasio'].map((t) => (
              <button
                key={t}
                aria-pressed={tab === t}
                className={
                  'catalog-tab ' + (tab === t ? 'catalog-tab--active' : '')
                }
                onClick={() => setTab(t)}
              >
                {t === 'deportes' ? 'Deportes' : 'Gimnasio'}
              </button>
            ))}
          </div>
        </div>
        {tab === 'deportes' ? (
          <SportsCatalog
            onSelectSport={(s) =>
              onRegistrarActividad({
                deporte: s.nombre,
                tipo: s.tipo,
                nombre: s.nombre,
              })
            }
          />
        ) : (
          <GymCatalog onSelect={onRegistrarActividad} />
        )}
      </div>
    </section>
  )
}
