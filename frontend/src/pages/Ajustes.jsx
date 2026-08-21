// frontend/src/pages/Ajustes.jsx
import React from 'react'
import { useAuth } from '../context/AuthContext'

function Ajustes() {
  const { currentUser } = useAuth()

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
        
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
            Preferencias
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Las opciones de personalización estarán disponibles próximamente.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Ajustes