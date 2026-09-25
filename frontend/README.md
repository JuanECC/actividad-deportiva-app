# SPLIT — Frontend

React 19, Vite 8, React Router 7, Firebase 12, Zod 4 y CSS.

## Puesta en marcha

Requiere Node 22.12+ o Node 20.19+. Ejecuta los comandos desde esta carpeta.

    npm ci
    npm run dev

Antes de iniciar, copia .env.example a .env y completa las variables VITE_FIREBASE_*. En Firebase activa Auth con email/contraseña y Firestore. VITE_API_URL configura Wger. VITE_BACKEND_URL solo afecta al health check opcional.

## Funciones

- Autenticación y rutas protegidas.
- Crear y editar sesiones con fecha local; crear planes recurrentes de hasta 12 semanas.
- Completar un día del plan confirmando resultados reales; desmarcar también planes completados.
- Historial paginado. Eliminar un plan conserva las sesiones realizadas.
- Resumen semanal, mensual y anual, con gráfico y comparación con el periodo anterior completo.
- Ritmo calculado con tiempo y distancia de carrera; natación y ciclismo no se mezclan.
- Metas mensuales editables y persistidas; récords de mayor distancia o duración por sesión.
- Sueño por fecha al despertar, sin duplicar la misma fecha ni inferir calidad médica.
- Catálogo de deportes local y gimnasio Wger con nombres, instrucciones, filtros y paginación.
- PWA con actualización solicitada por el usuario para no interrumpir formularios.

## Comprobaciones

    npm run lint
    npm test
    npm run build

Las pruebas de Node ejecutan funciones y hooks reales con adaptadores en memoria: no escriben en Firebase.

Para revisar toda la interfaz sin credenciales ni datos reales:

    npm run test:ui

Abre http://127.0.0.1:5175. Esta configuración reemplaza los módulos Firebase por datos ficticios en memoria. Recargar reinicia esos datos. Wger y las fuentes públicas sí usan Internet. La configuración normal y la compilación de producción NO usan estos reemplazos.

## Documentación

[Arquitectura](docs/ARQUITECTURA.md) · [API](docs/API.md) · [Errores](docs/ERRORES.md) · [Seguridad](docs/SEGURIDAD.md) · [Rendimiento](docs/OPTIMIZACION.md) · [Reparaciones](../docs/REPARACIONES.md)
