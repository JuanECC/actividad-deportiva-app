import { useState, useEffect, useRef } from 'react'
import { deportes } from '../utils/deportes'
import { actividadSchema, validarConZod } from '../utils/validations'
import {
  fechaLocal,
  minutosActividad,
  minutosEntrada,
  duracionParaEditar,
} from '../utils/actividad'
import { mensajeError } from '../utils/errores'
const inicial = {
  deporte: 'Correr',
  tipo: 'run',
  nombre: '',
  fecha: '',
  distancia: '',
  duracion: '',
  ritmo: '',
  tag: 'Entrenamiento',
  modoFuerza: 'rounds',
  diasSeleccionados: [],
  semanas: 1,
}
const dias = [
  ['L', 'Lunes'],
  ['M', 'Martes'],
  ['X', 'Miércoles'],
  ['J', 'Jueves'],
  ['V', 'Viernes'],
  ['S', 'Sábado'],
  ['D', 'Domingo'],
]
export default function ModalRegistro({
  isOpen,
  onClose,
  onRegistrar,
  initialData,
}) {
  const [form, setForm] = useState(inicial),
    [errors, setErrors] = useState({}),
    [guardando, setGuardando] = useState(false),
    [error, setError] = useState('')
  const dialog = useRef(null),
    busy = useRef(false)
  useEffect(() => {
    if (!isOpen) return
    const data = initialData || {}
    setForm({
      ...inicial,
      ...data,
      fecha: fechaLocal(data.fecha || new Date()),
      duracion:
        data.duracion || Number.isFinite(data.duracionMinutos)
          ? duracionParaEditar(minutosActividad(data))
          : '',
    })
    setErrors({})
    setError('')
  }, [isOpen, initialData])
  useEffect(() => {
    if (!isOpen) return
    const before = document.activeElement,
      overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.focus()
    const key = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (!busy.current) onClose()
      }
      if (e.key === 'Tab') {
        const elements = [
          ...dialog.current.querySelectorAll(
            'button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]',
          ),
        ]
        const first = elements[0],
          last = elements.at(-1)
        if (!first) {
          e.preventDefault()
          return
        }
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialog.current)
        ) {
          e.preventDefault()
          last.focus()
        } else if (
          !e.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === dialog.current)
        ) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', key)
      if (before?.isConnected) before.focus()
    }
  }, [isOpen, onClose])
  const change = (e) => {
    const { name, value } = e.target
    setForm((p) => ({
      ...p,
      [name]: name === 'semanas' ? Number(value) : value,
      ...(name === 'deporte'
        ? {
            tipo: deportes.find((d) => d.nombre === value)?.tipo || 'sport',
            distancia: '',
            ritmo: '',
          }
        : {}),
    }))
    setErrors((p) => ({ ...p, [name]: null }))
    setError('')
  }
  const submit = async (e) => {
    e.preventDefault()
    if (busy.current) return
    const result = validarConZod(actividadSchema, form)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    busy.current = true
    setGuardando(true)
    setError('')
    try {
      const data = { ...form, ...result.data }
      const n = Number(data.distancia.replace(',', '.')),
        minutes = minutosEntrada(data.duracion)
      if (['run', 'swim', 'bike'].includes(data.tipo)) {
        if (data.tipo === 'bike') data.ritmo = ((n / minutes) * 60).toFixed(1)
        else {
          const sec = Math.round(
            (minutes * 60) / (data.tipo === 'swim' ? n / 100 : n),
          )
          data.ritmo =
            Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0')
        }
      }
      await onRegistrar(data)
      onClose()
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      busy.current = false
      setGuardando(false)
    }
  }
  if (!isOpen) return null
  const isPlan = form.diasSeleccionados.length > 0,
    locked = !!form.id || !!form.planId
  const distanceLabel =
    form.tipo === 'strength'
      ? form.modoFuerza === 'tiempo'
        ? 'Tiempo por ronda (min)'
        : 'Número de rondas'
      : form.tipo === 'sport'
        ? 'Resultado (goles, puntos u observaciones)'
        : form.tipo === 'swim'
          ? 'Distancia (m)'
          : 'Distancia (km)'
  const field = (name, label, type = 'text', props = {}) => (
    <div className="modal-field">
      <label htmlFor={'actividad-' + name}>{label}</label>
      <input
        id={'actividad-' + name}
        name={name}
        type={type}
        value={form[name]}
        onChange={change}
        disabled={guardando}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? name + '-error' : undefined}
        {...props}
      />
      {errors[name] && (
        <span id={name + '-error'} className="modal-error">
          {errors[name]}
        </span>
      )}
    </div>
  )
  return (
    <div
      className="modal-overlay"
      onClick={() => {
        if (!busy.current) onClose()
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="registro-title"
        tabIndex={-1}
        ref={dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="registro-title">
            {form.id
              ? 'Editar registro'
              : form.planId
                ? 'Completar sesión'
                : isPlan
                  ? 'Crear plan'
                  : 'Registrar actividad'}
          </h2>
          <button
            aria-label="Cerrar formulario"
            onClick={onClose}
            disabled={guardando}
          >
            ✕
          </button>
        </div>
        <form onSubmit={submit} className="modal-form">
          {form.planId && (
            <p>
              Confirma o ajusta los resultados que realizaste en esta sesión.
            </p>
          )}
          <div className="modal-field">
            <label htmlFor="actividad-deporte">Deporte</label>
            <select
              id="actividad-deporte"
              name="deporte"
              value={form.deporte}
              onChange={change}
              disabled={guardando}
            >
              <option value="">Selecciona un deporte</option>
              {deportes.map((d) => (
                <option key={d.id} value={d.nombre}>
                  {d.icono} {d.nombre}
                </option>
              ))}
            </select>
            {errors.deporte && (
              <span className="modal-error">{errors.deporte}</span>
            )}
          </div>
          {field('nombre', 'Nombre de la actividad', 'text', {
            maxLength: 120,
            required: true,
          })}
          {field(
            'fecha',
            isPlan ? 'Fecha de inicio' : 'Fecha de la sesión',
            'date',
            {
              required: true,
              max: isPlan ? undefined : fechaLocal(),
              disabled:
                guardando ||
                !!(form.planId && !form.id) ||
                !!(form.id && isPlan),
            },
          )}
          {!form.planId && (!form.id || isPlan) && (
            <fieldset disabled={guardando || locked}>
              <legend>
                {isPlan ? 'Plan recurrente' : 'Repetir como plan (opcional)'}
              </legend>
              <p>Sin días seleccionados se guarda una sesión realizada.</p>
              <div className="dias-semana">
                {dias.map(([id, label]) => (
                  <button
                    type="button"
                    key={id}
                    aria-label={label}
                    aria-pressed={form.diasSeleccionados.includes(id)}
                    className={
                      'dia-btn ' +
                      (form.diasSeleccionados.includes(id)
                        ? 'dia-btn--active'
                        : '')
                    }
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        diasSeleccionados: p.diasSeleccionados.includes(id)
                          ? p.diasSeleccionados.filter((d) => d !== id)
                          : [...p.diasSeleccionados, id],
                      }))
                    }
                  >
                    {id}
                  </button>
                ))}
              </div>
              {isPlan &&
                field('semanas', 'Semanas', 'number', {
                  min: 1,
                  max: 12,
                  required: true,
                })}
              {locked && (
                <p>Para cambiar la programación, crea un plan nuevo.</p>
              )}
            </fieldset>
          )}
          {form.tipo === 'strength' && (
            <div className="modal-field">
              <label htmlFor="actividad-modoFuerza">Registro de fuerza</label>
              <select
                id="actividad-modoFuerza"
                name="modoFuerza"
                value={form.modoFuerza}
                onChange={change}
                disabled={guardando}
              >
                <option value="rounds">Por rondas</option>
                <option value="tiempo">Por tiempo</option>
              </select>
            </div>
          )}
          {field('distancia', distanceLabel, 'text', { required: true })}
          {field('duracion', 'Duración total', 'text', {
            placeholder: '42:10 (min:seg), 90 o 1h 30min',
            required: true,
          })}
          <p className="help-text">
            Dos partes: minutos:segundos. Tres partes: horas:minutos:segundos.
            El ritmo y la velocidad se calculan con distancia y duración.
          </p>
          {form.id && !Number.isFinite(initialData?.duracionMinutos) && (
            <p className="help-text">
              Registro antiguo: revisa la duración antes de guardar; el formato
              anterior era ambiguo.
            </p>
          )}
          {['strength', 'sport'].includes(form.tipo) &&
            field(
              'ritmo',
              form.tipo === 'strength'
                ? 'Descanso / observaciones (opcional)'
                : 'Rendimiento (opcional)',
            )}
          <div className="modal-field">
            <label htmlFor="actividad-tag">Etiqueta</label>
            <select
              id="actividad-tag"
              name="tag"
              value={form.tag}
              onChange={change}
              disabled={guardando}
            >
              {[
                'Entrenamiento',
                'Récord',
                'Recuperación',
                'Técnica',
                'Velocidad',
                'Volumen',
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          {error && (
            <p role="alert" className="login-error">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn-cancel"
              disabled={guardando}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button className="modal-btn-submit" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
