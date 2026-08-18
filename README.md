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

# 🏃 SPLIT — Registro de entrenamientos

> **Dashboard deportivo con autenticación, registro de actividades y seguimiento personalizado.**

**SPLIT** es una aplicación web moderna para deportistas que permite:

- **Registrar actividades deportivas** (carrera, ciclismo, natación, fuerza)
- **Visualizar estadísticas** en tiempo real (distancia, tiempo, ritmo, rachas)
- **Dar seguimiento a objetivos** mensuales de distancia, fuerza y sueño
- **Consultar récords personales** basados en el historial
- **Sincronizar datos en la nube** para acceso desde cualquier dispositivo

El proyecto se desarrolla como parte del programa **DevF** y utiliza una arquitectura frontend con React, Firebase para autenticación y persistencia, y APIs externas para contenido deportivo y nutricional.

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

## 📦 Instalación

### Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

| Requisito | Versión mínima | Descarga |
|-----------|---------------|----------|
| **Node.js** | v20.0.0 o superior | [nodejs.org](https://nodejs.org/) |
| **npm** | v10.0.0 o superior | Incluido con Node.js |
| **Git** | v2.30 o superior | [git-scm.com](https://git-scm.com/) |
| **Editor de código** | VS Code recomendado | [code.visualstudio.com](https://code.visualstudio.com/) |

### Configuración de Firebase

1. Crear cuenta en [Firebase Console](https://console.firebase.google.com/)
2. Crear un proyecto nuevo llamado `actividad-deportiva`
3. Activar **Authentication** → método **Email/Password**
4. Activar **Firestore Database** → modo de prueba
5. Agregar una **Web App** y copiar la configuración
6. Pegar las credenciales en `src/services/firebase.js`

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