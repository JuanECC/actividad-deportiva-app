// src/hooks/useActividades.js
import { useState, useEffect } from 'react'
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/AuthContext'

export function useActividades() {
  const { currentUser } = useAuth()
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentUser) {
      setActividades([])
      setLoading(false)
      return
    }

    setLoading(true)

    // Referencia a la colección de actividades del usuario
    const actividadesRef = collection(db, 'users', currentUser.uid, 'actividades')
    
    // Query ordenada por fecha (más recientes primero)
    const q = query(actividadesRef, orderBy('fecha', 'desc'))

    // Escuchar cambios en tiempo real
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const actividadesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setActividades(actividadesData)
        setLoading(false)
      },
      (err) => {
        console.error('Error al cargar actividades:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    // Limpiar suscripción al desmontar
    return () => unsubscribe()
  }, [currentUser])

  // Función para agregar actividad
  const agregarActividad = async (nuevaActividad) => {
    if (!currentUser) return

    try {
      const actividadesRef = collection(db, 'users', currentUser.uid, 'actividades')
      await addDoc(actividadesRef, {
        ...nuevaActividad,
        fecha: new Date().toISOString()
      })
    } catch (err) {
      console.error('Error al agregar actividad:', err)
      setError(err.message)
    }
  }

  // Función para eliminar actividad
  const eliminarActividad = async (id) => {
    if (!currentUser) return

    try {
      const actividadRef = doc(db, 'users', currentUser.uid, 'actividades', id)
      await deleteDoc(actividadRef)
    } catch (err) {
      console.error('Error al eliminar actividad:', err)
      setError(err.message)
    }
  }

  return {
    actividades,
    loading,
    error,
    agregarActividad,
    eliminarActividad
  }
}