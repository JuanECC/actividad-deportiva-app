import { traduccionEjercicio } from '../services/wgerApi'
export default function ExerciseCard({ ejercicio, idiomas, onSelect }) {
  const translation = traduccionEjercicio(ejercicio, idiomas)
  // Convert API markup to plain text; never inject third-party HTML.
  const parser = new DOMParser(),
    description =
      parser.parseFromString(translation.description || '', 'text/html').body
        .textContent || ''
  return (
    <article className="exercise-card">
      <h3>{translation.name}</h3>
      <p>{ejercicio.category?.name || 'Ejercicio'}</p>
      <p className="exercise-card__detail">
        {(ejercicio.muscles || []).map((m) => m.name_en || m.name).join(', ') ||
          'Sin músculos especificados'}
      </p>
      {description && (
        <details>
          <summary>Ver instrucciones</summary>
          <p>{description}</p>
        </details>
      )}
      <p className="help-text">
        Fuente:{' '}
        <a
          href={'https://wger.de/en/exercise/' + ejercicio.id + '/view/'}
          target="_blank"
          rel="noreferrer"
        >
          Wger
        </a>
        {translation.license_author ? ' · ' + translation.license_author : ''}
        {ejercicio.license?.url?.startsWith('https://creativecommons.org/') && (
          <>
            {' '}
            ·{' '}
            <a href={ejercicio.license.url} target="_blank" rel="noreferrer">
              {ejercicio.license.short_name}
            </a>
          </>
        )}
      </p>
      <button
        className="exercise-card__btn"
        onClick={() =>
          onSelect({
            deporte: 'Gimnasio',
            tipo: 'strength',
            nombre: translation.name,
            distancia: '',
            duracion: '',
            ritmo: '',
          })
        }
      >
        Registrar
      </button>
    </article>
  )
}
