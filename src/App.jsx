import React, { useState } from 'react'
import './App.css'

function App() {
  const [actividades, setActividades] = useState([])
  const [nuevaActividad, setNuevaActividad] = useState({
    tipo: 'correr',
    duracion: '',
    distancia: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Actividad a guardar:', nuevaActividad)
    // TODO: Implementar guardado
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏃 Registro de Actividades Deportivas</h1>
        <p className="subtitle">Tu compañero de entrenamiento diario</p>
      </header>

      <main>
        <section className="formulario-section">
          <h2>📝 Registrar Actividad</h2>
          <form onSubmit={handleSubmit}>
            <div className="campo">
              <label htmlFor="tipo">Tipo de actividad:</label>
              <select 
                id="tipo"
                value={nuevaActividad.tipo}
                onChange={(e) => setNuevaActividad({...nuevaActividad, tipo: e.target.value})}
              >
                <option value="correr">🏃 Correr</option>
                <option value="ciclismo">🚴 Ciclismo</option>
                <option value="natacion">🏊 Natación</option>
                <option value="pesas">🏋️ Pesas</option>
              </select>
            </div>

            <div className="campo">
              <label htmlFor="duracion">Duración (minutos):</label>
              <input 
                id="duracion"
                type="number" 
                placeholder="Ej: 30"
                value={nuevaActividad.duracion}
                onChange={(e) => setNuevaActividad({...nuevaActividad, duracion: e.target.value})}
                required
                min="1"
              />
            </div>

            <div className="campo">
              <label htmlFor="distancia">Distancia (km):</label>
              <input 
                id="distancia"
                type="number" 
                placeholder="Ej: 5.2"
                value={nuevaActividad.distancia}
                onChange={(e) => setNuevaActividad({...nuevaActividad, distancia: e.target.value})}
                min="0"
                step="0.1"
              />
            </div>

            <button type="submit" className="btn-principal">
              ➕ Agregar Actividad
            </button>
          </form>
        </section>

        <section className="actividades-section">
          <h2>📋 Mis Actividades</h2>
          <p>Actividades registradas: <strong>{actividades.length}</strong></p>
          <div className="lista-vacia">
            <span>🏋️</span>
            <p>No hay actividades registradas</p>
            <small>¡Agrega tu primera actividad!</small>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App