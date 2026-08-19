# 🏗️ Diseño de Arquitectura del Front End — SPLIT

## 📐 Árbol de componentes

```text
App
├── AuthProvider
│   └── Router
│       ├── Login (si no hay sesión)
│       └── Layout (si hay sesión)
│           ├── Sidebar (navegación)
│           │   ├── NavItem
│           │   └── Profile + Logout
│           ├── Main
│           │   ├── Topbar (título + acciones)
│           │   ├── PanelPage
│           │   │   ├── Scoreboard
│           │   │   │   └── StatCard
│           │   │   ├── ActivityLog
│           │   │   │   └── ActivityRow
│           │   │   └── SideColumn
│           │   │       ├── Goals
│           │   │       └── Records
│           │   ├── ActividadesPage
│           │   │   ├── ExerciseCatalog (Wger)
│           │   │   └── ActivityLog
│           │   ├── ProgresoPage
│           │   │   └── Charts
│           │   ├── ObjetivosPage
│           │   │   └── Goals
│           │   └── AjustesPage
│           └── ModalRegistro
```

---

## 📐 Vistas principales

| Ruta           | Página      | Descripción                                                 |
| -------------- | ----------- | ----------------------------------------------------------- |
| `/`            | Panel       | Dashboard con estadísticas, scoreboard y actividad reciente |
| `/actividades` | Actividades | Catálogo de ejercicios de Wger e historial del usuario      |
| `/progreso`    | Progreso    | Gráficos de evolución y seguimiento del rendimiento         |
| `/objetivos`   | Objetivos   | Gestión y visualización de metas mensuales                  |
| `/ajustes`     | Ajustes     | Configuración del perfil y preferencias del usuario         |

---

## 🧩 Componentes UI reutilizables

| Componente      | Ubicación         | Descripción                                          |
| --------------- | ----------------- | ---------------------------------------------------- |
| `Sidebar`       | `src/components/` | Navegación lateral con íconos y opciones principales |
| `Topbar`        | `src/components/` | Encabezado de la aplicación con título y acciones    |
| `Scoreboard`    | `src/components/` | Grid de tarjetas con estadísticas generales          |
| `StatCard`      | `src/components/` | Tarjeta individual para mostrar una estadística      |
| `ActivityLog`   | `src/components/` | Lista de actividades registradas recientemente       |
| `SideColumn`    | `src/components/` | Columna lateral con objetivos y récords              |
| `ModalRegistro` | `src/components/` | Formulario modal para registrar una actividad        |
| `ProgressBar`   | `src/components/` | Barra de progreso reutilizable                       |
| `Login`         | `src/components/` | Pantalla de autenticación del usuario                |

---

## 🔄 Estados principales de la UI

| Estado         | Tipo     | Dónde se maneja   | Descripción                                   |
| -------------- | -------- | ----------------- | --------------------------------------------- |
| `currentUser`  | Contexto | `AuthContext`     | Usuario actualmente autenticado               |
| `actividades`  | Hook     | `useActividades`  | Datos de actividades almacenados en Firestore |
| `paginaActiva` | Local    | `Sidebar` / `App` | Página actualmente seleccionada               |
| `isModalOpen`  | Local    | `App`             | Control de apertura y cierre del modal        |
| `loading`      | Hook     | `useActividades`  | Estado de carga de los datos                  |
| `error`        | Local    | Cada página       | Manejo de errores de la interfaz              |
| `filtros`      | Local    | `ActividadesPage` | Filtros aplicados a la búsqueda de ejercicios |

---

## 🗂️ Estructura de carpetas

```text
src/
├── components/
│   ├── ActivityLog.jsx
│   ├── Login.jsx
│   ├── ModalRegistro.jsx
│   ├── Scoreboard.jsx
│   ├── Sidebar.jsx
│   ├── SideColumn.jsx
│   ├── StatCard.jsx
│   ├── ProgressBar.jsx
│   └── Topbar.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│   └── useActividades.js
│
├── pages/
│   ├── Panel.jsx
│   ├── Actividades.jsx
│   ├── Progreso.jsx
│   ├── Objetivos.jsx
│   └── Ajustes.jsx
│
├── services/
│   ├── firebase.js
│   └── wgerApi.js
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

## 📦 Descripción de las capas

### `components/`

Contiene los componentes visuales reutilizables de la aplicación.

Su objetivo es evitar duplicación de código y mantener una interfaz modular.

### `context/`

Contiene los contextos globales de React.

Actualmente se utiliza:

```text
AuthContext.jsx
```

Este contexto permite compartir el estado de autenticación entre diferentes componentes.

### `hooks/`

Contiene hooks personalizados para encapsular lógica reutilizable.

Actualmente:

```text
useActividades.js
```

Este hook se encarga de gestionar la obtención y manipulación de las actividades almacenadas en Firestore.

### `pages/`

Contiene las diferentes vistas principales de la aplicación:

```text
Panel
Actividades
Progreso
Objetivos
Ajustes
```

Cada página representa una sección funcional del sistema.

### `services/`

Contiene la configuración y comunicación con servicios externos.

```text
firebase.js
wgerApi.js
```

* `firebase.js`: configuración y conexión con Firebase.
* `wgerApi.js`: cliente HTTP para consumir la API de Wger.

---

## 🔀 Flujo de navegación

```text
Usuario no autenticado
        │
        ▼
Login / Registro
        │
        ▼
Usuario autenticado
        │
        ▼
Layout
(Sidebar + Main)
        │
        ▼
┌─────────────────────────────────────────┐
│ Sidebar                                 │
│                                         │
│ Panel                                   │
│ Actividades                             │
│ Progreso                                │
│ Objetivos                               │
│ Ajustes                                 │
└─────────────────────────────────────────┘
        │
        ▼
Página seleccionada
        │
        ▼
Contenido específico de la sección
```

---

## 🔐 Flujo de autenticación

```text
                 ┌──────────────┐
                 │     App      │
                 └──────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ AuthProvider  │
                └───────┬───────┘
                        │
                ¿Existe sesión?
                   /         \
                 NO           SÍ
                 │             │
                 ▼             ▼
              Login         Layout
                              │
                              ▼
                     Sidebar + Main
```

El `AuthContext` mantiene el estado del usuario autenticado y permite determinar qué interfaz debe mostrarse.

---

## 🔗 Integración con servicios externos

La arquitectura utiliza dos servicios principales:

### Firebase

Se utiliza como backend para:

* Autenticación de usuarios.
* Almacenamiento de actividades.
* Persistencia de datos.
* Consulta de información del usuario.

### Wger API

Se utiliza para obtener información relacionada con:

* Ejercicios.
* Grupos musculares.
* Categorías.
* Equipamiento.
* Información nutricional.

El acceso a Wger se centraliza mediante:

```text
src/services/wgerApi.js
```

Esto permite que los componentes de la interfaz no tengan que realizar directamente las peticiones HTTP.

---

## 🧱 Arquitectura general

```text
┌──────────────────────────────────────────────┐
│                    SPLIT                     │
├──────────────────────────────────────────────┤
│                                              │
│              PRESENTACIÓN                    │
│                                              │
│  Pages → Components → UI                    │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│              LÓGICA DE APLICACIÓN            │
│                                              │
│  Hooks → Context → State                    │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│              SERVICIOS                      │
│                                              │
│  Firebase          Wger API                 │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│              DATOS                          │
│                                              │
│  Firestore          API Wger                │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 📅 Fecha

**Fecha:** 18 de agosto de 2026
**Realizado por:** Equipo SPLIT
**Estado:** ✅ Diseño de arquitectura completado
