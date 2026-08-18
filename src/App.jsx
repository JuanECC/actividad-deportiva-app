import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Scoreboard from './components/Scoreboard'
import ActivityLog from './components/ActivityLog'
import SideColumn from './components/SideColumn'
import ModalRegistro from './components/ModalRegistro'
import Login from './components/Login'
import { useAuth } from './context/AuthContext'
import './App.css'

function App() {
  const { currentUser } = useAuth()
  
  const [actividades, setActividades] = useState([
    {
      id: 1,
      tipo: 'run',
      nombre: 'Carrera matutina — Parque Central',
      fecha: new Date().toISOString(),
      meta: 'Hoy · 06:42 a. m.',
      distancia: '8.4',
      duracion: '42:10',
      ritmo: '5:01',
      tag: 'Récord',
      tagType: 'pr'
    },
    {
      id: 2,
      tipo: 'bike',
      nombre: 'Rodaje suave — Ruta del río',
      fecha: new Date(Date.now() - 86400000).toISOString(),
      meta: 'Ayer · 05:15 p. m.',
      distancia: '24.1',
      duracion: '58:32',
      ritmo: '24.7 km/h',
      tag: 'Recuperación',
      tagType: ''
    },
    {
      id: 3,
      tipo: 'swim',
      nombre: 'Natación — Alberca municipal',
      fecha: new Date(Date.now() - 172800000).toISOString(),
      meta: 'Lun · 07:00 a. m.',
      distancia: '1,800',
      duracion: '38:00',
      ritmo: '2:07 /100m',
      tag: 'Técnica',
      tagType: ''
    },
    {
      id: 4,
      tipo: 'strength',
      nombre: 'Fuerza — Tren inferior',
      fecha: new Date(Date.now() - 259200000).toISOString(),
      meta: 'Dom · 06:30 p. m.',
      distancia: '5 ejerc.',
      duracion: '51:00',
      ritmo: '4,200 kg',
      tag: 'Volumen',
      tagType: ''
    },
    {
      id: 5,
      tipo: 'run',
      nombre: 'Intervalos — Pista atlética',
      fecha: new Date(Date.now() - 345600000).toISOString(),
      meta: 'Sáb · 08:10 a. m.',
      distancia: '10.2',
      duracion: '47:55',
      ritmo: '4:41',
      tag: 'Velocidad',
      tagType: ''
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)

  // Si no hay usuario autenticado, mostrar login
  if (!currentUser) {
    return <Login />
  }

  // Función para agregar actividad
  const agregarActividad = (nuevaActividad) => {
    setActividades([nuevaActividad, ...actividades])
  }

  // Función para eliminar actividad
  const eliminarActividad = (id) => {
    setActividades(actividades.filter(act => act.id !== id))
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Topbar onRegistrar={() => setIsModalOpen(true)} />
        <Scoreboard actividades={actividades} />
        <div className="grid">
          <ActivityLog 
            actividades={actividades} 
            onEliminar={eliminarActividad}
          />
          <SideColumn actividades={actividades} />
        </div>
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