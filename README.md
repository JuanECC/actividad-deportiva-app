# 🏃 SPLIT — Registro de entrenamientos

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square\&logo=react\&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square\&logo=vite\&logoColor=white)](https://vite.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?style=flat-square\&logo=firebase\&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **Dashboard deportivo con autenticación, registro de actividades, seguimiento personalizado, ejercicios y planes de nutrición.**

---

## 📖 Descripción

**SPLIT** es una aplicación web moderna orientada al seguimiento de la actividad física y el bienestar personal.

La aplicación permite a los usuarios:

* 🏃 Registrar actividades deportivas como carrera, ciclismo, natación y fuerza.
* 📊 Visualizar estadísticas de entrenamiento en tiempo real.
* 🏆 Consultar récords personales.
* 🎯 Dar seguimiento a objetivos mensuales.
* 📋 Consultar y administrar el historial de actividades.
* 🏋️ Consultar un catálogo de ejercicios mediante la API Wger.
* 💪 Consultar grupos musculares y equipamiento.
* 🥗 Consultar información nutricional e ingredientes.
* 💾 Sincronizar los datos mediante Firebase y Firestore.
* 📱 Utilizar la aplicación desde computadoras, tablets y dispositivos móviles.

El proyecto se desarrolla como parte del programa **DevF** y utiliza una arquitectura frontend basada en React, Firebase para autenticación y persistencia de datos, y servicios externos para proporcionar contenido deportivo y nutricional.

---

## ✨ Características

| Funcionalidad                   | Descripción                                                             |
| ------------------------------- | ----------------------------------------------------------------------- |
| 🔐 **Autenticación**            | Login y registro mediante Firebase Auth con email y contraseña          |
| 📝 **Registro de actividades**  | Permite registrar carrera, ciclismo, natación y entrenamiento de fuerza |
| 📊 **Estadísticas**             | Visualización de distancia, tiempo, ritmo y racha activa                |
| 🏆 **Récords personales**       | Cálculo y visualización de mejores marcas en 5K, 10K, 21K y fuerza      |
| 🎯 **Objetivos mensuales**      | Seguimiento de metas relacionadas con distancia, fuerza y sueño         |
| 📋 **Historial de actividades** | Lista de actividades registradas con posibilidad de eliminación         |
| 🏋️ **Catálogo de ejercicios**  | Consulta de ejercicios mediante la API Wger                             |
| 💪 **Grupos musculares**        | Consulta de grupos musculares y sus recursos gráficos                   |
| 🥗 **Nutrición**                | Consulta de ingredientes e información nutricional                      |
| 💾 **Persistencia en la nube**  | Datos almacenados y sincronizados mediante Firestore                    |
| 🌙 **Diseño oscuro**            | Interfaz moderna con paleta de colores chartreuse                       |
| 📱 **Responsive**               | Adaptación para desktop, tablet y dispositivos móviles                  |
| 🚀 **Rendimiento**              | Vite para desarrollo y compilación rápida                               |
| 🤖 **IA de bienestar**          | Integración con Gemini API prevista para futuras funcionalidades        |

---

# 🛠️ Tecnologías

| Tecnología        | Versión | Propósito                                 |
| ----------------- | ------- | ----------------------------------------- |
| **React**         | 19.x    | Construcción de la interfaz de usuario    |
| **Vite**          | 8.x     | Herramienta de desarrollo y compilación   |
| **Firebase Auth** | 11.x    | Autenticación de usuarios                 |
| **Firestore**     | 11.x    | Base de datos NoSQL                       |
| **Wger API**      | v2      | Ejercicios, grupos musculares y nutrición |
| **Gemini API**    | —       | IA para bienestar emocional, próximamente |
| **CSS Puro**      | —       | Estilos y variables visuales              |

---

# 📁 Estructura del proyecto

```text
actividad-deportiva-app/
├── docs/
│   ├── ACUERDOS.md
│   ├── API.md
│   └── ARQUITECTURA.md
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── components/
│   │   ├── ActivityLog.jsx
│   │   ├── Login.jsx
│   │   ├── ModalRegistro.jsx
│   │   ├── Scoreboard.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SideColumn.jsx
│   │   ├── TestApi.jsx
│   │   └── Topbar.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   ├── useActividades.js
│   │   ├── useCategorias.js
│   │   ├── useEjercicios.js
│   │   └── useMusculos.js
│   │
│   ├── pages/
│   │   ├── Panel.jsx
│   │   ├── Actividades.jsx
│   │   ├── Progreso.jsx
│   │   ├── Objetivos.jsx
│   │   └── Ajustes.jsx
│   │
│   ├── services/
│   │   ├── apiClient.js
│   │   ├── firebase.js
│   │   └── wgerApi.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

# 🔑 Variables de entorno

El proyecto utiliza variables de entorno para mantener separada la configuración de los servicios externos.

Crea un archivo `.env` en la raíz del proyecto utilizando `.env.example` como plantilla:

```bash
# URL de la API Wger
VITE_API_URL=https://wger.de/api/v2

# Configuración de Firebase
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

> ⚠️ **Importante:** El archivo `.env` no debe subirse a GitHub. Únicamente `.env.example` debe compartirse como plantilla.

Si el proyecto utiliza directamente `src/services/firebase.js` en lugar de variables de entorno, las credenciales deberán configurarse según la implementación actual del proyecto.

---

# 📡 API Wger

SPLIT utiliza la API de **Wger** para obtener información relacionada con ejercicios y nutrición.

| Endpoint                  | Uso en el proyecto                            | Estado |
| ------------------------- | --------------------------------------------- | :----: |
| `GET /exercise/`          | Catálogo de ejercicios                        |    ✅   |
| `GET /exerciseinfo/{id}/` | Detalle de ejercicio e información en español |    ⏳   |
| `GET /muscle/`            | Grupos musculares                             |    ✅   |
| `GET /exercisecategory/`  | Categorías de ejercicio                       |    ✅   |
| `GET /equipment/`         | Equipamiento                                  |    ✅   |
| `GET /ingredient/`        | Ingredientes e información nutricional        |    ✅   |
| `GET /exerciseimage/`     | Imágenes de ejercicios                        |    ⏳   |

La comunicación con Wger se centraliza mediante:

```text
src/services/wgerApi.js
```

**Documentación completa:** [`docs/API.md`](docs/API.md)

---

# 🏗️ Arquitectura

SPLIT utiliza una arquitectura frontend modular basada en componentes reutilizables, hooks personalizados, contexto global y servicios externos.

### Árbol general de componentes

```text
App
├── AuthProvider
│   └── Router
│       ├── Login (sin sesión)
│       └── Layout (con sesión)
│           ├── Sidebar
│           │   ├── NavItem
│           │   └── Profile + Logout
│           │
│           ├── Main
│           │   ├── Topbar
│           │   │
│           │   ├── PanelPage
│           │   │   ├── Scoreboard
│           │   │   │   └── StatCard
│           │   │   ├── ActivityLog
│           │   │   └── SideColumn
│           │   │       ├── Goals
│           │   │       └── Records
│           │   │
│           │   ├── ActividadesPage
│           │   │   ├── ExerciseCatalog
│           │   │   └── ActivityLog
│           │   │
│           │   ├── ProgresoPage
│           │   │   └── Charts
│           │   │
│           │   ├── ObjetivosPage
│           │   │   └── Goals
│           │   │
│           │   └── AjustesPage
│           │
│           └── ModalRegistro
```

**Documentación completa:** [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md)

---

# 🔐 Autenticación

La autenticación de SPLIT se realiza mediante **Firebase Authentication**.

### Funcionalidades

* Registro mediante email y contraseña.
* Inicio de sesión.
* Cierre de sesión.
* Persistencia de la sesión.
* Protección de las vistas de la aplicación.
* Gestión global del usuario mediante `AuthContext`.

### Flujo

```text
Usuario
   │
   ▼
Login / Registro
   │
   ▼
Firebase Authentication
   │
   ├── Error
   │     └──► Mostrar mensaje
   │
   └── Éxito
         │
         ▼
    AuthContext
         │
         ▼
 Usuario autenticado
         │
         ▼
       Layout
         │
         ▼
   Aplicación SPLIT
```

---

# 💾 Persistencia de datos

Los datos de los usuarios se almacenan en **Cloud Firestore**.

La aplicación utiliza Firestore para mantener información como:

* Actividades deportivas.
* Historial de entrenamientos.
* Estadísticas derivadas.
* Datos asociados al usuario.
* Objetivos y seguimiento.

El flujo general de datos es:

```text
Interfaz
   │
   ▼
Pages / Components
   │
   ▼
Custom Hooks
   │
   ▼
Services
   │
   ▼
Firebase / Firestore
```

Los datos se gestionan de forma independiente por usuario para evitar mezclar información entre cuentas.

---

# 📦 Instalación

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

| Requisito              | Versión mínima     | Descarga                                                |
| ---------------------- | ------------------ | ------------------------------------------------------- |
| **Node.js**            | v20.0.0 o superior | [nodejs.org](https://nodejs.org/)                       |
| **npm**                | v10.0.0 o superior | Incluido con Node.js                                    |
| **Git**                | v2.30 o superior   | [git-scm.com](https://git-scm.com/)                     |
| **Visual Studio Code** | Recomendado        | [code.visualstudio.com](https://code.visualstudio.com/) |

---

## 🔥 Configuración de Firebase

1. Crear una cuenta en [Firebase Console](https://console.firebase.google.com/).
2. Crear un nuevo proyecto, por ejemplo `actividad-deportiva`.
3. Activar **Authentication**.
4. Habilitar el proveedor **Email/Password**.
5. Activar **Firestore Database**.
6. Crear la base de datos.
7. Registrar una nueva **Web App**.
8. Copiar la configuración proporcionada por Firebase.
9. Configurar las credenciales en el proyecto mediante `.env` o `src/services/firebase.js`, dependiendo de la implementación actual.

> ⚠️ Para producción se recomienda utilizar reglas de seguridad de Firestore correctamente configuradas y evitar dejar la base de datos en modo de prueba.

---

# 🚀 Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/JuanECC/actividad-deportiva-app.git
```

### 2. Entrar a la carpeta

```bash
cd actividad-deportiva-app
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Copiar `.env.example` como `.env`:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Después, editar `.env` con las credenciales correspondientes.

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

### 6. Abrir la aplicación

Por defecto:

```text
http://localhost:5173
```

---

# 📜 Scripts disponibles

| Comando           | Descripción                               |
| ----------------- | ----------------------------------------- |
| `npm install`     | Instala las dependencias                  |
| `npm run dev`     | Inicia el servidor de desarrollo          |
| `npm run build`   | Genera la versión de producción           |
| `npm run preview` | Previsualiza la compilación de producción |

---

# 🗺️ Vistas principales

| Ruta           | Vista       | Función                                                   |
| -------------- | ----------- | --------------------------------------------------------- |
| `/`            | Panel       | Dashboard principal con estadísticas y actividad reciente |
| `/actividades` | Actividades | Registro e historial de actividades                       |
| `/progreso`    | Progreso    | Visualización de evolución y estadísticas                 |
| `/objetivos`   | Objetivos   | Seguimiento de metas                                      |
| `/ajustes`     | Ajustes     | Configuración del usuario                                 |

---

# 📊 Estadísticas y seguimiento

SPLIT genera información a partir de las actividades registradas por cada usuario.

Entre las métricas principales se encuentran:

* Distancia acumulada.
* Tiempo de entrenamiento.
* Ritmo.
* Racha activa.
* Mejores marcas personales.
* Progreso hacia objetivos.
* Historial de actividades.

### Ejemplo de flujo

```text
Registro de actividad
        │
        ▼
    Firestore
        │
        ▼
 useActividades
        │
        ▼
 ┌──────┴────────┐
 ▼               ▼
Estadísticas   Historial
 │
 ├── Distancia
 ├── Tiempo
 ├── Ritmo
 └── Racha
```

---

# 🏋️ Ejercicios y nutrición

La sección de actividades puede utilizar información proporcionada por Wger para complementar el registro de entrenamientos.

### Ejercicios

Permite consultar:

* Nombre del ejercicio.
* Categoría.
* Músculos principales.
* Músculos secundarios.
* Equipamiento requerido.

### Nutrición

El sistema puede utilizar el catálogo nutricional para consultar:

* Ingredientes.
* Energía.
* Proteínas.
* Carbohidratos.
* Grasas.
* Fibra.
* Sodio.
* Información de marca cuando está disponible.

---

# 🤖 Inteligencia artificial

Como parte de las funcionalidades futuras, se contempla la integración de **Gemini API** para proporcionar herramientas relacionadas con bienestar emocional.

> 🚧 **Estado:** Próximamente.

Esta funcionalidad se mantendrá separada de la lógica principal de entrenamiento para facilitar su mantenimiento y evolución.

---

# 📚 Documentación del proyecto

La documentación técnica se encuentra en la carpeta `docs/`.

| Archivo                                        | Descripción                                 |
| ---------------------------------------------- | ------------------------------------------- |
| [`docs/ACUERDOS.md`](docs/ACUERDOS.md)         | Acuerdos y decisiones tomadas por el equipo |
| [`docs/API.md`](docs/API.md)                   | Documentación de integración con Wger       |
| [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) | Diseño de arquitectura del Front End        |

---

# 🧪 Estado del proyecto

### Funcionalidades implementadas

* [x] Configuración inicial con React y Vite
* [x] Autenticación mediante Firebase
* [x] Registro de usuarios
* [x] Gestión de sesión mediante `AuthContext`
* [x] Registro de actividades
* [x] Historial de actividades
* [x] Eliminación de actividades
* [x] Persistencia mediante Firestore
* [x] Estadísticas de entrenamiento
* [x] Récords personales
* [x] Objetivos mensuales
* [x] Integración con API Wger
* [x] Consulta de ejercicios
* [x] Consulta de grupos musculares
* [x] Consulta de categorías
* [x] Consulta de equipamiento
* [x] Consulta de ingredientes nutricionales
* [x] Documentación de API
* [x] Documentación de arquitectura
* [x] Diseño responsive

### Funcionalidades en desarrollo

* [ ] Detalle completo de ejercicios mediante `/exerciseinfo/{id}/`
* [ ] Imágenes de ejercicios mediante `/exerciseimage/`
* [ ] Gráficas avanzadas de progreso
* [ ] Mejoras en filtros y búsqueda
* [ ] Planes de nutrición personalizados
* [ ] Integración con Gemini API
* [ ] Herramientas de bienestar emocional

---

# 👥 Equipo

**Proyecto:** SPLIT — Registro de entrenamientos
**Programa:** DevF
**Equipo:** Equipo SPLIT

---

# 📅 Información del proyecto

**Última actualización:** 18 de agosto de 2026

**Estado:** 🚧 En desarrollo

---

# 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**.

Consulta el archivo [`LICENSE`](LICENSE) para conocer los términos completos de la licencia.
