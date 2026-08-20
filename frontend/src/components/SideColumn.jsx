import React, { useMemo } from 'react'

function SideColumn({ actividades }) {
  // Calcular objetivos basados en actividades
  const objetivos = useMemo(() => {
    const totalDistancia = actividades.reduce((sum, act) => {
      const dist = parseFloat(act.distancia)
      return sum + (isNaN(dist) ? 0 : dist)
    }, 0)
    
    const sesionesFuerza = actividades.filter(act => act.tipo === 'strength').length
    const sesionesTotales = actividades.length
    
    // Horas de sueño (simulado)
    const horasSuenio = Math.min(sesionesTotales * 1.5, 30)
    
    return {
      distancia: { actual: Math.round(totalDistancia), meta: 180 },
      fuerza: { actual: sesionesFuerza, meta: 8 },
      suenio: { actual: Math.round(horasSuenio), meta: 30 }
    }
  }, [actividades])

  // Récords personales (simulados o basados en datos)
  const records = useMemo(() => {
    // Buscar actividades de tipo run con datos de ritmo
    const runs = actividades.filter(act => act.tipo === 'run' && act.ritmo && act.ritmo.includes(':'))
    
    let mejor5k = '--:--'
    let mejor10k = '--:--'
    let mejor21k = '--:--'
    
    // Si hay runs, usar algunos datos simulados
    if (runs.length > 0) {
      // Usar el ritmo más rápido de las actividades de run
      const ritmos = runs.map(act => {
        const partes = act.ritmo.split(':')
        return parseInt(partes[0]) * 60 + parseInt(partes[1])
      })
      const mejorRitmo = Math.min(...ritmos)
      const min = Math.floor(mejorRitmo / 60)
      const seg = Math.round(mejorRitmo % 60)
      const ritmoBase = `${min}:${seg.toString().padStart(2, '0')}`
      
      // Estimaciones basadas en ritmo
      const estimarTiempo = (distancia) => {
        const tiempoSeg = mejorRitmo * distancia
        const mins = Math.floor(tiempoSeg / 60)
        const segs = Math.round(tiempoSeg % 60)
        return `${mins}:${segs.toString().padStart(2, '0')}`
      }
      
      mejor5k = estimarTiempo(5)
      mejor10k = estimarTiempo(10)
      mejor21k = estimarTiempo(21)
    }
    
    return [
      { label: '5K', value: mejor5k, date: '3 jul' },
      { label: '10K', value: mejor10k, date: '28 jun' },
      { label: '21K', value: mejor21k, date: '14 may' },
      { label: 'Sentadilla', value: `${Math.min(actividades.length * 15 + 80, 150)} kg`, date: '9 ago' }
    ]
  }, [actividades])

  return (
    <div className="side-col">
      {/* Objetivos */}
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
        </div>
      </section>

      {/* Récords personales */}
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