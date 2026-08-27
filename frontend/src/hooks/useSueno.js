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

function calcularDuracion(horaDormir, horaDespertar) {
  const [h1, m1] = horaDormir.split(':').map(Number)
  const [h2, m2] = horaDespertar.split(':').map(Number)
  let minutos = h2 * 60 + m2 - (h1 * 60 + m1)
  if (minutos < 0) minutos += 24 * 60
  return minutos
}

function calcularCalidad(minutos) {
  if (minutos >= 480) return 'Excelente'
  if (minutos >= 360) return 'Buena'
  if (minutos >= 240) return 'Regular'
  return 'Pobre'
}

export function useSueno() {
  const { currentUser } = useAuth()
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentUser) {
      setRegistros([])
      setLoading(false)
      return
    }

    setLoading(true)
    const ref = collection(db, 'users', currentUser.uid, 'sueno')
    const q = query(ref, orderBy('fecha', 'desc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setRegistros(data)
      setLoading(false)
    }, (err) => {
      console.error('Error al cargar sueño:', err)
      setError(err.message)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [currentUser])

  const agregarSueno = async ({ fecha, horaDormir, horaDespertar }) => {
    if (!currentUser) return
    try {
      const ref = collection(db, 'users', currentUser.uid, 'sueno')
      const duracionMinutos = calcularDuracion(horaDormir, horaDespertar)
      const calidad = calcularCalidad(duracionMinutos)

      await addDoc(ref, {
        fecha,
        horaDormir,
        horaDespertar,
        duracionMinutos,
        calidad,
        esSueno: true
      })
    } catch (err) {
      console.error('Error al agregar sueño:', err)
      setError(err.message)
    }
  }

  const eliminarSueno = async (id) => {
    if (!currentUser) return
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'sueno', id))
    } catch (err) {
      console.error('Error al eliminar sueño:', err)
      setError(err.message)
    }
  }

  return {
    registros,
    loading,
    error,
    agregarSueno,
    eliminarSueno
  }
}