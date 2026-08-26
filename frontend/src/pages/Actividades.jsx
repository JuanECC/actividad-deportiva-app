import React, { useState } from 'react'
import ActivityLog from '../components/ActivityLog'
import ExerciseCard from '../components/ExerciseCard'
import ExerciseFilters from '../components/ExerciseFilters'
import { useEjercicios } from '../hooks/useEjercicios'
import { useMusculos } from '../hooks/useMusculos'
import { useCategorias } from '../hooks/useCategorias'
import { useEquipamiento } from '../hooks/useEquipamiento'

function Actividades({ actividades, onEliminar, loading, error }) {
  const [filtros, setFiltros] = useState({
    categoria: '',
    musculo: '',
    equipamiento: ''
  })

  const { 
    ejercicios, 
    loading: loadingEjercicios, 
    error: errorEjercicios 
  } = useEjercicios(filtros)

  const { musculos } = useMusculos()
  const { categorias } = useCategorias()
  const { equipamiento } = useEquipamiento()

  return (
    <section aria-label="Actividades">
      <div className="panel" style={{ marginBottom: '24px' }}>
        <div className="panel__header">
          <h2 className="panel__title">Tus actividades</h2>
          <span className="panel__link">{actividades.length} registradas</span>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando actividades...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>⚠️ Error: {error}</p>
          </div>
        ) : (
          <ActivityLog 
            actividades={actividades} 
            onEliminar={onEliminar}
          />
        )}
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Catálogo de ejercicios</h2>
          <span className="panel__link">
            {loadingEjercicios ? 'Cargando...' : `${ejercicios.length} resultados`}
          </span>
        </div>

        <ExerciseFilters 
          categorias={categorias}
          musculos={musculos}
          equipamiento={equipamiento}
          filtros={filtros}
          onChange={setFiltros}
        />

        {errorEjercicios && (
          <div className="error-container" style={{ marginTop: '16px' }}>
            <p>⚠️ Error al cargar ejercicios: {errorEjercicios}</p>
          </div>
        )}

        {loadingEjercicios ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando ejercicios...</p>
          </div>
        ) : (
          <div className="exercise-grid">
            {ejercicios.length > 0 ? (
              ejercicios.map(ej => (
                <ExerciseCard key={ej.id} ejercicio={ej} />
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>
                No se encontraron ejercicios con esos filtros.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default Actividades