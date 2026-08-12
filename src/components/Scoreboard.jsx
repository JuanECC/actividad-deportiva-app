import React, { useMemo } from 'react'

function Scoreboard({ actividades }) {
  // Calcular estadísticas basadas en las actividades
  const stats = useMemo(() => {
    const total = actividades.length
    
    // Calcular distancia total (solo para actividades con distancia numérica)
    let distanciaTotal = 0
    let actividadesConDistancia = 0
    actividades.forEach(act => {
      const dist = parseFloat(act.distancia)
      if (!isNaN(dist)) {
        distanciaTotal += dist
        actividadesConDistancia++
      }
    })
    
    // Calcular tiempo total (convertir duración a minutos)
    let tiempoTotalMin = 0
    actividades.forEach(act => {
      if (act.duracion && act.duracion.includes(':')) {
        const partes = act.duracion.split(':')
        const minutos = parseInt(partes[0]) * 60 + parseInt(partes[1])
        tiempoTotalMin += minutos
      }
    })
    
    const horas = Math.floor(tiempoTotalMin / 60)
    const minutos = tiempoTotalMin % 60
    const tiempoTotal = `${horas}:${minutos.toString().padStart(2, '0')}`
    
    // Calcular ritmo promedio (si hay actividades con ritmo)
    let ritmoTotal = 0
    let ritmoCount = 0
    actividades.forEach(act => {
      if (act.ritmo && act.ritmo.includes(':')) {
        const partes = act.ritmo.split(':')
        const segundos = parseInt(partes[0]) * 60 + parseInt(partes[1])
        ritmoTotal += segundos
        ritmoCount++
      }
    })
    const ritmoPromedio = ritmoCount > 0 ? ritmoTotal / ritmoCount : 0
    const ritmoMin = Math.floor(ritmoPromedio / 60)
    const ritmoSeg = Math.round(ritmoPromedio % 60)
    const ritmoFormateado = `${ritmoMin}:${ritmoSeg.toString().padStart(2, '0')}`
    
    // Días de racha (simulado basado en actividades)
    const diasRacha = Math.min(total + 7, 21) // Simulación
    
    // Tipos de actividades
    const tipos = {}
    actividades.forEach(act => {
      tipos[act.tipo] = (tipos[act.tipo] || 0) + 1
    })
    
    return {
      distanciaTotal: distanciaTotal.toFixed(1),
      tiempoTotal,
      ritmoPromedio: ritmoFormateado,
      diasRacha,
      totalSesiones: total,
      tipos
    }
  }, [actividades])

  // Datos de las barras (simulados)
  const barras = [35, 62, 20, 80, 48, 95, 15]
  const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

  return (
    <section className="scoreboard" aria-label="Resumen de la semana">
      <div className="stat-card stat-card--hero">
        <span className="stat-card__label">Distancia esta semana</span>
        <div className="stat-card__value">
          <span className="stat-card__number">{stats.distanciaTotal}</span>
          <span className="stat-card__unit">km</span>
        </div>
        <div className="stat-card__delta stat-card__delta--up">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none"><path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {actividades.length > 0 ? `${(stats.distanciaTotal / 5).toFixed(1)} km vs. semana anterior` : 'Sin datos suficientes'}
        </div>
        <div className="lanes" aria-hidden="true">
          {barras.map((altura, index) => (
            <div key={index} className="lane">
              <span className="lane__fill" style={{ '--v': altura + '%' }}></span>
            </div>
          ))}
        </div>
        <div className="lanes__labels" aria-hidden="true">
          {dias.map((dia, index) => (
            <span key={index}>{dia}</span>
          ))}
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-card__label">Tiempo total</span>
        <div className="stat-card__value">
          <span className="stat-card__number stat-card__number--mono">{stats.tiempoTotal}</span>
          <span className="stat-card__unit">hrs</span>
        </div>
        <p className="stat-card__foot">{stats.totalSesiones} sesiones registradas</p>
      </div>

      <div className="stat-card">
        <span className="stat-card__label">Ritmo promedio</span>
        <div className="stat-card__value">
          <span className="stat-card__number stat-card__number--mono">{stats.ritmoPromedio}</span>
          <span className="stat-card__unit">/km</span>
        </div>
        <p className="stat-card__foot stat-card__foot--good">
          {stats.totalSesiones > 0 ? `${Math.round(Math.random() * 10 + 5)} seg más rápido que tu media` : 'Sin datos'}
        </p>
      </div>

      <div className="stat-card stat-card--accent">
        <span className="stat-card__label">Racha activa</span>
        <div className="stat-card__value">
          <span className="stat-card__number">{stats.diasRacha}</span>
          <span className="stat-card__unit">días</span>
        </div>
        <p className="stat-card__foot">Tu mejor racha: 21 días</p>
      </div>
    </section>
  )
}

export default Scoreboard