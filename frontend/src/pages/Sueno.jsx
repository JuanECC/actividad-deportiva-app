import { useState, useRef } from 'react'
import { useSueno } from '../hooks/useSueno'
import { fechaLocal, duracionTexto, filtrarRango } from '../utils/actividad'
import { suenoSchema, validarConZod } from '../utils/validations'
import { mensajeError } from '../utils/errores'
import { useConfirmacion } from '../context/useConfirmacion'
export default function Sueno() {
  const confirmar = useConfirmacion()
  const { registros, loading, error, agregarSueno, eliminarSueno } = useSueno()
  const [form, setForm] = useState({
      fecha: fechaLocal(),
      horaDormir: '23:00',
      horaDespertar: '07:00',
    }),
    [message, setMessage] = useState(''),
    [failure, setFailure] = useState(''),
    [pending, setPending] = useState(''),
    [limit, setLimit] = useState(10),
    busy = useRef(false)
  const submit = async (e) => {
    e.preventDefault()
    if (busy.current) return
    setMessage('')
    setFailure('')
    const result = validarConZod(suenoSchema, form)
    if (!result.ok) {
      setFailure(Object.values(result.errors).join(' · '))
      return
    }
    busy.current = true
    setPending('save')
    try {
      await agregarSueno(result.data)
      setMessage('Registro guardado.')
      setForm({
        fecha: fechaLocal(),
        horaDormir: '23:00',
        horaDespertar: '07:00',
      })
    } catch (err) {
      setFailure(mensajeError(err))
    } finally {
      busy.current = false
      setPending('')
    }
  }
  const remove = async (r) => {
    if (
      busy.current ||
      !(await confirmar('¿Eliminar el sueño del ' + r.fecha + '? Esta acción no se puede deshacer.'))
    )
      return
    busy.current = true
    setPending(r.id)
    setMessage('')
    setFailure('')
    try {
      await eliminarSueno(r.id)
    } catch (err) {
      setFailure(mensajeError(err, 'No se pudo eliminar.'))
    } finally {
      busy.current = false
      setPending('')
    }
  }
  const month = filtrarRango(registros, 'Mes'),
    average = month.length
      ? month.reduce((s, r) => s + (r.duracionMinutos || 0), 0) / month.length
      : 0
  return (
    <section>
      <div className="panel">
        <h2>Registro de sueño</h2>
        <p className="help-text">
          Usa la fecha en que despertaste. Se permite un registro por fecha.
        </p>
        <form className="modal-form" onSubmit={submit}>
          <div className="modal-row">
            {[
              ['fecha', 'Fecha al despertar', 'date'],
              ['horaDormir', 'Hora de dormir', 'time'],
              ['horaDespertar', 'Hora de despertar', 'time'],
            ].map(([key, label, type]) => (
              <div className="modal-field" key={key}>
                <label htmlFor={'sueno-' + key}>{label}</label>
                <input
                  id={'sueno-' + key}
                  type={type}
                  value={form[key]}
                  required
                  max={type === 'date' ? fechaLocal() : undefined}
                  disabled={!!pending}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                    setMessage('')
                    setFailure('')
                  }}
                />
              </div>
            ))}
          </div>
          <button
            className="btn btn--primary"
            disabled={!!pending || loading || !!error}
          >
            {pending === 'save' ? 'Guardando…' : 'Guardar sueño'}
          </button>
        </form>
        {message && <p role="status">{message}</p>}
        {failure && (
          <p className="login-error" role="alert">
            {failure}
          </p>
        )}
      </div>
      {loading ? (
        <p role="status">Cargando registros…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          <div className="panel">
            <h3>Este mes</h3>
            <p>
              {month.length}{' '}
              {month.length === 1 ? 'noche registrada' : 'noches registradas'} ·
              Promedio: {duracionTexto(average)}
            </p>
            <p className="help-text">
              La duración registrada no mide la calidad del sueño.
            </p>
          </div>
          <div className="panel">
            <h3>Historial</h3>
            {!registros.length && <p>No hay registros.</p>}
            <ul className="sueno-list">
              {registros.slice(0, limit).map((r) => (
                <li className="sueno-item" key={r.id}>
                  <span>{r.fecha}</span>
                  <span>
                    {r.horaDormir} → {r.horaDespertar}
                  </span>
                  <strong>{duracionTexto(r.duracionMinutos)}</strong>
                  <button
                    className="log__delete"
                    aria-label={'Eliminar sueño del ' + r.fecha}
                    disabled={!!pending}
                    onClick={() => remove(r)}
                  >
                    {pending === r.id ? '…' : 'Eliminar'}
                  </button>
                </li>
              ))}
            </ul>
            {registros.length > limit && (
              <button className="btn" onClick={() => setLimit((n) => n + 10)}>
                Mostrar más
              </button>
            )}
          </div>
        </>
      )}
    </section>
  )
}
