import React, { useState } from 'react'
import { useSueno } from '../hooks/useSueno'
import { suenoSchema, validarConZod } from '../utils/validations'

function RegistroSueno() {
  const { registros, agregarSueno, eliminarSueno } = useSueno()
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [horaDormir, setHoraDormir] = useState('23:00')
  const [horaDespertar, setHoraDespertar] = useState('07:00')
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')

    const { ok, errors } = validarConZod(suenoSchema, {
      fecha,
      horaDormir,
      horaDespertar,
    })

    if (!ok) {
      setMensaje(Object.values(errors).join(' · '))
      return
    }

    await agregarSueno({ fecha, horaDormir, horaDespertar })
    setFecha(new Date().toISOString().slice(0, 10))
    setHoraDormir('23:00')
    setHoraDespertar('07:00')
    setMensaje('Registro de sueño guardado ✅')
  }

  return (
    <div className="panel" style={{ marginTop: '16px' }}>
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

      <div className="sueno-list" style={{ marginTop: '16px' }}>
        {registros.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay registros de sueño.</p>
        ) : (
          registros.slice(0, 5).map(reg => (
            <div key={reg.id} className="sueno-item">
              <span>📅 {reg.fecha}</span>
              <span>🌙 {reg.horaDormir}</span>
              <span>☀️ {reg.horaDespertar}</span>
              <span>{Math.floor(reg.duracionMinutos / 60)}h {reg.duracionMinutos % 60}min</span>
              <span className={`calidad calidad--${reg.calidad.toLowerCase()}`}>{reg.calidad}</span>
              <button
                className="log__delete"
                onClick={() => eliminarSueno(reg.id)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RegistroSueno