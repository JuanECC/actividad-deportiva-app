import React, { useMemo } from 'react'

function calcularDistancia(act) {
  if (act.tipo === 'strength' || act.tipo === 'sport') return 0
  const valor = parseFloat(String(act.distancia).replace(',', '.'))
  if (isNaN(valor)) return 0
  if (act.tipo === 'swim') return valor / 1000
  return valor
}

function SideColumn({ actividades }) {
  const objetivos = useMemo(() => {
    const ahora = new Date()
    const mesActual = ahora.getMonth()
    const anioActual = ahora.getFullYear()

    const actividadesMes = actividades.filter(act => {
      const f = new Date(act.fecha)
      return f.getMonth() === mesActual && f.getFullYear() === anioActual
    })

    const distanciaMes = actividadesMes.reduce((sum, act) => sum + calcularDistancia(act), 0)

    const sesionesFuerza = actividadesMes.filter(act => act.tipo === 'strength').length

    // Meta elegida según actividad: si hay más de 3 sesiones, meta mayor
    const metaDistancia = distanciaMes > 0 ? Math.max(50, Math.ceil(distanciaMes * 1.5)) : 100
    const metaFuerza = sesionesFuerza > 0 ? Math.max(4, sesionesFuerza + 4) : 8

    return {
      distancia: { actual: Math.round(distanciaMes), meta: metaDistancia },
      fuerza: { actual: sesionesFuerza, meta: metaFuerza },
      suenio: { actual: 0, meta: 30 }
    }
  }, [actividades])

  const records = useMemo(() => {
    const ahora = new Date()
    const mesActual = ahora.getMonth()
    const anioActual = ahora.getFullYear()
    const mesAnterior = mesActual === 0 ? 11 : mesActual - 1
    const anioAnterior = mesActual === 0 ? anioActual - 1 : anioActual

    const actMes = actividades.filter(act => {
      const f = new Date(act.fecha)
      return f.getMonth() === mesActual && f.getFullYear() === anioActual
    })

    const actMesAnterior = actividades.filter(act => {
      const f = new Date(act.fecha)
      return f.getMonth() === mesAnterior && f.getFullYear() === anioAnterior
    })

    const agruparPorDeporte = (lista) => {
      const grupos = {}
      lista.forEach(act => {
        const clave = act.deporte || act.tipo || 'otro'
        if (!grupos[clave]) {
          grupos[clave] = {
            nombre: clave,
            distanciaTotal: 0,
            duracionMax: 0,
            sesiones: 0
          }
        }
        grupos[clave].distanciaTotal += calcularDistancia(act)
        grupos[clave].duracionMax = Math.max(grupos[clave].duracionMax, act.duracion || 0)
        grupos[clave].sesiones += 1
      })
      return Object.values(grupos)
    }

    const resumenMes = agruparPorDeporte(actMes)
    const resumenMesAnterior = agruparPorDeporte(actMesAnterior)

    const recordsFinal = resumenMes.map(deporteActual => {
      const anterior = resumenMesAnterior.find(d => d.nombre === deporteActual.nombre)
      return {
        label: deporteActual.nombre,
        value: `${deporteActual.distanciaTotal.toFixed(1)} km`,
        date: anterior
          ? `vs ${anterior.distanciaTotal.toFixed(1)} km`
          : 'Nuevo'
      }
    })

    if (recordsFinal.length === 0) {
      recordsFinal.push({ label: 'Sin récords', value: '—', date: '—' })
    }

    return recordsFinal.slice(0, 4)
  }, [actividades])

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
              style={{ '--p': 0 + '%' }}
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