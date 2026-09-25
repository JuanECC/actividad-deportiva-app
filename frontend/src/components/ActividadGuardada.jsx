import { useEffect } from 'react'

export default function ActividadGuardada({ aviso, onCerrar }) {
  useEffect(() => {
    if (!aviso) return
    const timer = setTimeout(onCerrar, 3500)
    return () => clearTimeout(timer)
  }, [aviso, onCerrar])

  return (
    <div className="actividad-guardada-region" role="status" aria-live="polite" aria-atomic="true">
      {aviso && (
        <div key={aviso} className="actividad-guardada">
          <svg className="actividad-guardada__icono" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="18" />
            <path d="m11 20 6 6 12-13" />
          </svg>
          <div><strong>¡Actividad agregada!</strong><span>Tu entrenamiento quedó guardado.</span></div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar aviso">×</button>
        </div>
      )}
    </div>
  )
}
