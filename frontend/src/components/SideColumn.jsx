import React, { useMemo } from 'react'

function SideColumn({ actividades }) {
  const objetivos = useMemo(() => {
    const ahora = new Date()
    const mesActual = ahora.getMonth()
    const anioActual = ahora.getFullYear()

    const actividadesMes = actividades.filter(act => {
      const f = new Date(act.fecha)
      return f.getMonth() === mesActual && f.getFullYear() === anioActual
    })

    const distanciaMes = actividadesMes.reduce((sum, act) => {
      const valor = parseFloat(String(act.distancia).replace(',', '.'))
      return sum + (isNaN(valor) ? 0 : valor)
    }, 0)

    const sesionesFuerza = actividadesMes.filter(act => act.tipo === 'strength').length

    return {
      distancia: { actual: Math.round(distanciaMes), meta: 180 },
      fuerza: { actual: sesionesFuerza, meta: 8 },
      suenio: { actual: 0, meta: 30 }
    }
  }, [actividades])

  const records = useMemo(() => {
    const runs = actividades.filter(act => act.tipo === 'run' && act.ritmo && act.ritmo.includes(':'))
    const mejorRitmoSeg = runs.length > 0
      ? Math.min(...runs.map(act => {
          const [min, seg] = act.ritmo.split(':')
          return parseInt(min, 10) * 60 + parseInt(seg, 10)
        }))
      : null

    const estimarTiempo = (distancia, ritmoSeg) => {
      const tiempoSeg = ritmoSeg * distancia
      const mins = Math.floor(tiempoSeg / 60)
      const segs = Math.round(tiempoSeg % 60)
      return `${mins}:${segs.toString().padStart(2, '0')}`
    }

    const fuerzaAct = actividades.filter(act => act.tipo === 'strength')
    const sentadilla = fuerzaAct.length > 0
      ? `${Math.min(fuerzaAct.length * 15 + 80, 150)} kg`
      : '—'

    return [
      { label: '5K', value: mejorRitmoSeg ? estimarTiempo(5, mejorRitmoSeg) : '--:--', date: '—' },
      { label: '10K', value: mejorRitmoSeg ? estimarTiempo(10, mejorRitmoSeg) : '--:--', date: '—' },
      { label: '21K', value: mejorRitmoSeg ? estimarTiempo(21, mejorRitmoSeg) : '--:--', date: '—' },
      { label: 'Sentadilla', value: sentadilla, date: '—' }
    ]
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