import { useState } from 'react'
import SideColumn from '../components/SideColumn'
import { mensajeError } from '../utils/errores'
function FormMetas({ metas, onGuardarMetas }) {
  const [draft, setDraft] = useState(metas),
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
      await onGuardarMetas(draft)
      setMessage('Metas guardadas. Se mantienen hasta que las cambies.')
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setBusy(false)
    }
  }
  return (
    <form className="panel modal-form" onSubmit={submit}>
      <h2>Metas mensuales</h2>
      {[
        ['distancia', 'Distancia (km)'],
        ['fuerza', 'Sesiones de fuerza'],
        ['suenio', 'Horas de sueño registradas'],
      ].map(([key, label]) => (
        <div className="modal-field" key={key}>
          <label htmlFor={'meta-' + key}>{label}</label>
          <input
            id={'meta-' + key}
            type="number"
            min="1"
            max="100000"
            step={key === 'fuerza' ? '1' : 'any'}
            required
            disabled={busy}
            value={draft[key]}
            onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
          />
        </div>
      ))}
      <button className="btn btn--primary" disabled={busy}>
        {busy ? 'Guardando…' : 'Guardar metas'}
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
export default function Objetivos({
  actividades,
  metas,
  onGuardarMetas,
  loading,
  error,
  ahora,
}) {
  if (loading) return <p role="status">Cargando objetivos…</p>
  if (error) return <p role="alert">{error}</p>
  return (
    <section>
      <FormMetas metas={metas} onGuardarMetas={onGuardarMetas} />
      <SideColumn actividades={actividades} metas={metas} ahora={ahora} />
    </section>
  )
}
