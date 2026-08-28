# ⚠️ Manejo de Errores y Validaciones

## Validaciones

- Se utiliza **Zod** para validar formularios:
  - Login
  - Registro de actividades
  - Registro de sueño

## Frontend

- Se creó un **ErrorBoundary** para capturar errores inesperados.
- Los mensajes de validación de Zod se muestran bajo cada campo.
- Los errores de Firebase Auth se traducen a mensajes amigables.

## Manejo de errores de API

- `apiClient.js` detecta:
  - Errores de conexión (sin internet / servidor caído)
  - Respuestas HTTP no exitosas (4xx, 5xx)
  - Respuestas no JSON

- Los mensajes se muestran al usuario sin exponer detalles técnicos.

## Backend

- Firestore Security Rules evitan accesos no autorizados.
- Firebase Auth valida credenciales y sesión.