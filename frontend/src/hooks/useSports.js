import { useState, useEffect } from 'react'
import { getAllSports } from '../services/sportsApi'

export function useSports() {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarDeportes = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllSports()
        setSports(data)
      } catch (err) {
        console.error('Error al cargar deportes:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    cargarDeportes()
  }, [])

  return { sports, loading, error }
}