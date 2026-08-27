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
import { useAuth } from './context/AuthContext'
import { useActividades } from './hooks/useActividades'
import { usePerfil } from './hooks/usePerfil'
import './App.css'

function App() {
  const { currentUser, loading: authLoading } = useAuth()
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

  if (!currentUser) {
    return <Login />
  }

  const hoy = new Date()
  const sesionesHoy = sesiones.filter(s => {
    const f = new Date(s.fecha)
    return f.getDate() === hoy.getDate() &&
           f.getMonth() === hoy.getMonth() &&
           f.getFullYear() === hoy.getFullYear()
  })

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <main className="main">
          <Topbar
            onRegistrar={() => abrirModalConDatos(null)}
            rangoActivo={rangoActivo}
            onCambiarRango={setRangoActivo}
            nombreUsuario={nombre}
            sesionesHoy={sesionesHoy}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Panel
                  actividades={sesiones}
                  onEliminar={eliminarActividad}
                  loading={actividadesLoading}
                  error={error}
                  rangoActivo={rangoActivo}
                />
              }
            />
            <Route
              path="/actividades"
              element={
                <Actividades
                  actividades={actividades}
                  onEliminar={eliminarActividad}
                  loading={actividadesLoading}
                  error={error}
                  onRegistrarActividad={abrirModalConDatos}
                />
              }
            />
            <Route
              path="/progreso"
              element={
                <Progreso
                  planes={planes}
                  sesiones={sesiones}
                  marcarSesion={marcarSesion}
                  desmarcarSesion={desmarcarSesion}
                />
              }
            />
            <Route
              path="/sueno"
              element={<Sueno />}
            />
            <Route
              path="/objetivos"
              element={<Objetivos actividades={sesiones} rangoActivo={rangoActivo} />}
            />
            <Route
              path="/ajustes"
              element={<Ajustes nombre={nombre} onGuardarNombre={guardarNombre} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <ModalRegistro
          isOpen={isModalOpen}
          onClose={cerrarModal}
          onRegistrar={agregarActividad}
          initialData={modalInitialData}
        />
      </div>
    </BrowserRouter>
  )
}

export default App