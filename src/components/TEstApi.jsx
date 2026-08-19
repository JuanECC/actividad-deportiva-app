// src/components/TestApi.jsx
import React, { useEffect } from 'react'
import { useEjercicios } from '../hooks/useEjercicios'
import { useMusculos } from '../hooks/useMusculos'
import { useCategorias } from '../hooks/useCategorias'

function TestApi() {
  const { ejercicios, loading: loadingEjercicios, error: errorEjercicios } = useEjercicios()
  const { musculos, loading: loadingMusculos, error: errorMusculos } = useMusculos()
  const { categorias, loading: loadingCategorias, error: errorCategorias } = useCategorias()

  // Mostrar datos en consola cuando carguen
  useEffect(() => {
    if (ejercicios.length > 0) {
      console.log('✅ EJERCICIOS cargados:', ejercicios.length)
      console.log('Primer ejercicio:', ejercicios[0])
    }
  }, [ejercicios])

  useEffect(() => {
    if (musculos.length > 0) {
      console.log('✅ MÚSCULOS cargados:', musculos.length)
      console.log('Primer músculo:', musculos[0])
    }
  }, [musculos])

  useEffect(() => {
    if (categorias.length > 0) {
      console.log('✅ CATEGORÍAS cargadas:', categorias.length)
      console.log('Primera categoría:', categorias[0])
    }
  }, [categorias])

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧪 Prueba de API Wger</h2>
      
      <div style={{ marginTop: '16px' }}>
        <h3>📊 Estado de carga</h3>
        <p>Ejercicios: {loadingEjercicios ? '⏳ Cargando...' : `✅ ${ejercicios.length} cargados`}</p>
        <p>Músculos: {loadingMusculos ? '⏳ Cargando...' : `✅ ${musculos.length} cargados`}</p>
        <p>Categorías: {loadingCategorias ? '⏳ Cargando...' : `✅ ${categorias.length} cargadas`}</p>
      </div>

      {errorEjercicios && (
        <div style={{ marginTop: '16px', color: 'red' }}>
          <p>❌ Error en ejercicios: {errorEjercicios}</p>
        </div>
      )}
      {errorMusculos && (
        <div style={{ marginTop: '16px', color: 'red' }}>
          <p>❌ Error en músculos: {errorMusculos}</p>
        </div>
      )}
      {errorCategorias && (
        <div style={{ marginTop: '16px', color: 'red' }}>
          <p>❌ Error en categorías: {errorCategorias}</p>
        </div>
      )}

      <div style={{ marginTop: '16px' }}>
        <h3>🔍 Primeros resultados</h3>
        {ejercicios.length > 0 && (
          <div>
            <h4>Ejercicios:</h4>
            <ul>
              {ejercicios.slice(0, 5).map(ej => (
                <li key={ej.id}>ID: {ej.id} — Categoría: {ej.category}</li>
              ))}
            </ul>
          </div>
        )}
        {musculos.length > 0 && (
          <div>
            <h4>Músculos:</h4>
            <ul>
              {musculos.slice(0, 5).map(m => (
                <li key={m.id}>{m.name} ({m.name_en})</li>
              ))}
            </ul>
          </div>
        )}
        {categorias.length > 0 && (
          <div>
            <h4>Categorías:</h4>
            <ul>
              {categorias.slice(0, 5).map(c => (
                <li key={c.id}>{c.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestApi