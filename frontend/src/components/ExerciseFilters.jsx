export default function ExerciseFilters({
  categorias,
  musculos,
  equipamiento,
  filtros,
  onChange,
}) {
  return (
    <div className="exercise-filters">
      {[
        ['category', 'Categoría', categorias],
        ['muscles', 'Músculo', musculos],
        ['equipment', 'Equipamiento', equipamiento],
      ].map(([key, label, list]) => (
        <label key={key}>
          {label}
          <select
            name={key}
            value={filtros[key] || ''}
            onChange={(e) =>
              onChange({ ...filtros, [key]: e.target.value, offset: 0 })
            }
          >
            <option value="">Todos</option>
            {list.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  )
}
