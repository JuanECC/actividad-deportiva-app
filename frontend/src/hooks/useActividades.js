import { useState, useEffect } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
} from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/useAuth'
import {
  fechaLocal,
  fechasPlan,
  progresoPlan,
  minutosEntrada,
} from '../utils/actividad'
import { actividadSchema } from '../utils/validations'

export function useActividades() {
  const { currentUser } = useAuth()
  const uid = currentUser?.uid
  const [state, setState] = useState({
    uid: null,
    items: [],
    loading: true,
    error: null,
  })
  useEffect(() => {
    if (!uid) {
      setState({ uid: null, items: [], loading: false, error: null })
      return
    }
    setState({ uid, items: [], loading: true, error: null })
    return onSnapshot(
      query(
        collection(db, 'users', uid, 'actividades'),
        orderBy('fecha', 'desc'),
      ),
      (snapshot) =>
        setState({
          uid,
          items: snapshot.docs.map((d) => ({ ...d.data(), id: d.id })),
          loading: false,
          error: null,
        }),
      () =>
        setState((s) => ({
          ...s,
          loading: false,
          error:
            'No se pudieron cargar las actividades. Recarga para reintentar.',
        })),
    )
  }, [uid])
  const actividades = state.uid === uid ? state.items : []
  const sesiones = actividades.filter((a) => !a.esPlan)
  const planes = actividades
    .filter((a) => a.esPlan)
    .map((p) => ({ ...p, ...progresoPlan(p, sesiones) }))
  const ref = (id) => {
    if (!uid) throw new Error('Inicia sesión para guardar cambios.')
    return doc(db, 'users', uid, 'actividades', id)
  }
  const agregarActividad = async (entrada) => {
    const clean = actividadSchema.parse(entrada)
    const esPlan = clean.diasSeleccionados.length > 0
    const datos = {
      ...clean,
      esPlan,
      duracionMinutos: minutosEntrada(clean.duracion),
      fecha: clean.fecha,
      planId: entrada.planId || null,
      modoFuerza: entrada.modoFuerza || 'rounds',
      tagType: clean.tag === 'Récord' ? 'pr' : '',
    }
    if (esPlan) datos.planId = null
    if (!uid) throw new Error('Inicia sesión para guardar cambios.')
    if (state.uid !== uid || state.loading || state.error)
      throw new Error(
        'Espera a que termine de cargar el historial antes de guardar.',
      )
    const sessionId = datos.planId ? datos.planId + '_' + datos.fecha : null
    const original = actividades.find((a) => a.id === entrada.id)
    const mover = Boolean(
      entrada.id && sessionId && fechaLocal(original?.fecha) !== datos.fecha,
    )
    const source = entrada.id ? ref(entrada.id) : null
    const target =
      entrada.id && !mover
        ? source
        : sessionId
          ? ref(sessionId)
          : doc(collection(db, 'users', uid, 'actividades'))
    // Includes legacy IDs; deterministic IDs protect simultaneous new submissions.
    if (
      datos.planId &&
      sesiones.some(
        (s) =>
          s.planId === datos.planId &&
          fechaLocal(s.fecha) === datos.fecha &&
          s.id !== entrada.id,
      )
    )
      throw new Error('Ese día ya tiene una sesión registrada.')
    await runTransaction(db, async (tx) => {
      const destination = await tx.get(target)
      const existing = mover ? await tx.get(source) : destination
      let parent = null
      if (datos.planId) parent = await tx.get(ref(datos.planId))
      if (entrada.id && !existing.exists())
        throw new Error('El registro ya fue eliminado.')
      if ((!entrada.id || mover) && destination.exists())
        throw new Error('Ese día ya tiene una sesión registrada.')
      if (
        parent &&
        ((!parent.exists() && (!entrada.id || mover)) ||
          (parent.exists() &&
            (!entrada.id || mover) &&
            (!parent.data().esPlan ||
              !fechasPlan(parent.data()).includes(datos.fecha))))
      )
        throw new Error('El plan o la fecha ya no están disponibles.')
      if (existing.exists()) {
        const old = existing.data()
        if (Boolean(old.esPlan) !== esPlan)
          throw new Error(
            'No se puede convertir un plan en sesión ni una sesión en plan.',
          )
        if (
          old.esPlan &&
          (fechaLocal(old.fecha) !== datos.fecha ||
            JSON.stringify(old.diasSeleccionados) !==
              JSON.stringify(datos.diasSeleccionados) ||
            old.semanas !== datos.semanas)
        )
          throw new Error(
            'El calendario de un plan existente no se puede cambiar; crea otro plan.',
          )
        if (old.planId && old.planId !== datos.planId)
          throw new Error('No se puede cambiar el plan de una sesión.')
      }
      if (mover) tx.delete(source)
      tx.set(target, datos)
    })
  }
  const eliminarActividad = async (id) => {
    await runTransaction(db, async (tx) => {
      const target = ref(id)
      await tx.get(target)
      tx.delete(target)
    })
  }
  const desmarcarSesion = async (plan, fecha) => {
    const ids = sesiones
      .filter(
        (s) =>
          s.planId === plan.id && fechaLocal(s.fecha) === fechaLocal(fecha),
      )
      .map((s) => s.id)
    if (!ids.length) return
    await runTransaction(db, async (tx) => {
      const refs = ids.map(ref)
      await Promise.all(refs.map((r) => tx.get(r)))
      refs.forEach((r) => tx.delete(r))
    })
  }
  return {
    actividades,
    planes,
    sesiones,
    loading: !!uid && (state.uid !== uid || state.loading),
    error: state.uid === uid ? state.error : null,
    agregarActividad,
    eliminarActividad,
    desmarcarSesion,
  }
}
