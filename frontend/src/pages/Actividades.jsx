import React, { useState, useMemo } from 'react'

import ActivityLog from '../components/ActivityLog'
import ExerciseCard from '../components/ExerciseCard'
import ExerciseFilters from '../components/ExerciseFilters'
import SportsCatalog from '../components/SportsCatalog'

import { useEjercicios } from '../hooks/useEjercicios'
import { useMusculos } from '../hooks/useMusculos'
import { useMusculosMap } from '../hooks/useMusculosMap'
import { useCategorias } from '../hooks/useCategorias'
import { useEquipamiento } from '../hooks/useEquipamiento'

import { gruposMusculares } from '../utils/gruposMusculares'

const mapearTipoEjercicio = (categoriaId) => {
  if (categoriaId === 15) return 'run'
  return 'strength'
}

function agruparActividades(actividades) {
  const planes = []
  const individuales = []
  const sesionesPorPlan = {}

  actividades.forEach(act => {
    if (act.esPlan) {
      planes.push(act)
      if (!sesionesPorPlan[act.id]) sesionesPorPlan[act.id] = []
    } else if (act.planId) {
      if (!sesionesPorPlan[act.planId]) sesionesPorPlan[act.planId] = []
      sesionesPorPlan[act.planId].push(act)
    } else {
      individuales.push(act)
    }
  })

  return { planes, individuales, sesionesPorPlan }
}

