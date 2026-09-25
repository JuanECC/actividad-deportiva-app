# Seguridad

ProtectedRoute exige sesión para las rutas internas y PublicRoute redirige fuera del login cuando existe una sesión. Estas restricciones de UI no sustituyen los permisos del servidor.

firestore.rules contiene reglas por uid para actividades, sueño y perfil, con comprobaciones básicas de tipos y límites. Cada usuario solo accede a users/{su propio uid}/...; no se habilitan otras colecciones. Las reglas se referencian en firebase.json.

Las reglas locales no cambian la configuración desplegada automáticamente. Deben revisarse y probarse con Firebase Emulator Suite antes de publicarlas en el proyecto correspondiente. Esta reparación no desplegó reglas ni alteró cuentas o datos reales. Las pruebas en memoria verifican lógica de la aplicación, no constituyen una prueba del motor de reglas de Firebase.

Las transacciones protegen nuevas sesiones por plan/día y registros de sueño por fecha. Cambiar de cuenta desmonta el Workspace y separa los estados por uid.

El HTML de Wger no se inyecta en React. Los errores técnicos no se muestran en ErrorBoundary. No se deben versionar .env, claves privadas ni cuentas de servicio.

La PWA cachea recursos estáticos y consultas públicas de Wger. No configura caché de respuestas privadas de Firestore ni una cola propia de escrituras offline. Las escrituras con transacción requieren conexión.
