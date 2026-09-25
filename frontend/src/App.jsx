import { useState, useEffect, useCallback } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import Sidebar from './components/Sidebar'
import PwaUpdate from './components/PwaUpdate'
import ChatDeportivo from './components/ChatDeportivo'
import ConfirmacionProvider from './components/ConfirmacionProvider'
import Topbar from './components/Topbar'
import ModalRegistro from './components/ModalRegistro'
import Login from './components/Login'
import Panel from './pages/Panel'
import Actividades from './pages/Actividades'
import Progreso from './pages/Progreso'
import Sueno from './pages/Sueno'
import Objetivos from './pages/Objetivos'
import Ajustes from './pages/Ajustes'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { useAuth } from './context/useAuth'
import { useActividades } from './hooks/useActividades'
import { usePerfil } from './hooks/usePerfil'
import { fechaLocal, rachaActual } from './utils/actividad'
import './App.css'
function Workspace() {
  const {
    actividades,
    planes,
    sesiones,
    loading,
    error,
    agregarActividad,
    eliminarActividad,
    desmarcarSesion,
  } = useActividades()
  const perfil = usePerfil(),
    location = useLocation()
  const [modal, setModal] = useState(null),
    [rango, setRango] = useState('Semana'),
    [ahora, setAhora] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setAhora(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])
  const cerrar = useCallback(() => setModal(null), [])
  const abrir = useCallback((data) => setModal({ data: data || null }), [])
  const sesionesHoy = sesiones.filter(
    (a) => fechaLocal(a.fecha) === fechaLocal(ahora),
  )
  const common = {
    actividades: sesiones,
    onEliminar: eliminarActividad,
    onEditar: abrir,
    loading: loading || perfil.loading,
    error: error || perfil.error,
    rangoActivo: rango,
    metas: perfil.metas,
    ahora,
  }
  return (
    <div className="app">
      <Sidebar nombre={perfil.nombre} racha={rachaActual(sesiones, ahora)} />
      <main className="main">
        <Topbar
          onRegistrar={() => abrir(null)}
          rangoActivo={rango}
          onCambiarRango={setRango}
          nombreUsuario={perfil.nombre}
          sesionesHoy={sesionesHoy}
          mostrarRango={location.pathname === '/'}
          ahora={ahora}
        />
        <Routes>
          <Route index element={<Panel {...common} />} />
          <Route
            path="actividades"
            element={
              <Actividades
                actividades={actividades}
                onEliminar={eliminarActividad}
                onEditar={abrir}
                loading={loading}
                error={error}
                onRegistrarActividad={abrir}
              />
            }
          />
          <Route
            path="progreso"
            element={
              <Progreso
                planes={planes}
                sesiones={sesiones}
                desmarcarSesion={desmarcarSesion}
                onRegistrarSesion={abrir}
                loading={loading}
                error={error}
              />
            }
          />
          <Route path="sueno" element={<Sueno />} />
          <Route
            path="objetivos"
            element={
              <Objetivos
                actividades={sesiones}
                metas={perfil.metas}
                onGuardarMetas={perfil.guardarMetas}
                loading={perfil.loading || loading}
                error={perfil.error || error}
                ahora={ahora}
              />
            }
          />
          <Route
            path="ajustes"
            element={
              <Ajustes
                nombre={perfil.nombre}
                onGuardarNombre={perfil.guardarNombre}
                loading={perfil.loading}
                error={perfil.error}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ModalRegistro
        isOpen={modal !== null}
        onClose={cerrar}
        onRegistrar={agregarActividad}
        initialData={modal?.data}
      />
      <ChatDeportivo />
    </div>
  )
}
function PrivateWorkspace() {
  const { currentUser } = useAuth()
  return (
    <ProtectedRoute>
      <ConfirmacionProvider key={currentUser?.uid}>
        <Workspace />
      </ConfirmacionProvider>
    </ProtectedRoute>
  )
}
export default function App() {
  return (
    <BrowserRouter>
      <PwaUpdate />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/*" element={<PrivateWorkspace />} />
      </Routes>
    </BrowserRouter>
  )
}
