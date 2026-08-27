import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/AuthContext'

export function usePerfil() {
  const { currentUser } = useAuth()
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      setNombre('')
      setLoading(false)
      return
    }

    const cargarPerfil = async () => {
      try {
        const ref = doc(db, 'users', currentUser.uid, 'perfil', 'info')
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setNombre(snap.data().nombre || currentUser.email?.split('@')[0] || 'Usuario')
        } else {
          const defaultName = currentUser.email?.split('@')[0] || 'Usuario'
          await setDoc(ref, { nombre: defaultName })
          setNombre(defaultName)
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err)
        setNombre(currentUser.email?.split('@')[0] || 'Usuario')
      } finally {
        setLoading(false)
      }
    }

    cargarPerfil()
  }, [currentUser])

  const guardarNombre = async (nuevoNombre) => {
    if (!currentUser || !nuevoNombre.trim()) return
    try {
      const ref = doc(db, 'users', currentUser.uid, 'perfil', 'info')
      await setDoc(ref, { nombre: nuevoNombre.trim() }, { merge: true })
      setNombre(nuevoNombre.trim())
    } catch (err) {
      console.error('Error al guardar nombre:', err)
    }
  }

  return { nombre, loading, guardarNombre }
}