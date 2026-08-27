import React, { useState } from 'react'
import ActivityLog from '../components/ActivityLog'
import ExerciseCard from '../components/ExerciseCard'
import ExerciseFilters from '../components/ExerciseFilters'
import SportsCatalog from '../components/SportsCatalog'
import { useEjercicios } from '../hooks/useEjercicios'
import { useMusculos } from '../hooks/useMusculos'
import { useCategorias } from '../hooks/useCategorias'
import { useEquipamiento } from '../hooks/useEquipamiento'

const mapearTipo = (categoriaId) => {
  if (categoriaId === 15) return 'run'
  return 'strength'
}

function Actividades({ actividades, onEliminar, loading, error, onRegistrarActividad }) {
  const [modoCatalogo, setModoCatalogo] = useState('deportes')
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

  const handleSeleccionarEjercicio = (ejercicio) => {
    const tipo = mapearTipo(ejercicio.category)
    onRegistrarActividad({
      tipo,
      nombre: `Ejercicio #${ejercicio.id}`,
      distancia: '',
      duracion: '',
      ritmo: '',
      tag: 'Entrenamiento',
      tagType: ''
    })
  }

  const handleSeleccionarDeporte = (sport) => {
    const tipo = mapearTipoDeporte(sport.strSport)
    onRegistrarActividad({
      tipo,
      nombre: sport.strSport,
      deporte: sport.strSport,
      distancia: '',
      duracion: '',
      ritmo: '',
      tag: 'Entrenamiento',
      tagType: ''
    })
  }

  const mapearTipoDeporte = (sportName = '') => {
    const name = sportName.toLowerCase()
    if (name.includes('swim')) return 'swim'
    if (name.includes('cycl') || name.includes('bike')) return 'bike'
    if (name.includes('run') || name.includes('athlet')) return 'run'
    return 'strength'
  }

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
          <h2 className="panel__title">Catálogo</h2>
          <div className="catalog-tabs">
            <button
              className={`catalog-tab ${modoCatalogo === 'deportes' ? 'catalog-tab--active' : ''}`}
              onClick={() => setModoCatalogo('deportes')}
            >
              Deportes
            </button>
            <button
              className={`catalog-tab ${modoCatalogo === 'gimnasio' ? 'catalog-tab--active' : ''}`}
              onClick={() => setModoCatalogo('gimnasio')}
            >
              Gimnasio
            </button>
          </div>
        </div>

        {modoCatalogo === 'gimnasio' && (
          <>
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
                    <ExerciseCard 
                      key={ej.id} 
                      ejercicio={ej} 
                      onSelect={handleSeleccionarEjercicio}
                    />
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>
                    No se encontraron ejercicios con esos filtros.
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {modoCatalogo === 'deportes' && (
          <SportsCatalog onSelectSport={handleSeleccionarDeporte} />
        )}
      </div>
    </section>
  )
}

export default Actividades