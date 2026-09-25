# Despliegue

## Vercel

- Root Directory: frontend.
- Framework: Vite.
- Node: 22.12 o posterior.
- Build: npm run build. Output: dist.
- Configura las variables VITE_FIREBASE_* del archivo frontend/.env.example.
- frontend/vercel.json redirige rutas SPA a index.html y conserva las solicitudes de archivos.

La URL histórica documentada es https://actividad-deportiva-app.vercel.app. Los cambios locales no están publicados allí. Los despliegues al hacer push dependen de la integración configurada en Vercel.

## Firebase Hosting opcional

El workflow existente se corrigió y ahora solo se inicia manualmente (workflow_dispatch), para no desplegar a dos plataformas con cada push. Instala, valida, prueba, compila y publica frontend/dist. Necesita las variables Firebase y la cuenta de servicio indicadas en el YAML como secrets del repositorio.

Este workflow publica hosting; no publica firestore.rules. El despliegue de reglas se gestiona por separado tras verificarlas en un emulador y seleccionar el proyecto correcto.

## PWA

Los iconos de 192 y 512 px se incluyen en frontend/public/icons. La actualización muestra un aviso y permite posponerla hasta guardar los formularios. No se promete escritura offline de datos privados.
