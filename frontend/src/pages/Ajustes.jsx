import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Ajustes({ nombre, onGuardarNombre }) {
  const { currentUser } = useAuth()
  const [nombreInput, setNombreInput] = useState(nombre || '')
  const [mensaje, setMensaje] = useState('')

  const handleGuardar = async (e) => {
    e.preventDefault()
    if (!nombreInput.trim()) {
      setMensaje('El nombre no puede estar vacío')
      return
    }
    await onGuardarNombre(nombreInput)
    setMensaje('Nombre actualizado ✅')
  }

  return (
    <section className="panel" aria-label="Ajustes">
      <div className="panel__header">
        <h2 className="panel__title">⚙️ Ajustes</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
            Información de la cuenta
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Email: <span style={{ color: 'var(--text)' }}>{currentUser?.email}</span>
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            UID: <span style={{ color: 'var(--text)' }}>{currentUser?.uid}</span>
          </p>
        </div>

        <form onSubmit={handleGuardar} className="modal-field">
          <label htmlFor="nombre">Tu nombre</label>
          <input
            id="nombre"
            type="text"
            value={nombreInput}
            onChange={(e) => setNombreInput(e.target.value)}
            placeholder="Escribe tu nombre"
          />
          <button type="submit" className="btn btn--primary" style={{ marginTop: '8px' }}>
            Guardar nombre
          </button>
          {mensaje && <p style={{ color: 'var(--accent)', fontSize: '13px' }}>{mensaje}</p>}
        </form>
      </div>
    </section>
  )
}

export default Ajustes