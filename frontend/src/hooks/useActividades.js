import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc
} from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/AuthContext'

export function useActividades() {
  const { currentUser } = useAuth()
  const [actividades, setActividades] = useState([])
  const [planes, setPlanes] = useState([])
  const [sesiones, setSesiones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentUser) {
      setActividades([])
      setPlanes([])
      setSesiones([])
      setLoading(false)
      return
    }

    setLoading(true)
    const actividadesRef = collection(db, 'users', currentUser.uid, 'actividades')
    const q = query(actividadesRef, orderBy('fecha', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const all = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setActividades(all)
        setPlanes(all.filter((a) => a.esPlan === true))
        setSesiones(all.filter((a) => a.esPlan !== true))
        setLoading(false)
      },
      (err) => {
        console.error('Error al cargar actividades:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [currentUser])

  const actualizarEstadoPlan = async (planId, sesionesDelPlan) => {
    if (!currentUser) return
    const plan = planes.find((p) => p.id === planId)
    if (!plan) return

    const totalSesiones = plan.diasSeleccionados.length * plan.semanas
    const completadas = sesionesDelPlan.length
    const completado = completadas >= totalSesiones

    try {
      const planRef = doc(db, 'users', currentUser.uid, 'actividades', planId)
      await updateDoc(planRef, { completado })
    } catch (err) {
      console.error('Error al actualizar plan:', err)
      setError(err.message)
    }
  }

  const agregarActividad = async (nuevaActividad) => {
    if (!currentUser) return

    try {
      const actividadesRef = collection(db, 'users', currentUser.uid, 'actividades')
      const esPlan =
        nuevaActividad.diasSeleccionados &&
        nuevaActividad.diasSeleccionados.length > 0

      const datos = {
        ...nuevaActividad,
        esPlan,
        completado: false,
        fecha: esPlan
          ? nuevaActividad.fechaInicio || new Date().toISOString()
          : nuevaActividad.fecha,
        planId: esPlan ? null : nuevaActividad.planId || null,
      }

      await addDoc(actividadesRef, datos)
    } catch (err) {
      console.error('Error al agregar actividad:', err)
      setError(err.message)
    }
  }

  const marcarSesion = async (plan, fecha) => {
    if (!currentUser) return
    try {
      const actividadesRef = collection(db, 'users', currentUser.uid, 'actividades')
      await addDoc(actividadesRef, {
        tipo: plan.tipo,
        deporte: plan.deporte,
        nombre: plan.nombre,
        fecha: new Date().toISOString(), // ✅ FECHA REAL
        meta: `Completado · ${new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
        })}`,
        distancia: plan.distancia,
        duracion: plan.duracion,
        ritmo: plan.ritmo,
        tag: plan.tag,
        tagType: plan.tagType,
        diasSeleccionados: [],
        semanas: 1,
        esPlan: false,
        planId: plan.id,
      })

      const sesionesDelPlan = sesiones.filter((s) => s.planId === plan.id)
      sesionesDelPlan.push({ planId: plan.id })
      await actualizarEstadoPlan(plan.id, sesionesDelPlan)
    } catch (err) {
      console.error('Error al marcar sesión:', err)
      setError(err.message)
    }
  }

  const desmarcarSesion = async (plan, fecha) => {
    if (!currentUser) return
    try {
      const sesion = sesiones.find((s) => {
        if (s.planId !== plan.id) return false
        const f1 = new Date(s.fecha)
        const f2 = new Date(fecha)
        return (
          f1.getDate() === f2.getDate() &&
          f1.getMonth() === f2.getMonth() &&
          f1.getFullYear() === f2.getFullYear()
        )
      })
      if (sesion) {
        const sesionRef = doc(db, 'users', currentUser.uid, 'actividades', sesion.id)
        await deleteDoc(sesionRef)

        const sesionesDelPlan = sesiones.filter(
          (s) => s.planId === plan.id && s.id !== sesion.id
        )
        await actualizarEstadoPlan(plan.id, sesionesDelPlan)
      }
    } catch (err) {
      console.error('Error al desmarcar sesión:', err)
      setError(err.message)
    }
  }

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
    planes,
    sesiones,
    loading,
    error,
    agregarActividad,
    eliminarActividad,
    marcarSesion,
    desmarcarSesion,
  }
}