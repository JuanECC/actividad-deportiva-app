// src/hooks/useEjercicios.js
import { useState, useEffect } from 'react'
import { getEjercicios } from '../services/wgerApi'

/**
 * Hook personalizado para obtener ejercicios desde la API Wger
 * @param {Object} filtros - Filtros de búsqueda (categoria, musculo, equipamiento)
 * @returns {Object} { ejercicios, loading, error }
 */
export function useEjercicios(filtros = {}) {
  const [ejercicios, setEjercicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarEjercicios = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getEjercicios({
          limit: 20,
          ...filtros
        })
        
        setEjercicios(data.results || [])
      } catch (err) {
        console.error('Error al cargar ejercicios:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    cargarEjercicios()
  }, [filtros.categoria, filtros.musculo, filtros.equipamiento])

  return { ejercicios, loading, error }
}