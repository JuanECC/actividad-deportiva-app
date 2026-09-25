import { useEffect, useRef, useState } from 'react'

export default function ChatDeportivo() {
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState([])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const entrada = useRef(null), lista = useRef(null), boton = useRef(null), peticion = useRef(null)
  useEffect(() => () => peticion.current?.abort(), [])
  useEffect(() => { if (abierto) entrada.current?.focus() }, [abierto])
  useEffect(() => { if (lista.current) lista.current.scrollTop = lista.current.scrollHeight }, [mensajes, enviando, abierto, error])
  const cerrar = () => { setAbierto(false); boton.current?.focus() }
  const enviar = async (e) => {
    e.preventDefault()
    if (!texto.trim() || peticion.current) return
    const pregunta = texto.trim()
    const historial = [...mensajes.slice(-12), { role: 'user', text: pregunta }]
    const controller = new AbortController()
    peticion.current = controller
    const timer = setTimeout(() => controller.abort(), 30000)
    setEnviando(true)
    setError('')
    setTexto('')
    setMensajes(historial)
    try {
      const base = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '')
      const response = await fetch(base.replace(/\/$/, '') + '/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historial }), signal: controller.signal,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'El chat no está disponible ahora.')
      if (typeof data.text !== 'string' || !data.text.trim()) throw new Error('El chat devolvió una respuesta vacía.')
      setMensajes([...historial, { role: 'model', text: data.text }])
    } catch (err) {
      setMensajes(historial.slice(0, -1))
      setTexto(pregunta)
      setError(err instanceof TypeError || err instanceof SyntaxError ? 'No se pudo conectar con el chat. Comprueba que el backend esté iniciado.' : err.name === 'AbortError' ? 'La respuesta tardó demasiado. Puedes volver a enviar tu mensaje.' : err.message)
    } finally {
      clearTimeout(timer)
      peticion.current = null
      setEnviando(false)
    }
  }
  return (
    <div className="sticky-chat">
      {abierto && <section className="sticky-chat__panel" role="dialog" aria-label="Sticky, chat deportivo"
        onKeyDown={(e) => { if (e.key === 'Escape') cerrar() }}>
        <header className="sticky-chat__header">
          <div><strong>S/Split</strong><span>Tu compañero de entrenamiento · IA</span></div>
          <button type="button" onClick={cerrar} aria-label="Cerrar chat">×</button>
        </header>
        <div ref={lista} className="sticky-chat__mensajes" role="log" aria-live="polite" aria-relevant="additions text">
          <p className="sticky-chat__mensaje">¡Hola! Soy S/Split. Hablemos de deporte, rutinas y gimnasio. ¿Qué quieres entrenar hoy?</p>
          {mensajes.map((m, i) => <p key={i} className={`sticky-chat__mensaje ${m.role === 'user' ? 'sticky-chat__mensaje--usuario' : ''}`}><span className="sticky-chat__autor">{m.role === 'user' ? 'Tú' : 'Sticky'}</span>{m.text}</p>)}
          {enviando && <p role="status" className="sticky-chat__estado">S/Split está pensando…</p>}
        </div>
        {error && <p className="sticky-chat__error" role="alert">{error}</p>}
        <form className="sticky-chat__form" onSubmit={enviar}>
          <label htmlFor="sticky-mensaje">Tu pregunta sobre deporte o gimnasio</label>
          <div><input ref={entrada} id="sticky-mensaje" value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={1000} disabled={enviando} placeholder="¿Cómo empiezo en el gym?" autoComplete="off" />
            <button type="submit" disabled={enviando || !texto.trim()} aria-label="Enviar mensaje">↑</button></div>
          <small>Los mensajes se envían a Gemini. No compartas datos sensibles.</small>
        </form>
      </section>}
      <button ref={boton} className="sticky-chat__toggle" type="button" aria-label={abierto ? 'Cerrar chat Sticky' : 'Abrir chat Sticky'} aria-expanded={abierto} onClick={() => abierto ? cerrar() : setAbierto(true)}>
        <span className="sticky-chat__etiqueta">S/Split</span>
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="7" cy="12" r="1" fill="currentColor"/><circle cx="11" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/></svg>
      </button>
    </div>
  )
}
