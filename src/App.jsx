import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Scoreboard from './components/Scoreboard'
import ActivityLog from './components/ActivityLog'
import SideColumn from './components/SideColumn'
import ModalRegistro from './components/ModalRegistro'
import Login from './components/Login'
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
    <div className="app">
      <Sidebar />
      <main className="main">
        <Topbar onRegistrar={() => setIsModalOpen(true)} />
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando tus actividades...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>⚠️ Error al cargar actividades: {error}</p>
          </div>
        ) : (
          <>
            <Scoreboard actividades={actividades} />
            <div className="grid">
              <ActivityLog 
                actividades={actividades} 
                onEliminar={eliminarActividad}
              />
              <SideColumn actividades={actividades} />
            </div>
          </>
        )}
      </main>

      <ModalRegistro 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegistrar={agregarActividad}
      />
    </div>
  )
}

export default App