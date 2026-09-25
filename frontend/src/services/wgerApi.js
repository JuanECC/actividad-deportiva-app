import { get } from './apiClient'
export function parametrosEjercicios(params = {}) {
  const query = new URLSearchParams({
    limit: String(params.limit || 20),
    offset: String(params.offset || 0),
  })
  for (const key of ['category', 'muscles', 'equipment'])
    if (params[key]) query.set(key, params[key])
  return query.toString()
}
export const getEjercicios = (params = {}, signal) =>
  get('/exerciseinfo/?' + parametrosEjercicios(params), undefined, { signal })
const cache = new Map()
function catalog(endpoint) {
  if (!cache.has(endpoint))
    cache.set(
      endpoint,
      get(endpoint).catch((e) => {
        cache.delete(endpoint)
        throw e
      }),
    )
  return cache.get(endpoint)
}
export const getMusculos = () => catalog('/muscle/?limit=100')
export const getCategorias = () => catalog('/exercisecategory/?limit=100')
export const getEquipamiento = () => catalog('/equipment/?limit=100')
export const getIdiomas = () => catalog('/language/?limit=100')
export const getDetalleEjercicio = (id) => get('/exerciseinfo/' + id + '/')
export const getImagenesEjercicio = (id) =>
  get('/exerciseimage/?exercise=' + id)
export const getIngredientes = (params = {}) =>
  get('/ingredient/?' + new URLSearchParams(params))
export function traduccionEjercicio(exercise, languages = []) {
  const es = languages.find((l) => l.short_name === 'es')?.id
  const en = languages.find((l) => l.short_name === 'en')?.id
  const translations = exercise.translations || []
  return (
    translations.find((t) => t.language === es) ||
    translations.find((t) => t.language === en) ||
    translations[0] || {
      name: exercise.name || 'Ejercicio sin nombre',
      description: '',
    }
  )
}
