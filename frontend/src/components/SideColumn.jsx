import React, { useMemo } from 'react'
import { useSueno } from '../hooks/useSueno'

function calcularDistancia(act) {
  if (act.tipo === 'strength' || act.tipo === 'sport') return 0
  const valor = parseFloat(String(act.distancia).replace(',', '.'))
  if (isNaN(valor)) return 0
  if (act.tipo === 'swim') return valor / 1000
  return valor
}

function filtrarPorRango(actividades, rango) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const finHoy = new Date()
  finHoy.setHours(23, 59, 59, 999)

  if (rango === 'Semana') {
    const diaSemana = hoy.getDay() || 7
    const inicio = new Date(hoy)
    inicio.setDate(hoy.getDate() - (diaSemana - 1))
    return actividades.filter(act => {
      const f = new Date(act.fecha)
      return f >= inicio && f <= finHoy
    })
  }

  if (rango === 'Mes') {
    return actividades.filter(act => {
      const f = new Date(act.fecha)
      return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear()
    })
  }

  if (rango === 'Año') {
    return actividades.filter(act => {
      const f = new Date(act.fecha)
      return f.getFullYear() === hoy.getFullYear()
    })
  }

  return actividades
}

function SideColumn({ actividades, rangoActivo }) {
  const filtradas = filtrarPorRango(actividades, rangoActivo)
  const { registros: suenoRegistros } = useSueno()

  const objetivos = useMemo(() => {
    const distanciaTotal = filtradas.reduce((sum, act) => sum + calcularDistancia(act), 0)
    const sesionesFuerza = filtradas.filter(act => act.tipo === 'strength').length

    const metaDistancia = distanciaTotal > 0 ? Math.max(50, Math.ceil(distanciaTotal * 1.5)) : 100
    const metaFuerza = sesionesFuerza > 0 ? Math.max(4, sesionesFuerza + 4) : 8

    const hoy = new Date()
    const horasSuenio = suenoRegistros
      .filter(r => {
        const f = new Date(r.fecha)
        return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear()
      })
      .reduce((sum, r) => sum + (r.duracionMinutos || 0) / 60, 0)

    return {
      distancia: { actual: Math.round(distanciaTotal), meta: metaDistancia },
      fuerza: { actual: sesionesFuerza, meta: metaFuerza },
      suenio: { actual: Math.round(horasSuenio), meta: 30 }
    }
  }, [filtradas, suenoRegistros])

  const records = useMemo(() => {
    const agrupar = (lista) => {
      const grupos = {}
      lista.forEach(act => {
        const clave = act.deporte || act.tipo || 'otro'
        if (!grupos[clave]) {
          grupos[clave] = {
            nombre: clave,
            tipo: act.tipo,
            distanciaTotal: 0,
            sesiones: 0,
            rondas: 0,
            tiempoTotal: 0
          }
        }

        if (act.tipo === 'strength') {
          if (act.modoFuerza === 'tiempo') {
            grupos[clave].tiempoTotal += parseFloat(act.distancia) || 0
          } else {
            grupos[clave].rondas += parseFloat(act.distancia) || 0
          }
        } else {
          grupos[clave].distanciaTotal += calcularDistancia(act)
        }
        grupos[clave].sesiones += 1
      })
      return Object.values(grupos)
    }

    const resumen = agrupar(filtradas)

    const recordsFinal = resumen.map(d => {
      if (d.tipo === 'strength') {
        if (d.tiempoTotal > 0) {
          return { label: d.nombre, value: `${d.tiempoTotal} min`, date: `${d.sesiones} sesión(es)` }
        }
        return { label: d.nombre, value: `${d.rondas} rondas`, date: `${d.sesiones} sesión(es)` }
      }
      return { label: d.nombre, value: `${d.distanciaTotal.toFixed(1)} km`, date: `${d.sesiones} sesión(es)` }
    })

    if (recordsFinal.length === 0) {
      recordsFinal.push({ label: 'Sin récords', value: '—', date: '—' })
    }

    return recordsFinal.slice(0, 4)
  }, [filtradas])

  return (
    <div className="side-col">
      <section className="panel" aria-label="Objetivos del mes">
        <div className="panel__header">
          <h2 className="panel__title">Objetivos del mes</h2>
        </div>

        <div className="goal">
          <div className="goal__top">
            <span className="goal__name">Distancia mensual</span>
            <span className="goal__value">{objetivos.distancia.actual} / {objetivos.distancia.meta} km</span>
          </div>
          <div className="progress">
            <span
              className="progress__fill"
              style={{ '--p': Math.min((objetivos.distancia.actual / objetivos.distancia.meta) * 100, 100) + '%' }}
            ></span>
          </div>
        </div>

        <div className="goal">
          <div className="goal__top">
            <span className="goal__name">Sesiones de fuerza</span>
            <span className="goal__value">{objetivos.fuerza.actual} / {objetivos.fuerza.meta} sesiones</span>
          </div>
          <div className="progress">
            <span
              className="progress__fill"
              style={{ '--p': Math.min((objetivos.fuerza.actual / objetivos.fuerza.meta) * 100, 100) + '%' }}
            ></span>
          </div>
        </div>

        <div className="goal">
          <div className="goal__top">
            <span className="goal__name">Horas de sueño activo</span>
            <span className="goal__value">{objetivos.suenio.actual} / {objetivos.suenio.meta} hrs</span>
          </div>
          <div className="progress">
            <span
              className="progress__fill progress__fill--low"
              style={{ '--p': Math.min((objetivos.suenio.actual / objetivos.suenio.meta) * 100, 100) + '%' }}
            ></span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '4px' }}>
            Registra tus horas de sueño próximamente
          </p>
        </div>
      </section>

      <section className="panel panel--records" aria-label="Récords personales">
        <div className="panel__header">
          <h2 className="panel__title">Récords personales</h2>
        </div>

        <ul className="records">
          {records.map((record, index) => (
            <li key={index} className="records__row">
              <span className="records__label">{record.label}</span>
              <span className="records__value">{record.value}</span>
              <span className="records__date">{record.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default SideColumn