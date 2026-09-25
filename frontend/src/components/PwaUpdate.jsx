import { useRegisterSW } from 'virtual:pwa-register/react'
export default function PwaUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()
  if (!needRefresh) return null
  return (
    <div className="update-banner" role="status">
      <p>Hay una actualización. Guarda tus formularios antes de recargar.</p>
      <button onClick={() => updateServiceWorker(true)}>Actualizar</button>
      <button onClick={() => setNeedRefresh(false)}>Más tarde</button>
    </div>
  )
}
