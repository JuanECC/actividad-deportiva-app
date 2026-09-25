# Reparaciones funcionales

## Cambios

- Calendario: guarda el día seleccionado, confirma resultados y conserva modoFuerza.
- Sesiones: IDs por plan/día y transacciones; mueve fechas sin sobrescribir otra sesión.
- Planes: avance derivado de fechas únicas; permite desmarcar planes completados.
- Borrado: conserva sesiones al eliminar un plan y las muestra en el historial.
- Formularios: validación real, errores propagados, bloqueo mientras guarda, edición y fechas locales.
- Duración: formato definido y número canónico en minutos; conserva segundos.
- Estadísticas: periodos coherentes, domingo incluido, ritmo de carrera ponderado sin mezclar natación.
- Objetivos: metas mensuales persistidas y editables, sin incrementos automáticos.
- Récords: mejor sesión por deporte; racha calculada, nombre coherente con el perfil.
- Sueño: un registro por fecha al despertar, historial ampliable, sin calidad inferida de las horas.
- Catálogo: filtros efectivos, nombres traducidos, instrucciones y paginación.
- Interfaz: controles accesibles, foco del modal, diseño móvil sin superposición de métricas.
- Configuración: iconos PWA, aviso de actualización, rutas SPA, workflow manual y reglas Firestore versionadas.

## Compatibilidad

No se modificaron datos existentes en Firebase. Los valores históricos ambiguos no pueden recuperarse con certeza: edita las duraciones antiguas que estén mal y corrige la fecha de sesiones del plan si corresponde. Las sesiones antiguas duplicadas siguen visibles para revisarlas; desmarcar un día elimina sus duplicados bajo confirmación.

No se cambia la programación de un plan existente desde edición: crea otro plan para una programación distinta. Los objetivos predeterminados se aplican hasta guardar preferencias propias.

## Verificación

npm test ejecuta 22 pruebas de regresión de fechas, duraciones, filtros, cálculos, transacciones, errores, duplicados y perfil usando datos en memoria.

La revisión de navegador con tests/ui.config.js comprobó registro, edición, completar un día pasado, guardado de metas, sueño, rechazo de duplicados, Escape/restauración de foco y tamaño móvil de 390 px. Wger se consultó realmente y se verificó el filtro de categoría y la segunda página.

Las pruebas no escriben en la base real. Las reglas Firestore aún deben verificarse con Firebase Emulator Suite antes de desplegarlas. No se crearon commits ni se publicó la aplicación.
