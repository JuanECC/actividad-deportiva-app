import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function Sidebar({ nombre, racha }) {
  const { currentUser, logout } = useAuth()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [errorSalida, setErrorSalida] = useState('')
  const [saliendo, setSaliendo] = useState(false)
  const botonMenu = useRef(null)

  const menuItems = [
    { id: 'panel', label: 'Panel', path: '/', icon: 'panel' },
    {
      id: 'actividades',
      label: 'Actividades',
      path: '/actividades',
      icon: 'actividades',
    },
    { id: 'progreso', label: 'Progreso', path: '/progreso', icon: 'progreso' },
    { id: 'sueno', label: 'Sueño', path: '/sueno', icon: 'sueno' },
    {
      id: 'objetivos',
      label: 'Objetivos',
      path: '/objetivos',
      icon: 'objetivos',
    },
    { id: 'ajustes', label: 'Ajustes', path: '/ajustes', icon: 'ajustes' },
  ]

  const iconMap = {
    panel: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M3 13h4v8H3v-8Zm7-7h4v15h-4V6Zm7 4h4v11h-4V10Z"
          fill="currentColor"
        />
      </svg>
    ),
    actividades: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" fill="currentColor" />
      </svg>
    ),
    progreso: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 7v5l3.5 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    sueno: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    objetivos: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2 2 7l10 5 10-5-10-5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
    ajustes: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M4 21v-6M4 11V3M12 21v-9M12 8V3M20 21v-4M20 13V3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="4" cy="13" r="2" fill="currentColor" />
        <circle cx="12" cy="10" r="2" fill="currentColor" />
        <circle cx="20" cy="15" r="2" fill="currentColor" />
      </svg>
    ),
  }

  const getActivePage = () => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname,
    )
    return currentItem ? currentItem.id : 'panel'
  }

  const activePage = getActivePage()

  const handleLogout = async () => {
    if (saliendo) return
    setSaliendo(true)
    setErrorSalida('')
    try {
      await logout()
    } catch {
      setErrorSalida('No se pudo cerrar la sesión. Intenta de nuevo.')
    } finally {
      setSaliendo(false)
    }
  }

  return (
    <aside className={`sidebar ${menuAbierto ? 'sidebar--abierta' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && menuAbierto) {
          setMenuAbierto(false)
          botonMenu.current?.focus()
        }
      }}>
      <div className="brand">
        <span className="brand__mark">S/</span>
        <span className="brand__name">SPLIT</span>
      </div>

      <button ref={botonMenu} className="menu-toggle" type="button"
        aria-expanded={menuAbierto} aria-controls="navegacion-principal perfil-navegacion"
        onClick={() => setMenuAbierto((abierto) => !abierto)}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path d={menuAbierto ? 'M6 6l12 12M6 18L18 6' : 'M4 6h16M4 12h16M4 18h16'}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {menuAbierto ? 'Cerrar' : 'Menú'}
      </button>
      <nav id="navegacion-principal" className="nav" aria-label="Navegación principal">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            aria-current={activePage === item.id ? 'page' : undefined}
            onClick={() => { setMenuAbierto(false); botonMenu.current?.focus() }}
            className={`nav__item ${activePage === item.id ? 'nav__item--active' : ''}`}
          >
            <span className="nav__icon" aria-hidden="true">
              {iconMap[item.icon]}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div id="perfil-navegacion" className="sidebar__footer">
        <div className="profile">
          <div className="profile__avatar">
            {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile__meta">
            <span className="profile__name">{nombre || 'Usuario'}</span>
            <span className="profile__plan">
              Racha de {racha} {racha === 1 ? 'día' : 'días'}
            </span>
          </div>
        </div>
        <button
          className="logout-btn"
          onClick={handleLogout}
          disabled={saliendo}
          title="Cerrar sesión"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {saliendo ? 'Cerrando sesión…' : 'Cerrar sesión'}
        </button>
        {errorSalida && <p className="login-error" role="alert">{errorSalida}</p>}
      </div>
    </aside>
  )
}

export default Sidebar
