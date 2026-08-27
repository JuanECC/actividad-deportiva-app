import React, { useMemo } from 'react'

function calcularDistancia(act) {
  if (act.tipo === 'strength' || act.tipo === 'sport') return 0
  const valor = parseFloat(String(act.distancia).replace(',', '.'))
  if (isNaN(valor)) return 0
  if (act.tipo === 'swim') return valor / 1000
  return valor
}

function parsearDuracion(duracion) {
  if (!duracion) return 0
  const v = String(duracion).trim().toLowerCase()
  const partes = v.split(':')
  if (partes.length === 2) {
    const horas = parseInt(partes[0], 10)
    const minutos = parseInt(partes[1], 10) || 0
    return horas * 60 + minutos
  }
  let total = 0
  const matchH = v.match(/(\d+)\s*(h|hr|hrs|horas?)/)
  if (matchH) total += parseInt(matchH[1], 10) * 60
  const matchM = v.match(/(\d+)\s*(min|mins?)/)
  if (matchM) total += parseInt(matchM[1], 10)
  return total
}

function Scoreboard({ actividades, rangoActivo }) {
  const stats = useMemo(() => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const finHoy = new Date()
    finHoy.setHours(23, 59, 59, 999)

    const diaSemana = hoy.getDay() || 7
    const inicioSemana = new Date(hoy)
    inicioSemana.setDate(hoy.getDate() - (diaSemana - 1))

    const finSemanaAnterior = new Date(inicioSemana)
    finSemanaAnterior.setDate(inicioSemana.getDate() - 1)
    const inicioSemanaAnterior = new Date(finSemanaAnterior)
    inicioSemanaAnterior.setDate(inicioSemanaAnterior.getDate() - 6)

    const filtrarPorRango = (lista, rango) => {
      if (rango === 'Semana') {
        return lista.filter(act => {
          const f = new Date(act.fecha)
          return f >= inicioSemana && f <= finHoy
        })
      }
      if (rango === 'Mes') {
        return lista.filter(act => {
          const f = new Date(act.fecha)
          return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear()
        })
      }
      if (rango === 'Año') {
        return lista.filter(act => {
          const f = new Date(act.fecha)
          return f.getFullYear() === hoy.getFullYear()
        })
      }
      return lista
    }

    const actividadesFiltradas = filtrarPorRango(actividades, rangoActivo)

    const actSemana = actividades.filter(act => {
      const f = new Date(act.fecha)
      return f >= inicioSemana && f <= finHoy
    })
    const actSemanaAnterior = actividades.filter(act => {
      const f = new Date(act.fecha)
      return f >= inicioSemanaAnterior && f <= finSemanaAnterior
    })

    const distanciaSemana = actSemana.reduce((sum, act) => sum + calcularDistancia(act), 0)
    const distanciaSemanaAnterior = actSemanaAnterior.reduce((sum, act) => sum + calcularDistancia(act), 0)

    const tiempoTotalMin = actividadesFiltradas.reduce((sum, act) => sum + parsearDuracion(act.duracion), 0)
    const horas = Math.floor(tiempoTotalMin / 60)
    const minutos = Math.round(tiempoTotalMin % 60)
    const tiempoTotal = `${horas}h ${minutos.toString().padStart(2, '0')}min`

    const ritmos = actividadesFiltradas
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
      const d = new Date(inicioSemana)
      d.setDate(inicioSemana.getDate() + i)
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
      totalSesiones: actividadesFiltradas.length,
      barras,
      dias
    }
  }, [actividades, rangoActivo])

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
        <p className="stat-card__foot">Basado en {stats.totalSesiones} actividad(es)</p>
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