import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { mensajeError } from '../utils/errores'
function FormNombre({ nombre, onGuardarNombre }) {
  const [draft, setDraft] = useState(nombre),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await onGuardarNombre(draft)
      setMessage('Nombre actualizado.')
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setBusy(false)
    }
  }
  return (
    <form className="modal-field" onSubmit={submit}>
      <label htmlFor="perfil-nombre">Tu nombre</label>
      <input
        id="perfil-nombre"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        required
        maxLength={80}
        disabled={busy}
      />
      <button className="btn btn--primary" disabled={busy}>
        {busy ? 'Guardando…' : 'Guardar nombre'}
      </button>
      {message && <p role="status">{message}</p>}
      {error && (
        <p role="alert" className="login-error">
          {error}
        </p>
      )}
    </form>
  )
}
export default function Ajustes({ nombre, onGuardarNombre, loading, error }) {
  const { currentUser } = useAuth()
  if (loading) return <p role="status">Cargando perfil…</p>
  if (error) return <p role="alert">{error}</p>
  return (
    <section className="panel">
      <h2>Ajustes</h2>
      <p>{currentUser?.email}</p>
      <FormNombre nombre={nombre} onGuardarNombre={onGuardarNombre} />
    </section>
  )
}
