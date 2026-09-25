# Backend opcional de SPLIT

Servidor Express con CORS y JSON. No almacena actividades ni valida sesiones de Firebase: esas funciones corresponden a Firebase Auth y Firestore, usados directamente por el frontend.

Desde esta carpeta:

    npm ci
    npm run dev

También puedes iniciar sin watch mediante npm start. PORT se lee de .env y por defecto vale 5000; .env.example documenta la variable.

## Endpoint

GET /api/health devuelve JSON con status: "ok", message y timestamp ISO.

El frontend no necesita este servidor para registrar actividades. El helper getBackendHealth y el componente TestApi permiten comprobarlo, pero TestApi no forma parte de las rutas de la aplicación.

El servidor no tiene endpoints de escritura ni despliegue configurado en este repositorio. La seguridad de los datos privados depende de las reglas Firestore, no de CORS ni del health check.
