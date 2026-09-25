import { useSueno } from '../hooks/useSueno'
import {
  filtrarRango,
  distanciaKm,
  minutosActividad,
  duracionTexto,
  fechaLocal,
} from '../utils/actividad'
export default function SideColumn({ actividades, metas, ahora = new Date() }) {
  const { registros, error, loading } = useSueno()
  const month = filtrarRango(actividades, 'Mes', ahora)
  const goals = [
    [
      'Distancia mensual',
      month.reduce((s, a) => s + distanciaKm(a), 0),
      metas.distancia,
      'km',
    ],
    [
      'Sesiones de fuerza',
      month.filter((a) => a.tipo === 'strength').length,
      metas.fuerza,
      'sesiones',
    ],
    [
      'Sueño registrado en el mes',
      filtrarRango(registros, 'Mes', ahora).reduce(
        (s, a) => s + (a.duracionMinutos || 0) / 60,
        0,
      ),
      metas.suenio,
      'h',
    ],
  ]
  const best = {}
  actividades.forEach((a) => {
    const distance = ['run', 'bike', 'swim'].includes(a.tipo),
      value = distance ? distanciaKm(a) : minutosActividad(a),
      key = a.deporte || a.tipo
    if (value > 0 && (!best[key] || value > best[key].value))
      best[key] = { key, value, distance, fecha: fechaLocal(a.fecha) }
  })
  return (
    <div className="side-col">
      <section className="panel">
        <h2 className="panel__title">Objetivos del mes</h2>
        <p className="help-text">Metas fijas, editables en Objetivos.</p>
        {goals.map(([label, value, target, unit], i) => (
          <div className="goal" key={label}>
            <div className="goal__top">
              <span>{label}</span>
              <span>
                {i === 2 && (loading || error)
                  ? 'No disponible'
                  : Number(value.toFixed(1)) + ' / ' + target + ' ' + unit}
              </span>
            </div>
            {!(i === 2 && (loading || error)) && (
              <div
                className="progress"
                role="progressbar"
                aria-label={label}
                aria-valuenow={Math.min(
                  100,
                  Math.round((value / target) * 100),
                )}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span
                  className="progress__fill"
                  style={{ '--p': Math.min((value / target) * 100, 100) + '%' }}
                />
              </div>
            )}
          </div>
        ))}
        {error && <p role="alert">{error}</p>}
      </section>
      <section className="panel">
        <h2 className="panel__title">Récords por sesión · Todo el historial</h2>
        <p className="help-text">
          Mayor distancia por deporte; en fuerza y otros deportes, sesión más
          larga.
        </p>
        <ul className="records">
          {Object.values(best).map((r) => (
            <li className="records__row" key={r.key}>
              <span>{r.key}</span>
              <strong>
                {r.distance
                  ? r.value.toFixed(1) + ' km'
                  : duracionTexto(r.value)}
              </strong>
              <span>{r.fecha}</span>
            </li>
          ))}
        </ul>
        {!Object.keys(best).length && <p>Aún no hay marcas registradas.</p>}
      </section>
    </div>
  )
}
