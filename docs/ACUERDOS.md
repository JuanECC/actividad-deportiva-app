# 📋 Acuerdos de Trabajo - Actividad Deportiva App

## 👥 Equipo

- **Scrum Master:** JuanECC
- **Desarrollador 1:** [Nombre Compañero 1]
- **Desarrollador 2:** [Nombre Compañero 2]

## 🏛️ Metodología

- **Framework:** SCRUM
- **Duración Sprint:** 2 semanas
- **Días de trabajo:** Martes y Jueves
- **Daily:** 

## 🔧 Herramientas

- **Repositorio:** GitHub
- **Comunicación:** Discord / Slack
- **Gestión de Tareas:** GitHub Projects
- **IDE:** VS Code

## 🌿 Ramas de Git

- `main` → Producción (estable)
- `develop` → Integración de features
- `feature/*` → Nuevas funcionalidades

### Reglas de Ramas:
1. Siempre crear desde `develop`
2. Nombrar: `feature/descripcion-corta`
3. Fusionar a `develop` mediante Pull Request

## 📝 Reglas de Commits

Formato: `tipo: descripción`

**Tipos permitidos:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Estilos (CSS)
- `refactor:` Refactorización
- `test:` Pruebas
- `chore:` Tareas de mantenimiento

**Ejemplo:** `feat: agregar formulario de registro`

## 🎯 Sprint 1 (Completado)

### Historias de Usuario

**HU-01: Registrar Actividad** ✅
- Como usuario quiero agregar una actividad deportiva
- Criterios: Formulario funcional, validación, guardado local

**HU-02: Ver Lista de Actividades** ✅
- Como usuario quiero ver todas mis actividades
- Criterios: Lista ordenada, diseño de tarjetas

**HU-03: Eliminar Actividad** ✅
- Como usuario quiero eliminar una actividad
- Criterios: Confirmación, actualización inmediata

**HU-04: Persistencia de Datos** ✅
- Como usuario quiero que mis datos se guarden
- Criterios: localStorage, persistencia al recargar

**HU-05: Estadísticas** ✅
- Como usuario quiero ver estadísticas
- Criterios: Total, duración promedio, por tipo

## ✅ Definición de Hecho

- [x] Código funciona sin errores
- [x] Está en `develop` (no en rama local)
- [x] Commits con mensajes claros
- [x] Probado manualmente
- [x] Responsive (móvil y desktop)
- [x] Documentación actualizada