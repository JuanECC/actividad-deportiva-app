import { z } from 'zod'
import { deportes } from './deportes.js'
import { fechaLocal, fechaValida, minutosEntrada } from './actividad.js'
export const loginSchema = z.object({
  email: z.string().trim().email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})
export const actividadSchema = z
  .object({
    tipo: z.enum(['run', 'bike', 'swim', 'strength', 'sport']),
    deporte: z.string().trim().min(1, 'Selecciona un deporte'),
    nombre: z
      .string()
      .trim()
      .min(3, 'Escribe al menos 3 caracteres')
      .max(120, 'Máximo 120 caracteres'),
    fecha: z.string().refine(fechaValida, 'Fecha inválida'),
    distancia: z.string().trim().min(1, 'Este campo es obligatorio').max(120),
    duracion: z
      .string()
      .refine(
        (v) => minutosEntrada(v) > 0 && minutosEntrada(v) <= 1440,
        'Usa minutos, mm:ss, hh:mm:ss o 1h 30min (máximo 24 horas)',
      ),
    ritmo: z.string().trim().max(120),
    tag: z.enum([
      'Entrenamiento',
      'Récord',
      'Recuperación',
      'Técnica',
      'Velocidad',
      'Volumen',
    ]),
    diasSeleccionados: z
      .array(z.enum(['L', 'M', 'X', 'J', 'V', 'S', 'D']))
      .max(7)
      .default([]),
    semanas: z.number().int().min(1).max(12).default(1),
  })
  .superRefine((d, ctx) => {
    const sport = deportes.find((s) => s.nombre === d.deporte)
    if (!sport || sport.tipo !== d.tipo)
      ctx.addIssue({
        code: 'custom',
        path: ['deporte'],
        message: 'Selecciona un deporte compatible con el tipo',
      })
    if (
      d.tipo !== 'sport' &&
      (!/^\d+(?:[.,]\d+)?$/.test(d.distancia) ||
        Number(d.distancia.replace(',', '.')) <= 0)
    )
      ctx.addIssue({
        code: 'custom',
        path: ['distancia'],
        message: 'Introduce un número mayor que cero',
      })
    if (!d.diasSeleccionados.length && d.fecha > fechaLocal())
      ctx.addIssue({
        code: 'custom',
        path: ['fecha'],
        message: 'Una sesión realizada no puede tener fecha futura',
      })
  })
export const suenoSchema = z
  .object({
    fecha: z
      .string()
      .refine(
        (v) => fechaValida(v) && v <= fechaLocal(),
        'Selecciona una fecha válida, no futura',
      ),
    horaDormir: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora inválida'),
    horaDespertar: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora inválida'),
  })
  .refine((d) => d.horaDormir !== d.horaDespertar, {
    path: ['horaDespertar'],
    message: 'Las horas deben ser distintas',
  })
export function validarConZod(schema, data) {
  const result = schema.safeParse(data)
  if (result.success) return { ok: true, errors: null, data: result.data }
  return {
    ok: false,
    errors: Object.fromEntries(
      result.error.issues.map((i) => [i.path[0], i.message]),
    ),
  }
}
