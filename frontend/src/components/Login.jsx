import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { loginSchema, validarConZod } from '../utils/validations'

function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const data = { email, password }
    if (isRegister) {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden')
        return
      }
    }

    const { ok, errors } = validarConZod(loginSchema, data)
    if (!ok) {
      setError(Object.values(errors).join(' · '))
      return
    }

    try {
      setLoading(true)
      if (isRegister) await register(email, password)
      else await login(email, password)
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No existe una cuenta con este email')
          break
        case 'auth/wrong-password':
          setError('Contraseña incorrecta')
          break
        case 'auth/email-already-in-use':
          setError('Ya existe una cuenta con este email')
          break
        case 'auth/invalid-email':
          setError('Email inválido')
          break
        case 'auth/weak-password':
          setError('La contraseña es demasiado débil')
          break
        default:
          setError('Error al procesar la solicitud')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-overlay">
      <div className="login-container">
        {/* ... resto del JSX sin cambios ... */}
      </div>
    </div>
  )
}

export default Login