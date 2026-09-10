import { useState, useEffect } from 'react'
import { getMusculos } from '../services/wgerApi'
import { obtenerGrupoPorMusculo } from '../utils/gruposMusculares'

export function useMusculosMap() {
  const [mapa, setMapa] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getMusculos()
        const nuevoMapa = {}
        ;(data.results || []).forEach(m => {
          const grupo = obtenerGrupoPorMusculo(m.name, m.name_en)
          nuevoMapa[m.id] = {
            nombre: m.name,
            nombreEn: m.name_en,
            grupo: grupo ? grupo.label : 'Otro',
            icono: grupo ? grupo.icono : '🏋️'
          }
        })
        setMapa(nuevoMapa)
      } catch (err) {
        console.error('Error al cargar músculos:', err)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  return { mapaMusculos: mapa, loadingMusculos: loading }
}