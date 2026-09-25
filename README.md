# SPLIT — Registro de entrenamientos

Aplicación React + Vite con Firebase Auth y Firestore. El backend Express es opcional y solo expone un health check.

## Desarrollo

Usa Node 22.12 o posterior (también se admite Node 20.19).

Desde frontend:

    npm ci
    # Copia .env.example a .env y configura Firebase.
    npm run dev

Verificación:

    npm run lint
    npm test
    npm run build

## Documentación

- [Frontend](frontend/README.md)
- [Backend opcional](backend/README.md)
- [Arquitectura y modelo de datos](frontend/docs/ARQUITECTURA.md)
- [API de ejercicios](frontend/docs/API.md)
- [Validaciones y errores](frontend/docs/ERRORES.md)
- [Seguridad](frontend/docs/SEGURIDAD.md)
- [Rendimiento](frontend/docs/OPTIMIZACION.md)
- [Despliegue](docs/VERCEL.md)
- [Reparaciones y compatibilidad de datos antiguos](docs/REPARACIONES.md)

El desarrollo y las pruebas locales no publican la aplicación ni crean commits.
