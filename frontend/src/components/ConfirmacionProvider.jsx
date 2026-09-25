import { useCallback, useEffect, useRef, useState } from 'react'
import { ConfirmacionContext } from '../context/useConfirmacion'

export default function ConfirmacionProvider({ children }) {
  const [mensaje, setMensaje] = useState(null)
  const resolver = useRef(null)
  const dialogo = useRef(null)
  const cerrar = useCallback((aceptado = false) => {
    dialogo.current?.close()
    resolver.current?.(aceptado)
    resolver.current = null
    setMensaje(null)
  }, [])
  const confirmar = useCallback((texto) => {
    if (resolver.current) return Promise.resolve(false)
    return new Promise((resolve) => {
      resolver.current = resolve
      setMensaje(texto)
    })
  }, [])
  useEffect(() => {
    if (mensaje === null) return
    const anterior = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogo.current.showModal()
    return () => {
      document.body.style.overflow = overflow
      anterior?.focus()
    }
  }, [mensaje])
  useEffect(() => () => resolver.current?.(false), [])
  return (
    <ConfirmacionContext.Provider value={confirmar}>
      {children}
      <dialog ref={dialogo} className="confirmacion" aria-labelledby="confirmacion-titulo"
        aria-describedby="confirmacion-mensaje" onCancel={(e) => { e.preventDefault(); cerrar() }}>
        <span className="confirmacion__icono" aria-hidden="true">!</span>
        <h2 id="confirmacion-titulo">Confirmar eliminación</h2>
        <p id="confirmacion-mensaje">{mensaje}</p>
        <div className="confirmacion__acciones">
          <button className="btn" autoFocus onClick={() => cerrar()}>Cancelar</button>
          <button className="btn confirmacion__eliminar" onClick={() => cerrar(true)}>Eliminar</button>
        </div>
      </dialog>
    </ConfirmacionContext.Provider>
  )
}
