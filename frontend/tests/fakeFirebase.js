// Synthetic in-memory data, exclusively for tests/ui.config.js.
import { fechaLocal } from '../src/utils/actividad'
const today = fechaLocal(),
  yesterday = new Date(today + 'T12:00:00')
yesterday.setDate(yesterday.getDate() - 1)
const uid = 'ui-test',
  root = 'users/' + uid + '/',
  callbacks = new Set()
let user = { uid, email: 'prueba@example.test' },
  sequence = 0,
  tail = Promise.resolve()
const data = new Map([
  [
    root + 'perfil/info',
    {
      nombre: 'Prueba local',
      metas: { distancia: 100, fuerza: 8, suenio: 240 },
    },
  ],
  [
    root + 'actividades/p1',
    {
      nombre: 'Plan de carrera',
      tipo: 'run',
      deporte: 'Correr',
      fecha: fechaLocal(yesterday),
      duracion: '30',
      duracionMinutos: 30,
      distancia: '5',
      ritmo: '6:00',
      tag: 'Entrenamiento',
      esPlan: true,
      planId: null,
      diasSeleccionados: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
      semanas: 1,
    },
  ],
  [
    root + 'actividades/s1',
    {
      nombre: 'Carrera matutina',
      tipo: 'run',
      deporte: 'Correr',
      fecha: fechaLocal(yesterday),
      duracion: '42:10',
      duracionMinutos: 42 + 10 / 60,
      distancia: '8',
      ritmo: '5:16',
      tag: 'Entrenamiento',
      esPlan: false,
      planId: null,
      diasSeleccionados: [],
      semanas: 1,
    },
  ],
])
export const initializeApp = () => ({})
export const getAuth = () => ({})
export const getFirestore = () => ({})
export const collection = (_, ...parts) => ({
  path: parts.join('/'),
  collection: true,
})
export const doc = (parent, ...parts) => ({
  path: parent.path
    ? parent.path + '/' + (parts.join('/') || 'generated' + ++sequence)
    : parts.join('/'),
})
export const query = (ref) => ref
export const orderBy = () => null
const snapshot = (ref) =>
  ref.collection
    ? {
        docs: [...data.entries()]
          .filter(([path]) => path.startsWith(ref.path + '/'))
          .sort((a, b) => String(b[1].fecha).localeCompare(String(a[1].fecha)))
          .map(([path, value]) => ({
            id: path.split('/').at(-1),
            data: () => ({ ...value }),
          })),
      }
    : { exists: () => data.has(ref.path), data: () => data.get(ref.path) }
const emit = () => callbacks.forEach((cb) => cb())
export const onSnapshot = (ref, callback) => {
  let active = true
  const notify = () => {
    if (active) callback(snapshot(ref))
  }
  callbacks.add(notify)
  queueMicrotask(notify)
  return () => {
    active = false
    callbacks.delete(notify)
  }
}
export const setDoc = async (ref, value, options) => {
  data.set(
    ref.path,
    options?.merge ? { ...data.get(ref.path), ...value } : value,
  )
  emit()
}
export const deleteDoc = async (ref) => {
  data.delete(ref.path)
  emit()
}
export const runTransaction = (_, fn) => {
  const run = tail.then(async () => {
    const writes = []
    await fn({
      get: async (ref) => snapshot(ref),
      set: (ref, value) => writes.push(() => data.set(ref.path, value)),
      delete: (ref) => writes.push(() => data.delete(ref.path)),
    })
    writes.forEach((f) => f())
    emit()
  })
  tail = run.catch(() => {})
  return run
}
const authCallbacks = new Set()
export const onAuthStateChanged = (_, callback) => {
  authCallbacks.add(callback)
  queueMicrotask(() => {
    if (authCallbacks.has(callback)) callback(user)
  })
  return () => authCallbacks.delete(callback)
}
export const signOut = async () => {
  user = null
  authCallbacks.forEach((f) => f(user))
}
export const signInWithEmailAndPassword = async () => {
  user = { uid, email: 'prueba@example.test' }
  authCallbacks.forEach((f) => f(user))
}
export const createUserWithEmailAndPassword = signInWithEmailAndPassword
