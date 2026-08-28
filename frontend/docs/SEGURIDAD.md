# 🔐 Seguridad y protección de rutas

## Frontend

- Se creó `ProtectedRoute` para proteger todas las rutas internas.
- Se creó `PublicRoute` para evitar que un usuario autenticado vea el login.
- Si un usuario no autenticado intenta acceder a `/`, `/actividades`, `/progreso`, `/sueno`, `/objetivos` o `/ajustes`, será redirigido a `/login`.

## Backend

- Firebase Auth administra sesiones.
- Firestore Rules impiden acceso a datos de otros usuarios.
- Cada usuario solo puede leer y escribir en `users/{userId}` si `auth.uid == userId`.