import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
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
import { useAuth } from './context/AuthContext'
import { useActividades } from './hooks/useActividades'
import { usePerfil } from './hooks/usePerfil'
import './App.css'

function App() {
  const { loading: authLoading } = useAuth()
  const {
    actividades,
    planes,
    sesiones,
    loading: actividadesLoading,
    error,
    agregarActividad,
    eliminarActividad,
    marcarSesion,
    desmarcarSesion
  } = useActividades()

  const { nombre, guardarNombre } = usePerfil()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalInitialData, setModalInitialData] = useState(null)
  const [rangoActivo, setRangoActivo] = useState('Semana')

  const abrirModalConDatos = (data) => {
    setModalInitialData(data)
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setModalInitialData(null)
  }

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando sesión...</p>
      </div>
    )
  }

  const sesionesHoy = sesiones.filter(s => {
    const hoy = new Date()
    const f = new Date(s.fecha)
    return f.getDate() === hoy.getDate() &&
           f.getMonth() === hoy.getMonth() &&
           f.getFullYear() === hoy.getFullYear()
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout
                nombre={nombre}
                sesionesHoy={sesionesHoy}
                rangoActivo={rangoActivo}
                setRangoActivo={setRangoActivo}
                onRegistrar={() => abrirModalConDatos(null)}
                isModalOpen={isModalOpen}
                cerrarModal={cerrarModal}
                agregarActividad={agregarActividad}
                modalInitialData={modalInitialData}
                contenido={
                  <Panel
                    actividades={sesiones}
                    onEliminar={eliminarActividad}
                    loading={actividadesLoading}
                    error={error}
                    rangoActivo={rangoActivo}
                  />
                }
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/actividades"
          element={
            <ProtectedRoute>
              <Layout
                nombre={nombre}
                sesionesHoy={sesionesHoy}
                rangoActivo={rangoActivo}
                setRangoActivo={setRangoActivo}
                onRegistrar={() => abrirModalConDatos(null)}
                isModalOpen={isModalOpen}
                cerrarModal={cerrarModal}
                agregarActividad={agregarActividad}
                modalInitialData={modalInitialData}
                contenido={
                  <Actividades
                    actividades={actividades}
                    onEliminar={eliminarActividad}
                    loading={actividadesLoading}
                    error={error}
                    onRegistrarActividad={abrirModalConDatos}
                  />
                }
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progreso"
          element={
            <ProtectedRoute>
              <Layout
                nombre={nombre}
                sesionesHoy={sesionesHoy}
                rangoActivo={rangoActivo}
                setRangoActivo={setRangoActivo}
                onRegistrar={() => abrirModalConDatos(null)}
                isModalOpen={isModalOpen}
                cerrarModal={cerrarModal}
                agregarActividad={agregarActividad}
                modalInitialData={modalInitialData}
                contenido={
                  <Progreso
                    planes={planes}
                    sesiones={sesiones}
                    marcarSesion={marcarSesion}
                    desmarcarSesion={desmarcarSesion}
                  />
                }
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sueno"
          element={
            <ProtectedRoute>
              <Layout
                nombre={nombre}
                sesionesHoy={sesionesHoy}
                rangoActivo={rangoActivo}
                setRangoActivo={setRangoActivo}
                onRegistrar={() => abrirModalConDatos(null)}
                isModalOpen={isModalOpen}
                cerrarModal={cerrarModal}
                agregarActividad={agregarActividad}
                modalInitialData={modalInitialData}
                contenido={<Sueno />}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/objetivos"
          element={
            <ProtectedRoute>
              <Layout
                nombre={nombre}
                sesionesHoy={sesionesHoy}
                rangoActivo={rangoActivo}
                setRangoActivo={setRangoActivo}
                onRegistrar={() => abrirModalConDatos(null)}
                isModalOpen={isModalOpen}
                cerrarModal={cerrarModal}
                agregarActividad={agregarActividad}
                modalInitialData={modalInitialData}
                contenido={<Objetivos actividades={sesiones} rangoActivo={rangoActivo} />}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ajustes"
          element={
            <ProtectedRoute>
              <Layout
                nombre={nombre}
                sesionesHoy={sesionesHoy}
                rangoActivo={rangoActivo}
                setRangoActivo={setRangoActivo}
                onRegistrar={() => abrirModalConDatos(null)}
                isModalOpen={isModalOpen}
                cerrarModal={cerrarModal}
                agregarActividad={agregarActividad}
                modalInitialData={modalInitialData}
                contenido={<Ajustes nombre={nombre} onGuardarNombre={guardarNombre} />}
              />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function Layout({
  nombre,
  sesionesHoy,
  rangoActivo,
  setRangoActivo,
  onRegistrar,
  isModalOpen,
  cerrarModal,
  agregarActividad,
  modalInitialData,
  contenido,
}) {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Topbar
          onRegistrar={onRegistrar}
          rangoActivo={rangoActivo}
          onCambiarRango={setRangoActivo}
          nombreUsuario={nombre}
          sesionesHoy={sesionesHoy}
        />
        {contenido}
      </main>
      <ModalRegistro
        isOpen={isModalOpen}
        onClose={cerrarModal}
        onRegistrar={agregarActividad}
        initialData={modalInitialData}
      />
    </div>
  )
}

export default App