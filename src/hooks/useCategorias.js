// src/hooks/useCategorias.js
import { useState, useEffect } from 'react'
import { getCategorias } from '../services/wgerApi'

/**
 * Hook personalizado para obtener categorías de ejercicio desde Wger
 * @returns {Object} { categorias, loading, error }
 */
export function useCategorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getCategorias()
        
        setCategorias(data.results || [])
      } catch (err) {
        console.error('Error al cargar categorías:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    cargarCategorias()
  }, [])

  return { categorias, loading, error }
}