import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Sidebar({ onPaginaChange }) {
  const [paginaActiva, setPaginaActiva] = useState('panel')
  const { currentUser, logout } = useAuth()

  const menuItems = [
    { id: 'panel', label: 'Panel', icon: 'panel' },
    { id: 'actividades', label: 'Actividades', icon: 'actividades' },
    { id: 'progreso', label: 'Progreso', icon: 'progreso' },
    { id: 'objetivos', label: 'Objetivos', icon: 'objetivos' },
    { id: 'ajustes', label: 'Ajustes', icon: 'ajustes' }
  ]

  const iconMap = {
    panel: <svg viewBox="0 0 24 24" fill="none"><path d="M3 13h4v8H3v-8Zm7-7h4v15h-4V6Zm7 4h4v11h-4V10Z" fill="currentColor"/></svg>,
    actividades: <svg viewBox="0 0 24 24" fill="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" fill="currentColor"/></svg>,
    progreso: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    objetivos: <svg viewBox="0 0 24 24" fill="none"><path d="M12 2 2 7l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
    ajustes: <svg viewBox="0 0 24 24" fill="none"><path d="M4 21v-6M4 11V3M12 21v-9M12 8V3M20 21v-4M20 13V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="4" cy="13" r="2" fill="currentColor"/><circle cx="12" cy="10" r="2" fill="currentColor"/><circle cx="20" cy="15" r="2" fill="currentColor"/></svg>
  }

  const handleClick = (id) => {
    setPaginaActiva(id)
    if (onPaginaChange) onPaginaChange(id)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand__mark">S/</span>
        <span className="brand__name">SPLIT</span>
      </div>

      <nav className="nav">
        {menuItems.map(item => (
          <a 
            key={item.id}
            className={`nav__item ${paginaActiva === item.id ? 'nav__item--active' : ''}`}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handleClick(item.id)
            }}
          >
            <span className="nav__icon" aria-hidden="true">
              {iconMap[item.icon]}
            </span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="profile">
          <div className="profile__avatar">
            {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile__meta">
            <span className="profile__name">
              {currentUser?.email?.split('@')[0] || 'Usuario'}
            </span>
            <span className="profile__plan">Racha de 12 días</span>
          </div>
        </div>
        <button 
          className="logout-btn" 
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

export default Sidebar