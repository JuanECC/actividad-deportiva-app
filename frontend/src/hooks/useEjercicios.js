import { useState, useEffect } from 'react'
import { getEjercicios } from '../services/wgerApi'
export function useEjercicios({
  category = '',
  muscles = '',
  equipment = '',
  offset = 0,
} = {}) {
  const [attempt, setAttempt] = useState(0),
    [state, setState] = useState({
      ejercicios: [],
      loading: true,
      error: null,
      count: 0,
    })
  useEffect(() => {
    const controller = new AbortController()
    setState({ ejercicios: [], loading: true, error: null, count: 0 })
    getEjercicios(
      { category, muscles, equipment, offset, limit: 20 },
      controller.signal,
    )
      .then((data) => {
        if (!controller.signal.aborted)
          setState({
            ejercicios: data.results || [],
            count: data.count || 0,
            loading: false,
            error: null,
          })
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({
            ejercicios: [],
            count: 0,
            loading: false,
            error: error.message,
          })
      })
    return () => controller.abort()
  }, [category, muscles, equipment, offset, attempt])
  return { ...state, reintentar: () => setAttempt((n) => n + 1) }
}
