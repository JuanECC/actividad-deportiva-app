import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import { crearChatHandler } from './chat.js'

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) })

const app = express()
const PORT = process.env.PORT || 5000

const origins = (process.env.FRONTEND_ORIGINS || '').split(',').filter(Boolean)
app.use((req, res, next) => {
  const origin = req.get('origin')
  const local = origin && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
  if (origin && !origins.includes(origin) && !(process.env.NODE_ENV !== 'production' && local)) {
    return res.status(403).json({ error: 'Origen no permitido.' })
  }
  next()
})
app.use(cors({ origin: true }))
app.use(express.json({ limit: '24kb' }))
app.post('/api/chat', crearChatHandler({ apiKey: process.env.GEMINI_API_KEY, model: process.env.GEMINI_MODEL }))
app.use((err, req, res, next) => {
  if (!err) return next()
  res.status(err.status === 413 ? 413 : 400).json({ error: 'La solicitud del chat no es válida o es demasiado larga.' })
})

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, process.env.HOST || '127.0.0.1', () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`)
})
