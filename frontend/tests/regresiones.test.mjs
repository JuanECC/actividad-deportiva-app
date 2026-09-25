import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import {
  fechaLocal,
  fechaValida,
  minutosEntrada,
  minutosActividad,
  duracionTexto,
  distanciaKm,
  filtrarRango,
  fechasPlan,
  progresoPlan,
  rachaActual,
  resumenActividades,
} from '../src/utils/actividad.js'
import { actividadSchema, suenoSchema } from '../src/utils/validations.js'
process.env.TZ = 'America/Mexico_City'
const base = {
  tipo: 'run',
  deporte: 'Correr',
  nombre: 'Carrera de prueba',
  fecha: '2026-09-21',
  distancia: '5',
  duracion: '30',
  ritmo: '6:00',
  tag: 'Entrenamiento',
  diasSeleccionados: [],
  semanas: 1,
}
const plan = {
  ...base,
  id: 'p1',
  esPlan: true,
  diasSeleccionados: ['L', 'J'],
  modoFuerza: 'tiempo',
}
test('duraciones admitidas conservan minutos y segundos', () => {
  assert.equal(minutosEntrada('1h 30min'), 90)
  assert.equal(minutosEntrada('42:10'), 42 + 10 / 60)
  assert.equal(minutosEntrada('1:30:00'), 90)
  assert.equal(minutosEntrada('90'), 90)
  for (const input of ['-5', '1:90', 'abc', ' '])
    assert.ok(Number.isNaN(minutosEntrada(input)))
  assert.equal(minutosActividad({ duracion: '1:30' }), 90)
  assert.equal(
    minutosActividad({ duracion: '42:10', duracionMinutos: 42 + 10 / 60 }),
    42 + 10 / 60,
  )
  assert.equal(duracionTexto(42 + 10 / 60), '42min 10s')
})
test('fecha local no adelanta hoy ni mueve el primer día del mes', () => {
  assert.equal(fechaLocal(new Date('2026-09-24T20:00:00-06:00')), '2026-09-24')
  assert.equal(fechaLocal('2026-09-01'), '2026-09-01')
  assert.equal(fechaValida('2026-02-30'), false)
  assert.equal(
    filtrarRango(
      [{ fecha: '2026-09-01' }],
      'Mes',
      new Date('2026-09-24T12:00:00-06:00'),
    ).length,
    1,
  )
})
test('rango semanal incluye todo el domingo y excluye el lunes siguiente', () => {
  const items = [
    { fecha: '2026-09-20T23:59:59-06:00' },
    { fecha: '2026-09-21T00:00:00-06:00' },
  ]
  assert.equal(
    filtrarRango(items, 'Semana', new Date('2026-09-20T12:00:00-06:00')).length,
    1,
  )
})
test('rangos mes y año excluyen futuros y usan limites locales', () => {
  const items = ['2025-12-31', '2026-01-01', '2026-09-01', '2026-09-25'].map(
    (fecha) => ({ fecha }),
  )
  assert.equal(
    filtrarRango(items, 'Mes', new Date('2026-09-24T12:00:00')).length,
    1,
  )
  assert.equal(
    filtrarRango(items, 'Año', new Date('2026-09-24T12:00:00')).length,
    2,
  )
})
test('ritmo ponderado de carrera no mezcla natacion ni ciclismo', () => {
  const items = [
    { tipo: 'run', distancia: '5', duracionMinutos: 30 },
    { tipo: 'run', distancia: '15', duracionMinutos: 60 },
    { tipo: 'swim', distancia: '1000', duracionMinutos: 20 },
    { tipo: 'bike', distancia: '20', duracionMinutos: 50 },
  ]
  const s = resumenActividades(items)
  assert.equal(s.ritmo, '4:30')
  assert.equal(s.distancia, 41)
  assert.equal(s.minutos, 160)
  assert.equal(s.carreras, 2)
  assert.equal(distanciaKm({ tipo: 'sport', distancia: '2 goles' }), 0)
})
test('plan cuenta fechas unicas y se reabre tras quitar una sesion', () => {
  assert.deepEqual(fechasPlan(plan), ['2026-09-21', '2026-09-24'])
  const sessions = [
    { planId: 'p1', fecha: '2026-09-21' },
    { planId: 'p1', fecha: '2026-09-21' },
    { planId: 'p1', fecha: '2026-09-24' },
  ]
  assert.equal(progresoPlan(plan, sessions).completadas, 2)
  assert.equal(progresoPlan(plan, sessions).completado, true)
  assert.equal(progresoPlan(plan, sessions.slice(0, 2)).completado, false)
  assert.equal(
    progresoPlan(plan, [{ planId: 'p1', fecha: '2026-09-22' }]).completadas,
    0,
  )
})
test('racha de ayer se mantiene hasta terminar hoy', () => {
  const now = new Date('2026-09-24T12:00:00'),
    items = [{ fecha: '2026-09-22' }, { fecha: '2026-09-23' }]
  assert.equal(rachaActual(items, now), 2)
  assert.equal(rachaActual([{ fecha: '2026-09-22' }], now), 0)
})
test('validacion rechaza espacios, numeros negativos y deporte incompatible', () => {
  assert.equal(actividadSchema.safeParse(base).success, true)
  for (const change of [
    { nombre: '   ' },
    { distancia: '-5' },
    { duracion: '-5' },
    { deporte: '' },
    { deporte: 'Natación' },
    { fecha: '2026-02-30' },
  ])
    assert.equal(
      actividadSchema.safeParse({ ...base, ...change }).success,
      false,
    )
  assert.equal(
    actividadSchema.parse({
      ...base,
      tipo: 'sport',
      deporte: 'Fútbol',
      distancia: '2 goles, 3 asistencias',
    }).distancia,
    '2 goles, 3 asistencias',
  )
})
test('sueño valida horas distintas y fechas existentes', () => {
  assert.equal(
    suenoSchema.safeParse({
      fecha: '2026-09-21',
      horaDormir: '23:00',
      horaDespertar: '07:00',
    }).success,
    true,
  )
  assert.equal(
    suenoSchema.safeParse({
      fecha: '2026-09-21',
      horaDormir: '07:00',
      horaDespertar: '07:00',
    }).success,
    false,
  )
  assert.equal(
    suenoSchema.safeParse({
      fecha: '2026-09-21',
      horaDormir: '25:00',
      horaDespertar: '07:00',
    }).success,
    false,
  )
})
// Execute the real hook body with an in-memory transaction adapter. No Firebase/network.
function activityHarness(initial = [], fail = false) {
  const source = readFileSync(
    new URL('../src/hooks/useActividades.js', import.meta.url),
    'utf8',
  )
  const docs = new Map(initial.map((a) => [a.id, { ...a }]))
  let generated = 0,
    tail = Promise.resolve()
  const ctx = vm.createContext({
    fechaLocal,
    fechasPlan,
    progresoPlan,
    minutosEntrada,
    actividadSchema,
    useAuth: () => ({ currentUser: { uid: 'test' } }),
    useState: () => [
      { uid: 'test', items: initial, loading: false, error: null },
      () => {},
    ],
    useEffect: () => {},
    db: {},
    collection: () => ({ collection: true }),
    doc: (...args) => (args.length === 1 ? 'new' + ++generated : args.at(-1)),
    runTransaction: (_, fn) => {
      const run = tail.then(async () => {
        if (fail) throw Error('Connection rejected')
        const pending = []
        await fn({
          get: async (id) => ({
            exists: () => docs.has(id),
            data: () => docs.get(id),
          }),
          set: (id, data) => pending.push(() => docs.set(id, data)),
          delete: (id) => pending.push(() => docs.delete(id)),
        })
        pending.forEach((f) => f())
      })
      tail = run.catch(() => {})
      return run
    },
  })
  vm.runInContext(
    source
      .slice(source.indexOf('export function'))
      .replace('export function', 'function') + ';this.api=useActividades()',
    ctx,
  )
  return { api: ctx.api, docs }
}
test('errores de escritura llegan al formulario', async () => {
  const { api } = activityHarness([], true)
  await assert.rejects(api.agregarActividad(base), /Connection rejected/)
  await assert.rejects(api.eliminarActividad('x'), /Connection rejected/)
})
test('sesion usa fecha seleccionada y conserva modo de fuerza', async () => {
  const p = { ...plan, tipo: 'strength', deporte: 'Boxeo' },
    h = activityHarness([p])
  await h.api.agregarActividad({
    ...base,
    tipo: 'strength',
    deporte: 'Boxeo',
    planId: 'p1',
    fecha: '2026-09-21',
    modoFuerza: 'tiempo',
  })
  const saved = h.docs.get('p1_2026-09-21')
  assert.equal(saved.fecha, '2026-09-21')
  assert.equal(saved.modoFuerza, 'tiempo')
  assert.equal(saved.duracionMinutos, 30)
})
test('doble envio concurrente solo crea una sesion', async () => {
  const h = activityHarness([plan]),
    input = { ...base, planId: 'p1' }
  const outcomes = await Promise.allSettled([
    h.api.agregarActividad(input),
    h.api.agregarActividad(input),
  ])
  assert.equal(outcomes.filter((r) => r.status === 'fulfilled').length, 1)
  assert.equal(h.docs.size, 2)
})
test('sesion no se crea si el plan fue borrado o la fecha no pertenece al plan', async () => {
  await assert.rejects(
    activityHarness().api.agregarActividad({ ...base, planId: 'p1' }),
    /plan o la fecha/,
  )
  await assert.rejects(
    activityHarness([plan]).api.agregarActividad({
      ...base,
      planId: 'p1',
      fecha: '2026-09-22',
    }),
    /plan o la fecha/,
  )
})
test('borrar plan conserva sesiones y permite editar ese historial', async () => {
  const session = { ...base, id: 'old', planId: 'p1', esPlan: false },
    h = activityHarness([plan, session])
  await h.api.eliminarActividad('p1')
  assert.equal(h.docs.has('old'), true)
  await h.api.agregarActividad({ ...session, nombre: 'Nombre corregido' })
  assert.equal(h.docs.get('old').nombre, 'Nombre corregido')
})
test('edicion mueve una sesion de forma atomica y conserva el calendario del plan', async () => {
  const session = { ...base, id: 'old', planId: 'p1', esPlan: false },
    h = activityHarness([plan, session])
  await h.api.agregarActividad({ ...session, fecha: '2026-09-24' })
  assert.equal(h.docs.has('old'), false)
  assert.equal(h.docs.get('p1_2026-09-24').fecha, '2026-09-24')
  await assert.rejects(
    h.api.agregarActividad({ ...plan, fecha: '2026-09-22' }),
    /calendario/,
  )
})
test('desmarcar limpia duplicados antiguos de ese dia sin borrar otros', async () => {
  const h = activityHarness([
    plan,
    { ...base, id: 's1', planId: 'p1' },
    { ...base, id: 's2', planId: 'p1' },
    { ...base, id: 's3', fecha: '2026-09-24', planId: 'p1' },
  ])
  await h.api.desmarcarSesion(plan, '2026-09-21')
  assert.equal(h.docs.has('s1'), false)
  assert.equal(h.docs.has('s2'), false)
  assert.equal(h.docs.has('s3'), true)
})
test('Wger envía filtros y obtiene traduccion española con fallback', () => {
  const source = readFileSync(
    new URL('../src/services/wgerApi.js', import.meta.url),
    'utf8',
  )
    .replace(/^import .*$/gm, '')
    .replaceAll('export ', '')
  const ctx = vm.createContext({ URLSearchParams, get: () => {} })
  vm.runInContext(
    source +
      ';this.params=parametrosEjercicios;this.translate=traduccionEjercicio',
    ctx,
  )
  const p = new URLSearchParams(
    ctx.params({ category: '10', muscles: '1', equipment: '3', offset: 20 }),
  )
  assert.equal(p.get('category'), '10')
  assert.equal(p.get('muscles'), '1')
  assert.equal(p.get('equipment'), '3')
  assert.equal(p.get('offset'), '20')
  const exercise = {
      translations: [
        { language: 2, name: 'Squat' },
        { language: 4, name: 'Sentadilla' },
      ],
    },
    langs = [
      { id: 4, short_name: 'es' },
      { id: 2, short_name: 'en' },
    ]
  assert.equal(ctx.translate(exercise, langs).name, 'Sentadilla')
  assert.equal(
    ctx.translate({ translations: [exercise.translations[0]] }, langs).name,
    'Squat',
  )
})

