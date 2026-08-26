import { useState, useEffect } from 'react'
import { getEquipamiento } from '../services/wgerApi'

export function useEquipamiento() {
  const [equipamiento, setEquipamiento] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarEquipamiento = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getEquipamiento()
        setEquipamiento(data.results || [])
      } catch (err) {
        console.error('Error al cargar equipamiento:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    cargarEquipamiento()
  }, [])

  return { equipamiento, loading, error }
}