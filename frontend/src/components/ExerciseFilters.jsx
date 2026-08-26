import React from 'react'

function ExerciseFilters({ categorias, musculos, equipamiento, filtros, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...filtros, [name]: value })
  }

  return (
    <div className="exercise-filters">
      <select name="categoria" value={filtros.categoria || ''} onChange={handleChange}>
        <option value="">Todas las categorías</option>
        {categorias.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <select name="musculo" value={filtros.musculo || ''} onChange={handleChange}>
        <option value="">Todos los músculos</option>
        {musculos.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>

      <select name="equipamiento" value={filtros.equipamiento || ''} onChange={handleChange}>
        <option value="">Todo el equipamiento</option>
        {equipamiento.map(eq => (
          <option key={eq.id} value={eq.id}>{eq.name}</option>
        ))}
      </select>
    </div>
  )
}

export default ExerciseFilters