test('duracion para editar conserva segundos sin decimales interminables', async () => {
  const { duracionParaEditar } = await import('../src/utils/actividad.js')
  assert.equal(duracionParaEditar(42 + 10 / 60), '42:10')
  assert.equal(duracionParaEditar(90), '1:30:00')
  assert.equal(minutosEntrada(duracionParaEditar(42 + 10 / 60)), 42 + 10 / 60)
})
test('grafico y comparacion cambian por periodo e incluyen domingo anterior', async () => {
  const { resumenPeriodo } = await import('../src/utils/actividad.js')
  const items = [
    { tipo: 'run', distancia: '5', fecha: '2026-09-20T23:59:59-06:00' },
    { tipo: 'run', distancia: '10', fecha: '2026-09-24' },
  ]
  const now = new Date('2026-09-24T12:00:00-06:00')
  const week = resumenPeriodo(items, 'Semana', now),
    month = resumenPeriodo(items, 'Mes', now),
    year = resumenPeriodo(items, 'Año', now)
  assert.equal(week.anterior.distancia, 5)
  assert.equal(week.barras.length, 7)
  assert.equal(month.barras.length, 30)
  assert.equal(year.barras.length, 12)
  assert.equal(
    week.barras.reduce((s, b) => s + b.distancia, 0),
    10,
  )
  assert.equal(
    month.barras.reduce((s, b) => s + b.distancia, 0),
    15,
  )
})

