// frontend/src/components/TestApi.jsx
import React, { useEffect, useState } from 'react'
import { getBackendHealth } from '../services/apiClient'

function TestApi() {
  const [backendStatus, setBackendStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const probarBackend = async () => {
      try {
        setLoading(true)
        const data = await getBackendHealth()
        console.log('✅ BACKEND conectado:', data)
        setBackendStatus(data)
      } catch (err) {
        console.error('❌ Error al conectar con backend:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    probarBackend()
  }, [])

  return (
    <div style={{ 
      padding: '20px', 
      marginTop: '20px', 
      border: '1px solid var(--border)', 
      borderRadius: '12px',
      background: 'var(--surface)'
    }}>
      <h3 style={{ marginBottom: '12px' }}>🔌 Conexión con Backend</h3>
      
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>⏳ Probando conexión...</p>
      ) : error ? (
        <p style={{ color: 'var(--alert)' }}>❌ Error: {error}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={{ color: 'var(--accent)' }}>✅ Estado: {backendStatus?.status}</p>
          <p style={{ color: 'var(--text)' }}>📝 Mensaje: {backendStatus?.message}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>🕐 Timestamp: {backendStatus?.timestamp}</p>
        </div>
      )}
    </div>
  )
}

export default TestApi