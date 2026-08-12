import React from 'react'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand__mark">S/</span>
        <span className="brand__name">SPLIT</span>
      </div>

      <nav className="nav">
        <a className="nav__item nav__item--active" href="#">
          <span className="nav__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 13h4v8H3v-8Zm7-7h4v15h-4V6Zm7 4h4v11h-4V10Z" fill="currentColor"/></svg>
          </span>
          Panel
        </a>
        <a className="nav__item" href="#">
          <span className="nav__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" fill="currentColor"/></svg>
          </span>
          Actividades
        </a>
        <a className="nav__item" href="#">
          <span className="nav__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </span>
          Progreso
        </a>
        <a className="nav__item" href="#">
          <span className="nav__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 2 2 7l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
          </span>
          Objetivos
        </a>
        <a className="nav__item" href="#">
          <span className="nav__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 21v-6M4 11V3M12 21v-9M12 8V3M20 21v-4M20 13V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="4" cy="13" r="2" fill="currentColor"/><circle cx="12" cy="10" r="2" fill="currentColor"/><circle cx="20" cy="15" r="2" fill="currentColor"/></svg>
          </span>
          Ajustes
        </a>
      </nav>

      <div className="sidebar__footer">
        <div className="profile">
          <div className="profile__avatar">DR</div>
          <div className="profile__meta">
            <span className="profile__name">Diego Ruiz</span>
            <span className="profile__plan">Racha de 12 días</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar