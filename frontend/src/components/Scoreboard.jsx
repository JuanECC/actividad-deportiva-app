import React, { useMemo } from 'react'

function calcularDistancia(act) {
  if (act.tipo === 'strength' || act.tipo === 'sport') return 0
  const valor = parseFloat(String(act.distancia).replace(',', '.'))
  if (isNaN(valor)) return 0
  if (act.tipo === 'swim') return valor / 1000
  return valor
}

function Scoreboard({ actividades }) {
  const stats = useMemo(() => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const hace7Dias = new Date(hoy)
    hace7Dias.setDate(hoy.getDate() - 6)

    const hace14Dias = new Date(hoy)
    hace14Dias.setDate(hoy.getDate() - 13)

    const filtrarPorRango = (inicio, fin) =>
      actividades.filter(act => {
        const fecha = new Date(act.fecha)
        return fecha >= inicio && fecha <= fin
      })

    const actSemana = filtrarPorRango(hace7Dias, hoy)
    const actSemanaAnterior = filtrarPorRango(hace14Dias, hace7Dias)

    const distanciaSemana = actSemana.reduce((sum, act) => sum + calcularDistancia(act), 0)
    const distanciaSemanaAnterior = actSemanaAnterior.reduce((sum, act) => sum + calcularDistancia(act), 0)

    const totalMinutos = actividades.reduce((sum, act) => {
      const duracion = String(act.duracion || '')
      const partes = duracion.split(':')
      if (partes.length >= 2) {
        const minutos = parseInt(partes[0], 10)
        const segundos = parseInt(partes[1], 10) || 0
        return sum + minutos + segundos / 60
      }
      return sum
    }, 0)

    const horas = Math.floor(totalMinutos / 60)
    const minutos = Math.round(totalMinutos % 60)
    const tiempoTotal = `${horas}h ${minutos.toString().padStart(2, '0')}min`

    const ritmos = actividades
      .filter(act => act.ritmo && act.ritmo.includes(':'))
      .map(act => {
        const [min, seg] = act.ritmo.split(':')
        return parseInt(min, 10) * 60 + parseInt(seg, 10)
      })
    const ritmoPromedioSeg = ritmos.length > 0
      ? ritmos.reduce((a, b) => a + b, 0) / ritmos.length
      : 0
    const ritmoPromedio = ritmos.length > 0
      ? `${Math.floor(ritmoPromedioSeg / 60)}:${Math.round(ritmoPromedioSeg % 60).toString().padStart(2, '0')}`
      : '--:--'

    const fechas = new Set(
      actividades.map(act => {
        const d = new Date(act.fecha)
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      })
    )
    let racha = 0
    let dia = new Date(hoy)
    while (fechas.has(`${dia.getFullYear()}-${dia.getMonth()}-${dia.getDate()}`)) {
      racha++
      dia.setDate(dia.getDate() - 1)
    }

    const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
    const distPorDia = dias.map((_, i) => {
      const d = new Date(hoy)
      d.setDate(hoy.getDate() - (6 - i))
      const actsDia = actividades.filter(act => {
        const f = new Date(act.fecha)
        return f.getDate() === d.getDate() && f.getMonth() === d.getMonth() && f.getFullYear() === d.getFullYear()
      })
      return actsDia.reduce((sum, act) => sum + calcularDistancia(act), 0)
    })
    const maxDist = Math.max(...distPorDia, 1)
    const barras = distPorDia.map(dist => (dist / maxDist) * 100)

    return {
      distanciaSemana,
      distanciaSemanaAnterior,
      tiempoTotal,
      ritmoPromedio,
      racha,
      totalSesiones: actividades.length,
      barras,
      dias
    }
  }, [actividades])

  return (
    <section className="scoreboard" aria-label="Resumen de la semana">
      <div className="stat-card stat-card--hero">
        <span className="stat-card__label">Distancia esta semana</span>
        <div className="stat-card__value">
          <span className="stat-card__number">{stats.distanciaSemana.toFixed(1)}</span>
          <span className="stat-card__unit">km</span>
        </div>
        <div className="stat-card__delta">
          {stats.distanciaSemanaAnterior > 0 ? (
            <>
              {stats.distanciaSemana > stats.distanciaSemanaAnterior
                ? `+${(stats.distanciaSemana - stats.distanciaSemanaAnterior).toFixed(1)} km vs. semana anterior`
                : `${(stats.distanciaSemana - stats.distanciaSemanaAnterior).toFixed(1)} km vs. semana anterior`}
            </>
          ) : (
            'Sin datos de la semana anterior'
          )}
        </div>
        <div className="lanes" aria-hidden="true">
          {stats.barras.map((altura, index) => (
            <div key={index} className="lane">
              <span className="lane__fill" style={{ '--v': altura + '%' }}></span>
            </div>
          ))}
        </div>
        <div className="lanes__labels" aria-hidden="true">
          {stats.dias.map((dia, index) => (
            <span key={index}>{dia}</span>
          ))}
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-card__label">Tiempo total</span>
        <div className="stat-card__value">
          <span className="stat-card__number stat-card__number--mono">{stats.tiempoTotal}</span>
        </div>
        <p className="stat-card__foot">{stats.totalSesiones} sesiones registradas</p>
      </div>

      <div className="stat-card">
        <span className="stat-card__label">Ritmo promedio</span>
        <div className="stat-card__value">
          <span className="stat-card__number stat-card__number--mono">{stats.ritmoPromedio}</span>
          <span className="stat-card__unit">/km</span>
        </div>
        <p className="stat-card__foot">Basado en {actividades.length} actividad(es)</p>
      </div>

      <div className="stat-card stat-card--accent">
        <span className="stat-card__label">Racha activa</span>
        <div className="stat-card__value">
          <span className="stat-card__number">{stats.racha}</span>
          <span className="stat-card__unit">días</span>
        </div>
        <p className="stat-card__foot">Días consecutivos con actividad</p>
      </div>
    </section>
  )
}

export default Scoreboard