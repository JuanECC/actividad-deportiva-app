import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const actividadSchema = z.object({
  tipo: z.string().min(1, 'Selecciona un tipo'),
  deporte: z.string().min(1, 'Selecciona un deporte'),
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  distancia: z.string().min(1, 'Este campo es obligatorio'),
  duracion: z.string().min(1, 'La duración es obligatoria'),
  ritmo: z.string().min(1, 'Este campo es obligatorio'),
  tag: z.string().min(1, 'Selecciona una etiqueta'),
})

export const suenoSchema = z.object({
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  horaDormir: z.string().min(1, 'Hora de dormir obligatoria'),
  horaDespertar: z.string().min(1, 'Hora de despertar obligatoria'),
})

export function validarConZod(schema, data) {
  const result = schema.safeParse(data)
  if (result.success) {
    return { ok: true, errors: null }
  }

  const errors = {}
  result.error.issues.forEach((issue) => {
    const campo = issue.path[0]
    errors[campo] = issue.message
  })
  return { ok: false, errors }
}