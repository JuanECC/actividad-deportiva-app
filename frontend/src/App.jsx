// frontend/src/App.jsx
import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import ModalRegistro from './components/ModalRegistro'
import Login from './components/Login'
import Panel from './pages/Panel'
import Actividades from './pages/Actividades'
import Progreso from './pages/Progreso'
import Objetivos from './pages/Objetivos'
import Ajustes from './pages/Ajustes'
import { useAuth } from './context/AuthContext'
import { useActividades } from './hooks/useActividades'
import './App.css'

function App() {
  const { currentUser } = useAuth()
  const { 
    actividades, 
    loading, 
    error,
    agregarActividad, 
    eliminarActividad 
  } = useActividades()
  
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Si no hay usuario autenticado, mostrar login
  if (!currentUser) {
    return <Login />
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <main className="main">
          <Topbar onRegistrar={() => setIsModalOpen(true)} />
          
          <Routes>
            <Route 
              path="/" 
              element={
                <Panel 
                  actividades={actividades} 
                  onEliminar={eliminarActividad}
                  loading={loading}
                  error={error}
                />
              } 
            />
            <Route 
              path="/actividades" 
              element={
                <Actividades 
                  actividades={actividades} 
                  onEliminar={eliminarActividad}
                  loading={loading}
                  error={error}
                />
              } 
            />
            <Route 
              path="/progreso" 
              element={<Progreso actividades={actividades} />} 
            />
            <Route 
              path="/objetivos" 
              element={<Objetivos actividades={actividades} />} 
            />
            <Route 
              path="/ajustes" 
              element={<Ajustes />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <ModalRegistro 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRegistrar={agregarActividad}
        />
      </div>
    </BrowserRouter>
  )
}

export default App