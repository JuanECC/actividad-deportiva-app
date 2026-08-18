# 🏃 SPLIT — Registro de entrenamientos

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **Dashboard deportivo con autenticación, registro de actividades y planes de nutrición.**

---

## ✨ Características

| Funcionalidad | Descripción |
|---------------|-------------|
| 🔐 **Autenticación** | Login/registro con Firebase Auth (email/password) |
| 📝 **Registro de actividades** | Agrega carreras, ciclismo, natación o fuerza |
| 📊 **Estadísticas en tiempo real** | Distancia, tiempo, ritmo y racha activa |
| 🏆 **Récords personales** | Mejores marcas en 5K, 10K, 21K y fuerza |
| 🎯 **Objetivos del mes** | Progreso hacia metas de distancia, fuerza y sueño |
| 📋 **Historial de actividades** | Lista completa con eliminación rápida |
| 💾 **Persistencia en la nube** | Datos guardados en Firestore por usuario |
| 🌙 **Diseño oscuro** | Interfaz moderna con paleta chartreuse |
| 📱 **Responsive** | Desktop, tablet y móvil |
| 🚀 **Rendimiento** | Vite para carga instantánea |

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.x | UI Library |
| **Vite** | 8.x | Build tool |
| **Firebase Auth** | 11.x | Autenticación de usuarios |
| **Firestore** | 11.x | Base de datos NoSQL |
| **Wger API** | v2 | API de ejercicios y nutrición |
| **Gemini API** | - | IA de bienestar emocional (próximamente) |
| **CSS Puro** | - | Estilos con variables CSS |

---

## 📦 Instalación

### Requisitos previos

- **Node.js** (v20 o superior) → [Descargar](https://nodejs.org/)
- **Git** → [Descargar](https://git-scm.com/downloads)
- **Cuenta Firebase** → [Crear](https://console.firebase.google.com/)

### Configuración de Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Activar **Authentication** → Email/Password
3. Activar **Firestore Database** → Modo de prueba
4. Copiar la configuración de tu Web App

### Pasos para instalar

```bash
# 1. Clonar el repositorio
git clone https://github.com/JuanECC/actividad-deportiva-app.git

# 2. Entrar a la carpeta
cd actividad-deportiva-app

# 3. Instalar dependencias
npm install

# 4. Configurar Firebase
# Editar src/services/firebase.js con tus credenciales

# 5. Iniciar servidor de desarrollo
npm run dev

# 6. Abrir en el navegador
# http://localhost:5173