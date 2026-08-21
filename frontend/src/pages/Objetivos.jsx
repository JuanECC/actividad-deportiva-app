// frontend/src/pages/Objetivos.jsx
import React from 'react'
import SideColumn from '../components/SideColumn'

function Objetivos({ actividades }) {
  return (
    <section aria-label="Objetivos">
      <div className="panel__header">
        <h2 className="panel__title">🎯 Objetivos</h2>
      </div>
      <SideColumn actividades={actividades} />
    </section>
  )
}

export default Objetivos