# 🏃 SPLIT — Registro de entrenamientos

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square\&logo=react\&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square\&logo=vite\&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?style=flat-square\&logo=firebase\&logoColor=black)](https://firebase.google.com/)
[![Zod](https://img.shields.io/badge/Zod-Validaciones-3E67B1?style=flat-square)](https://zod.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=flat-square\&logo=vercel\&logoColor=white)](https://vercel.com/)

> **Dashboard deportivo con autenticación, registro de actividades, planes de entrenamiento, sueño y estadísticas.**

---

## ✨ Funcionalidades

| Funcionalidad                      | Descripción                                       |
| ---------------------------------- | ------------------------------------------------- |
| 🔐 **Autenticación**               | Login/registro con Firebase Auth (email/password) |
| 📝 **Registro de actividades**     | Carrera, ciclismo, natación, fuerza y deporte     |
| 📅 **Planes de entrenamiento**     | Actividades recurrentes por días y semanas        |
| 😴 **Registro de sueño**           | Horas de dormir/despertar con calidad             |
| 📊 **Estadísticas en tiempo real** | Distancia, tiempo, ritmo y racha activa           |
| 🏆 **Récords personales**          | Mejores marcas por deporte                        |
| 🎯 **Objetivos del mes**           | Metas dinámicas de distancia, fuerza y sueño      |
| 💾 **Persistencia en la nube**     | Firestore sincronizado por usuario                |
| 🛡️ **Rutas protegidas**           | Acceso solo con sesión activa                     |
| ✅ **Validaciones**                 | Zod en formularios                                |
| ⚠️ **Manejo de errores**           | ErrorBoundary y mensajes claros                   |
| 🌙 **Diseño oscuro**               | Paleta chartreuse                                 |
| 📱 **Responsive**                  | Desktop, tablet y móvil                           |
| 🚀 **Desplegado**                  | Vercel con CI/CD                                  |

---

## 🛠️ Tecnologías

| Tecnología        | Versión | Propósito              |
| ----------------- | ------- | ---------------------- |
| **React**         | 19.x    | UI Library             |
| **Vite**          | 8.x     | Build tool             |
| **Firebase Auth** | 11.x    | Autenticación          |
| **Firestore**     | 11.x    | Base de datos NoSQL    |
| **React Router**  | 7.x     | Navegación             |
| **Zod**           | 4.x     | Validaciones           |
| **Wger API**      | v2      | Ejercicios y nutrición |
| **CSS Puro**      | —       | Estilos con variables  |

---

## 📦 Instalación

### Requisitos previos

| Requisito   | Versión mínima     |
| ----------- | ------------------ |
| **Node.js** | v20.0.0 o superior |
| **npm**     | v10.0.0 o superior |
| **Git**     | v2.30 o superior   |

### Configuración de Firebase

1. Crear una cuenta en [Firebase Console](https://console.firebase.google.com/).
2. Crear un proyecto nuevo.
3. Activar **Authentication → Email/Password**.
4. Activar **Firestore Database**.
5. Agregar una **Web App** y copiar la configuración de Firebase.

### Variables de entorno

Copiar `.env.example` a `.env` y completar las variables:

```env
VITE_API_URL=https://wger.de/api/v2
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

> ⚠️ **Importante:** No subir el archivo `.env` al repositorio. Las credenciales y variables sensibles deben mantenerse fuera del control de versiones.

### Pasos para instalar

```bash
# 1. Entrar a la carpeta del frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Iniciar servidor de desarrollo
npm run dev
```

Después, abrir en el navegador:

```text
http://localhost:5173
```

---

## 🌐 Producción

La aplicación está desplegada en Vercel:

**https://actividad-deportiva-app.vercel.app**

---

## 📚 Documentación

* [`docs/API.md`](docs/API.md) — Endpoints de Wger
* [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) — Diseño del frontend
* [`docs/ERRORES.md`](docs/ERRORES.md) — Manejo de errores
* [`docs/OPTIMIZACION.md`](docs/OPTIMIZACION.md) — `useMemo` y `useCallback`
* [`docs/SEGURIDAD.md`](docs/SEGURIDAD.md) — Protección de rutas
