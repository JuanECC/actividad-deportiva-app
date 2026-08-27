import React from "react";

function ActivityLog({ actividades, onEliminar }) {
  const iconMap = {
    run: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" fill="currentColor" />
      </svg>
    ),
    bike: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="17" r="3.2" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="17" r="3.2" stroke="currentColor" strokeWidth="2" />
        <path
          d="M6 17 10 8h4l3 5M10 8l2 4h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    swim: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M2 16c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="17" cy="6" r="1.6" fill="currentColor" />
        <path
          d="M9 12l4-3 2 2-3 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    strength: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M3 12h2M19 12h2M6 8v8M18 8v8M8 12h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    sport: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 7v10M7 12h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  };

  const formatearDistancia = (act) => {
    if (act.tipo === "strength") return `${act.distancia} ejerc.`;
    if (act.tipo === "sport") return act.distancia;
    return act.distancia;
  };

  const formatearDuracion = (duracion) => {
    if (!duracion) return "--:--";
    const partes = duracion.split(":");
    if (partes.length === 2) {
      const [min, seg] = partes;
      if (parseInt(min) >= 60) {
        const h = Math.floor(parseInt(min) / 60);
        const m = parseInt(min) % 60;
        return `${h}h ${m.toString().padStart(2, "0")}min`;
      }
      return `${min}:${seg}`;
    }
    return duracion;
  };

  const handleEliminar = (id, nombre) => {
    if (window.confirm(`¿Eliminar "${nombre}"?`)) {
      onEliminar(id);
    }
  };

  if (actividades.length === 0) {
    return (
      <section className="panel panel--log" aria-label="Actividades recientes">
        <div className="panel__header">
          <h2 className="panel__title">Actividades recientes</h2>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "var(--text-muted)",
          }}
        >
          <p>No hay actividades registradas</p>
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            ¡Registra tu primera actividad!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel panel--log" aria-label="Actividades recientes">
      <div className="panel__header">
        <h2 className="panel__title">Actividades recientes</h2>
        <a className="panel__link" href="#">
          Ver todas
        </a>
      </div>

      <ul className="log">
        {actividades.map((act) => (
          <li key={act.id} className="log__row">
            <span
              className={`log__icon log__icon--${act.tipo}`}
              aria-hidden="true"
            >
              {iconMap[act.tipo] || iconMap.sport}
            </span>
            <div className="log__info">
              <span className="log__name">{act.nombre}</span>
              <span className="log__meta">{act.meta}</span>
            </div>
            <span className="log__stat">{formatearDistancia(act)}</span>
            <span className="log__stat log__stat--mono">
              {formatearDuracion(act.duracion)}
            </span>
            <span className="log__stat log__stat--mono">{act.ritmo}</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span className={`tag ${act.tagType === "pr" ? "tag--pr" : ""}`}>
                {act.tag}
              </span>
              <button
                className="log__delete"
                onClick={() => handleEliminar(act.id, act.nombre)}
                aria-label="Eliminar actividad"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ActivityLog;
