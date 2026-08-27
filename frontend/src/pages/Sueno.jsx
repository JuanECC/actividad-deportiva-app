import React, { useState, useMemo } from 'react'
import { useSueno } from '../hooks/useSueno'

function Sueno() {
  const { registros, loading, error, agregarSueno, eliminarSueno } = useSueno()
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [horaDormir, setHoraDormir] = useState('23:00')
  const [horaDespertar, setHoraDespertar] = useState('07:00')
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')
    if (!fecha || !horaDormir || !horaDespertar) {
      setMensaje('Completa todos los campos')
      return
    }
    await agregarSueno({ fecha, horaDormir, horaDespertar })
    setFecha(new Date().toISOString().slice(0, 10))
    setHoraDormir('23:00')
    setHoraDespertar('07:00')
    setMensaje('Registro de sueño guardado ✅')
  }

  const resumen = useMemo(() => {
    if (registros.length === 0) return null
    const totalMin = registros.reduce((sum, r) => sum + (r.duracionMinutos || 0), 0)
    const promedioMin = Math.round(totalMin / registros.length)
    const calidadPromedio = promedioMin >= 480 ? 'Excelente' : promedioMin >= 360 ? 'Buena' : promedioMin >= 240 ? 'Regular' : 'Pobre'
    const ultima = registros[0]
    return {
      totalRegistros: registros.length,
      promedioMin,
      calidadPromedio,
      ultima
    }
  }, [registros])

  return (
    <section aria-label="Registro de sueño">
      <div className="panel">
        <div className="panel__header">
          <h2 className="panel__title">😴 Registro de sueño</h2>
        </div>

        <form onSubmit={handleSubmit} className="sueno-form">
          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="fechaSueno">Fecha</label>
              <input
                id="fechaSueno"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label htmlFor="horaDormir">Hora de dormir</label>
              <input
                id="horaDormir"
                type="time"
                value={horaDormir}
                onChange={(e) => setHoraDormir(e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label htmlFor="horaDespertar">Hora de despertar</label>
              <input
                id="horaDespertar"
                type="time"
                value={horaDespertar}
                onChange={(e) => setHoraDespertar(e.target.value)}
              />
            </div>
          </div>

          {mensaje && <p className="sueno-mensaje">{mensaje}</p>}

          <button type="submit" className="btn btn--primary" style={{ marginTop: '12px' }}>
            Guardar sueño
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando registros...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>⚠️ Error: {error}</p>
        </div>
      ) : (
        <>
          {resumen && (
            <div className="panel" style={{ marginTop: '16px' }}>
              <div className="panel__header">
                <h2 className="panel__title">Resumen</h2>
              </div>
              <div className="sueno-resumen">
                <p>Total de registros: <strong>{resumen.totalRegistros}</strong></p>
                <p>Promedio de sueño: <strong>{Math.floor(resumen.promedioMin / 60)}h {resumen.promedioMin % 60}min</strong></p>
                <p>Calidad promedio: <strong>{resumen.calidadPromedio}</strong></p>
                <p>Último registro: <strong>{resumen.ultima.fecha}</strong> ({resumen.ultima.horaDormir} → {resumen.ultima.horaDespertar})</p>
              </div>
            </div>
          )}

          <div className="panel" style={{ marginTop: '16px' }}>
            <div className="panel__header">
              <h2 className="panel__title">Historial reciente</h2>
            </div>
            {registros.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No hay registros de sueño.</p>
            ) : (
              <div className="sueno-list">
                {registros.slice(0, 10).map(reg => (
                  <div key={reg.id} className="sueno-item">
                    <span>📅 {reg.fecha}</span>
                    <span>🌙 {reg.horaDormir}</span>
                    <span>☀️ {reg.horaDespertar}</span>
                    <span>{Math.floor(reg.duracionMinutos / 60)}h {reg.duracionMinutos % 60}min</span>
                    <span className={`calidad calidad--${reg.calidad.toLowerCase()}`}>{reg.calidad}</span>
                    <button className="log__delete" onClick={() => eliminarSueno(reg.id)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default Sueno