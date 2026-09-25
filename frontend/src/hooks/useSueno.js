import { useState, useEffect } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/useAuth'
import { suenoSchema } from '../utils/validations'
export function useSueno() {
  const { currentUser } = useAuth(),
    uid = currentUser?.uid
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
      query(collection(db, 'users', uid, 'sueno'), orderBy('fecha', 'desc')),
      (s) =>
        setState({
          uid,
          items: s.docs.map((d) => ({ ...d.data(), id: d.id })),
          loading: false,
          error: null,
        }),
      () =>
        setState((s) => ({
          ...s,
          loading: false,
          error: 'No se pudo cargar el sueño. Recarga para reintentar.',
        })),
    )
  }, [uid])
  const registros = state.uid === uid ? state.items : []
  const agregarSueno = async (entrada) => {
    if (!uid) throw new Error('Inicia sesión para guardar.')
    const data = suenoSchema.parse(entrada)
    if (registros.some((r) => r.fecha === data.fecha))
      throw new Error(
        'Ya existe un registro en esa fecha. Elimínalo antes de reemplazarlo.',
      )
    const [h1, m1] = data.horaDormir.split(':').map(Number),
      [h2, m2] = data.horaDespertar.split(':').map(Number)
    const duracionMinutos = (h2 * 60 + m2 - h1 * 60 - m1 + 1440) % 1440
    const target = doc(db, 'users', uid, 'sueno', data.fecha)
    await runTransaction(db, async (tx) => {
      const existing = await tx.get(target)
      if (existing.exists())
        throw new Error('Ya existe un registro en esa fecha.')
      tx.set(target, { ...data, duracionMinutos, esSueno: true })
    })
  }
  const eliminarSueno = async (id) => {
    if (!uid) throw new Error('Inicia sesión para eliminar.')
    await deleteDoc(doc(db, 'users', uid, 'sueno', id))
  }
  return {
    registros,
    loading: !!uid && (state.uid !== uid || state.loading),
    error: state.uid === uid ? state.error : null,
    agregarSueno,
    eliminarSueno,
  }
}
