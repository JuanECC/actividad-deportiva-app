import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  if (currentUser) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PublicRoute
