import {
  filtrarRango,
  resumenActividades,
  rachaActual,
  resumenPeriodo,
} from '../utils/actividad'
import { duracionTexto } from '../utils/actividad'
export default function Scoreboard({
  actividades,
  rangoActivo,
  ahora = new Date(),
}) {
  const list = filtrarRango(actividades, rangoActivo, ahora),
    stats = resumenActividades(list)
  const { anterior, barras } = resumenPeriodo(actividades, rangoActivo, ahora)
  const maxDistance = Math.max(1, ...barras.map((b) => b.distancia))
  const delta = stats.distancia - anterior.distancia
  const racha = rachaActual(actividades, ahora)
  return (
    <section className="scoreboard" aria-label={'Resumen: ' + rangoActivo}>
      <div className="stat-card stat-card--hero">
        <span className="stat-card__label">Distancia · {rangoActivo}</span>
        <div className="stat-card__value">
          <span className="stat-card__number">
            {stats.distancia.toFixed(1)}
          </span>
          <span>km</span>
        </div>
        <p className="stat-card__foot">Carrera, ciclismo y natación</p>
        <p className="stat-card__delta">
          {anterior.sesiones
            ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)} km frente al periodo anterior completo`
            : 'Sin sesiones en el periodo anterior'}
        </p>
        <div
          className="distance-chart"
          role="list"
          aria-label={`Distancia por ${rangoActivo === 'Año' ? 'mes' : 'día'}`}
        >
          {barras.map((bar, index) => (
            <div
              key={bar.key}
              role="listitem"
              aria-label={`${bar.key}: ${bar.distancia.toFixed(1)} km`}
              title={`${bar.key}: ${bar.distancia.toFixed(1)} km`}
            >
              <div className="lane">
                <span
                  className="lane__fill"
                  style={{ height: `${(bar.distancia / maxDistance) * 100}%` }}
                />
              </div>
              <span>
                {barras.length <= 12 || index % 5 === 0 ? bar.label : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-card__label">Tiempo · {rangoActivo}</span>
        <strong className="stat-card__number stat-card__number--mono">
          {duracionTexto(stats.minutos)}
        </strong>
        <p>
          {stats.sesiones} {stats.sesiones === 1 ? 'sesión' : 'sesiones'}
        </p>
      </div>
      <div className="stat-card">
        <span className="stat-card__label">Ritmo de carrera</span>
        <strong className="stat-card__number stat-card__number--mono">
          {stats.ritmo}
        </strong>
        <p>
          min/km · {stats.carreras}{' '}
          {stats.carreras === 1 ? 'sesión' : 'sesiones'} de carrera
        </p>
        <p className="help-text">Tiempo total dividido entre distancia total</p>
      </div>
      <div className="stat-card stat-card--accent">
        <span className="stat-card__label">Racha actual</span>
        <strong className="stat-card__number">
          {racha} {racha === 1 ? 'día' : 'días'}
        </strong>
        <p className="help-text">
          Incluye la racha de ayer mientras aún no registras hoy.
        </p>
      </div>
    </section>
  )
}