test('sueño propaga fallos y protege contra doble envio', async () => {
  const source = readFileSync(
    new URL('../src/hooks/useSueno.js', import.meta.url),
    'utf8',
  )
  const docs = new Map()
  let tail = Promise.resolve(),
    fail = false
  const ctx = vm.createContext({
    suenoSchema,
    useAuth: () => ({ currentUser: { uid: 'test' } }),
    useState: () => [
      { uid: 'test', items: [], loading: false, error: null },
      () => {},
    ],
    useEffect: () => {},
    db: {},
    doc: (_, ...parts) => parts.join('/'),
    deleteDoc: async () => {
      throw Error('Delete failed')
    },
    runTransaction: (_, fn) => {
      const run = tail.then(async () => {
        if (fail) throw Error('Write failed')
        const pending = []
        await fn({
          get: async (id) => ({ exists: () => docs.has(id) }),
          set: (id, data) => pending.push(() => docs.set(id, data)),
        })
        pending.forEach((f) => f())
      })
      tail = run.catch(() => {})
      return run
    },
  })
  vm.runInContext(
    source
      .slice(source.indexOf('export function'))
      .replace('export function', 'function') + ';this.api=useSueno()',
    ctx,
  )
  const input = {
    fecha: '2026-09-21',
    horaDormir: '23:00',
    horaDespertar: '07:00',
  }
  fail = true
  await assert.rejects(ctx.api.agregarSueno(input), /Write failed/)
  fail = false
  const results = await Promise.allSettled([
    ctx.api.agregarSueno(input),
    ctx.api.agregarSueno(input),
  ])
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1)
  assert.equal([...docs.values()][0].duracionMinutos, 480)
  await assert.rejects(ctx.api.eliminarSueno('x'), /Delete failed/)
})
test('perfil no informa exito cuando falla el guardado y valida metas', async () => {
  const source = readFileSync(
    new URL('../src/hooks/usePerfil.js', import.meta.url),
    'utf8',
  )
  let fail = true
  const writes = []
  const ctx = vm.createContext({
    useAuth: () => ({
      currentUser: { uid: 'test', email: 'test@example.test' },
    }),
    useState: () => [
      { uid: 'test', data: {}, loading: false, error: null },
      () => {},
    ],
    useEffect: () => {},
    db: {},
    doc: () => '',
    setDoc: async (_, data) => {
      if (fail) throw Error('Write failed')
      writes.push(data)
    },
  })
  vm.runInContext(
    source
      .slice(source.indexOf('export const METAS_DEFAULT'))
      .replaceAll('export ', '') + ';this.api=usePerfil()',
    ctx,
  )
  await assert.rejects(ctx.api.guardarNombre('Prueba'), /Write failed/)
  fail = false
  await assert.rejects(
    ctx.api.guardarMetas({ distancia: 100, fuerza: 1.5, suenio: 240 }),
    /positivas/,
  )
  await ctx.api.guardarMetas({ distancia: 50, fuerza: 8, suenio: 200 })
  assert.equal(writes[0].metas.distancia, 50)
})
test('mover una sesion no sobrescribe otro registro del mismo dia', async () => {
  const original = { ...base, id: 'old', planId: 'p1' },
    other = { ...base, id: 'p1_2026-09-24', planId: 'p1', fecha: '2026-09-24' },
    h = activityHarness([plan, original, other])
  await assert.rejects(
    h.api.agregarActividad({ ...original, fecha: '2026-09-24' }),
    /ya tiene una sesión/,
  )
  assert.equal(h.docs.has('old'), true)
  assert.equal(h.docs.has('p1_2026-09-24'), true)
})
