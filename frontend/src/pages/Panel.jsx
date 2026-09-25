import Scoreboard from '../components/Scoreboard'
import ActivityLog from '../components/ActivityLog'
import SideColumn from '../components/SideColumn'
import { filtrarRango } from '../utils/actividad'
export default function Panel({
  actividades,
  onEliminar,
  onEditar,
  loading,
  error,
  rangoActivo,
  metas,
  ahora,
}) {
  if (loading) return <p role="status">Cargando actividades…</p>
  if (error) return <p role="alert">{error}</p>
  return (
    <>
      <Scoreboard
        actividades={actividades}
        rangoActivo={rangoActivo}
        ahora={ahora}
      />
      <div className="grid">
        <ActivityLog
          actividades={filtrarRango(actividades, rangoActivo, ahora)}
          onEliminar={onEliminar}
          onEditar={onEditar}
        />
        <SideColumn actividades={actividades} metas={metas} ahora={ahora} />
      </div>
    </>
  )
}