function Actividades({
  actividades,
  onEliminar,
  loading,
  error,
  onRegistrarActividad
}) {
  const [modoCatalogo, setModoCatalogo] = useState('deportes')

  const [filtros, setFiltros] = useState({
    categoria: '',
    musculo: '',
    equipamiento: ''
  })

  const [grupoFiltro, setGrupoFiltro] = useState('')

  const {
    ejercicios,
    loading: loadingEjercicios,
    error: errorEjercicios
  } = useEjercicios(filtros)

  const { musculos } = useMusculos()
  const { mapaMusculos } = useMusculosMap()
  const { categorias } = useCategorias()
  const { equipamiento } = useEquipamiento()

  const { planes, individuales, sesionesPorPlan } = useMemo(
    () => agruparActividades(actividades),
    [actividades]
  )

  const ejerciciosFiltrados = ejercicios.filter(ej => {
    if (!grupoFiltro) return true

    const musculosEjercicio = (ej.muscles || [])
      .map(id => mapaMusculos[id])
      .filter(Boolean)

    return musculosEjercicio.some(
      m => m.grupo === grupoFiltro
    )
  })

  const handleSeleccionarEjercicio = (ejercicio) => {
    const tipo = mapearTipoEjercicio(ejercicio.category)

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

  const handleSeleccionarDeporte = (deporte) => {
    onRegistrarActividad({
      tipo: deporte.tipo,
      deporte: deporte.nombre,
      nombre: deporte.nombre,
      distancia: '',
      duracion: '',
      ritmo: '',
      tag: 'Entrenamiento',
      tagType: ''
    })
  }

  return (
    <section aria-label="Actividades">

      <div className="panel" style={{ marginBottom: '24px' }}>
        <div className="panel__header">
          <h2 className="panel__title">Tus actividades</h2>

          <span className="panel__link">
            {actividades.length} registros
          </span>
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
          <>
            {planes.map(plan => {
              const sesiones = sesionesPorPlan[plan.id] || []

              const totalSesiones =
                plan.diasSeleccionados.length * plan.semanas

              const completadas = sesiones.length

              const progreso =
                totalSesiones > 0
                  ? Math.round(
                      (completadas / totalSesiones) * 100
                    )
                  : 0

              return (
                <div key={plan.id} className="plan-resumen">

                  <div className="plan-resumen__header">

                    <div>
                      <h3 className="plan-resumen__title">
                        📋 {plan.nombre}
                      </h3>

                      <p className="plan-resumen__meta">
                        {completadas} de {totalSesiones} sesiones completadas
                      </p>
                    </div>

                    <div className="plan-resumen__actions">

                      <span className="plan-resumen__porcentaje">
                        {progreso}%
                      </span>

                      <button
                        className="log__delete"
                        onClick={() => onEliminar(plan.id)}
                        aria-label="Eliminar plan"
                      >
                        ✕
                      </button>

                    </div>

                  </div>

                  <div
                    className="progress"
                    style={{ marginTop: '8px' }}
                  >
                    <span
                      className="progress__fill"
                      style={{
                        '--p': progreso + '%'
                      }}
                    ></span>
                  </div>

                  <div className="plan-resumen__sesiones">

                    {sesiones.length > 0 ? (
                      sesiones.map(sesion => (
                        <span
                          key={sesion.id}
                          className="plan-sesion-chip"
                        >
                          ✅{' '}
                          {new Date(
                            sesion.fecha
                          ).toLocaleDateString(
                            'es-ES',
                            {
                              day: '2-digit',
                              month: 'short'
                            }
                          )}
                        </span>
                      ))
                    ) : (
                      <span className="plan-sesion-chip plan-sesion-chip--vacio">
                        Aún no hay sesiones completadas
                      </span>
                    )}

                  </div>

                </div>
              )
            })}

            {individuales.length > 0 && (
              <>
                <h3 className="actividades-subtitulo">
                  Actividades individuales
                </h3>

                <ActivityLog
                  actividades={individuales}
                  onEliminar={onEliminar}
                  mostrarTipo={false}
                />
              </>
            )}

            {planes.length === 0 &&
              individuales.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <p>No hay actividades registradas</p>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    ¡Registra tu primera actividad!
                  </p>
                </div>
              )}
          </>
        )}
      </div>

      <div className="panel">

        <div className="panel__header">

          <h2 className="panel__title">
            Catálogo
          </h2>

          <div className="catalog-tabs">

            <button
              className={`catalog-tab ${
                modoCatalogo === 'deportes'
                  ? 'catalog-tab--active'
                  : ''
              }`}
              onClick={() =>
                setModoCatalogo('deportes')
              }
            >
              Deportes
            </button>

            <button
              className={`catalog-tab ${
                modoCatalogo === 'gimnasio'
                  ? 'catalog-tab--active'
                  : ''
              }`}
              onClick={() =>
                setModoCatalogo('gimnasio')
              }
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

            {/* Filtro por grupo muscular */}
            <div
              className="modal-field"
              style={{ marginBottom: '16px' }}
            >
              <label>
                Filtrar por grupo muscular
              </label>

              <select
                value={grupoFiltro}
                onChange={(e) =>
                  setGrupoFiltro(e.target.value)
                }
              >
                <option value="">
                  Todos
                </option>

                {Object.entries(gruposMusculares).map(
                  ([key, g]) => (
                    <option
                      key={key}
                      value={g.label}
                    >
                      {g.icono} {g.label}
                    </option>
                  )
                )}
              </select>
            </div>

            {errorEjercicios && (
              <div
                className="error-container"
                style={{ marginTop: '16px' }}
              >
                <p>
                  ⚠️ Error al cargar ejercicios:{' '}
                  {errorEjercicios}
                </p>
              </div>
            )}

            {loadingEjercicios ? (
              <div className="loading-container">

                <div className="loading-spinner"></div>

                <p>
                  Cargando ejercicios...
                </p>

              </div>
            ) : (
              <div className="exercise-grid">

                {ejerciciosFiltrados.length > 0 ? (
                  ejerciciosFiltrados.map(ej => (
                    <ExerciseCard
                      key={ej.id}
                      ejercicio={ej}
                      mapaMusculos={mapaMusculos}
                      onSelect={
                        handleSeleccionarEjercicio
                      }
                    />
                  ))
                ) : (
                  <p
                    style={{
                      color: 'var(--text-muted)'
                    }}
                  >
                    No se encontraron ejercicios
                    con esos filtros.
                  </p>
                )}

              </div>
            )}

          </>
        )}

        {modoCatalogo === 'deportes' && (
          <SportsCatalog
            onSelectSport={
              handleSeleccionarDeporte
            }
          />
        )}

      </div>

    </section>
  )
}

export default Actividades