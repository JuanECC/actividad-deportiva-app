// src/hooks/useMusculos.js
import { useState, useEffect } from 'react'
import { getMusculos } from '../services/wgerApi'

/**
 * Hook personalizado para obtener grupos musculares desde Wger
 * @returns {Object} { musculos, loading, error }
 */
export function useMusculos() {
  const [musculos, setMusculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarMusculos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getMusculos()
        
        setMusculos(data.results || [])
      } catch (err) {
        console.error('Error al cargar músculos:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    cargarMusculos()
  }, [])

  return { musculos, loading, error }
}