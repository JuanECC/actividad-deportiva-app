import { useState, useEffect } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/useAuth'
export const METAS_DEFAULT = { distancia: 100, fuerza: 8, suenio: 240 }
export function usePerfil() {
  const { currentUser } = useAuth(),
    uid = currentUser?.uid
  const [state, setState] = useState({
    uid: null,
    data: {},
    loading: true,
    error: null,
  })
  useEffect(() => {
    if (!uid) {
      setState({ uid: null, data: {}, loading: false, error: null })
      return
    }
    setState({ uid, data: {}, loading: true, error: null })
    return onSnapshot(
      doc(db, 'users', uid, 'perfil', 'info'),
      (s) =>
        setState({ uid, data: s.data() || {}, loading: false, error: null }),
      () =>
        setState((s) => ({
          ...s,
          loading: false,
          error: 'No se pudo cargar tu perfil. Recarga para reintentar.',
        })),
    )
  }, [uid])
  const data = state.uid === uid ? state.data : {}
  const guardar = async (patch) => {
    if (!uid) throw new Error('Inicia sesión para guardar.')
    await setDoc(doc(db, 'users', uid, 'perfil', 'info'), patch, {
      merge: true,
    })
  }
  const guardarNombre = async (nombre) => {
    if (!nombre.trim() || nombre.trim().length > 80)
      throw new Error('Escribe un nombre de 1 a 80 caracteres.')
    await guardar({ nombre: nombre.trim() })
  }
  const guardarMetas = async (metas) => {
    const clean = Object.fromEntries(
      Object.keys(METAS_DEFAULT).map((k) => [k, Number(metas[k])]),
    )
    if (
      Object.values(clean).some(
        (v) => !Number.isFinite(v) || v <= 0 || v > 100000,
      ) ||
      !Number.isInteger(clean.fuerza)
    )
      throw new Error('Usa metas positivas; las sesiones deben ser enteras.')
    await guardar({ metas: clean })
  }
  return {
    nombre: data.nombre || currentUser?.email?.split('@')[0] || '',
    metas: { ...METAS_DEFAULT, ...data.metas },
    guardarNombre,
    guardarMetas,
    loading: !!uid && (state.uid !== uid || state.loading),
    error: state.uid === uid ? state.error : null,
  }
}
