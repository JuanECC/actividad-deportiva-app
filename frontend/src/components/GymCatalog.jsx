import { useState, useEffect } from 'react'
import {
  getCategorias,
  getMusculos,
  getEquipamiento,
  getIdiomas,
} from '../services/wgerApi'
import { useEjercicios } from '../hooks/useEjercicios'
import ExerciseFilters from './ExerciseFilters'
import ExerciseCard from './ExerciseCard'
export default function GymCatalog({ onSelect }) {
  const [filtros, setFiltros] = useState({
      category: '',
      muscles: '',
      equipment: '',
      offset: 0,
    }),
    [catalog, setCatalog] = useState(null),
    [error, setError] = useState(''),
    [attempt, setAttempt] = useState(0)
  const data = useEjercicios(filtros)
  useEffect(() => {
    let active = true
    setError('')
    Promise.all([
      getCategorias(),
      getMusculos(),
      getEquipamiento(),
      getIdiomas(),
    ])
      .then((values) => {
        if (active) setCatalog(values.map((v) => v.results || []))
      })
      .catch((e) => {
        if (active) setError(e.message)
      })
    return () => {
      active = false
    }
  }, [attempt])
  if (error)
    return (
      <div role="alert">
        <p>{error}</p>
        <button onClick={() => setAttempt((n) => n + 1)}>
          Reintentar catálogo
        </button>
      </div>
    )
  if (!catalog) return <p role="status">Cargando filtros…</p>
  return (
    <>
      <ExerciseFilters
        categorias={catalog[0]}
        musculos={catalog[1]}
        equipamiento={catalog[2]}
        filtros={filtros}
        onChange={setFiltros}
      />
      {data.error ? (
        <div role="alert">
          <p>{data.error}</p>
          <button onClick={data.reintentar}>Reintentar</button>
        </div>
      ) : data.loading ? (
        <p role="status">Cargando ejercicios…</p>
      ) : (
        <>
          <div className="exercise-grid">
            {data.ejercicios.map((e) => (
              <ExerciseCard
                key={e.id}
                ejercicio={e}
                idiomas={catalog[3]}
                onSelect={onSelect}
              />
            ))}
          </div>
          {!data.ejercicios.length && (
            <p>No se encontraron ejercicios con esos filtros.</p>
          )}
        </>
      )}
      <div className="pagination">
        <button
          disabled={data.loading || filtros.offset === 0}
          onClick={() =>
            setFiltros((f) => ({ ...f, offset: Math.max(0, f.offset - 20) }))
          }
        >
          Anterior
        </button>
        <span>
          Página {Math.floor(filtros.offset / 20) + 1} · {data.count} ejercicios
        </span>
        <button
          disabled={data.loading || filtros.offset + 20 >= data.count}
          onClick={() => setFiltros((f) => ({ ...f, offset: f.offset + 20 }))}
        >
          Siguiente
        </button>
      </div>
    </>
  )
}
