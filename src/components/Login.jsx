// src/components/Login.jsx
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

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
    
    // Resetear error
    setError('')

    // Validaciones básicas
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    if (isRegister && password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (isRegister && password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      setLoading(true)
      if (isRegister) {
        await register(email, password)
      } else {
        await login(email, password)
      }
    } catch (err) {
      // Manejar errores de Firebase
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
        <div className="login-header">
          <div className="brand">
            <span className="brand__mark">S/</span>
            <span className="brand__name">SPLIT</span>
          </div>
          <h1 className="login-title">
            {isRegister ? 'Crear cuenta' : 'Bienvenido de nuevo'}
          </h1>
          <p className="login-subtitle">
            {isRegister 
              ? 'Regístrate para comenzar a registrar tus actividades deportivas' 
              : 'Inicia sesión para ver tu panel de actividades'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="modal-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="modal-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className="modal-field">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          {error && (
            <div className="login-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button type="submit" className="btn btn--primary login-submit" disabled={loading}>
            {loading 
              ? 'Procesando...' 
              : isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="login-footer">
          <button 
            className="login-toggle"
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
            }}
          >
            {isRegister 
              ? '¿Ya tienes cuenta? Inicia sesión' 
              : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login