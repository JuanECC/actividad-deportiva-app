# Arquitectura

## Flujos

main.jsx monta ErrorBoundary y AuthProvider. App.jsx define login público y un Workspace protegido, montado por uid. Al cambiar de usuario se desmontan formularios y suscripciones del anterior.

Workspace comparte actividades y perfil entre las páginas. Los hooks escuchan Firestore con onSnapshot, cancelan la suscripción al desmontarse y descartan datos cuyo uid no corresponda a la sesión actual.

- useActividades: sesiones, planes, edición y borrado.
- useSueno: un registro por fecha al despertar.
- usePerfil: nombre y metas mensuales.
- utils/actividad.js: fechas locales, duración, distancias, rangos, rachas y avance.
- GymCatalog/useEjercicios/wgerApi: consultas públicas independientes de los datos del usuario.

## Datos

users/{uid}/actividades/{id}:

- nombre, deporte, tipo (run, bike, swim, strength o sport).
- fecha: YYYY-MM-DD local para nuevos registros. Se leen también fechas ISO antiguas.
- duracionMinutos: número canónico. duracion conserva la entrada legible.
- distancia: texto numérico en carrera/ciclismo/natación/fuerza; resultado libre en sport.
- ritmo: calculado para carrera, bicicleta y natación; observaciones opcionales para fuerza/sport.
- modoFuerza: rounds o tiempo. En modo tiempo la métrica es minutos por ronda.
- esPlan, diasSeleccionados, semanas y planId.

Un plan no suma métricas realizadas. Completar una fecha abre un formulario con los valores del plan como propuesta. Al guardar, se crea una sesión independiente con resultados confirmados.

Nuevas sesiones de plan usan id = planId + '_' + fecha y transacciones para impedir duplicados concurrentes. Mover una sesión a otro día comprueba el destino, elimina el documento anterior y guarda el nuevo en una transacción. El estado completado se deriva de las fechas únicas realizadas y no depende del booleano histórico persistido.

El calendario de un plan existente permanece fijo; para otra programación se crea un plan nuevo. Sí se editan su nombre y métricas previstas. Eliminarlo conserva las sesiones realizadas, visibles en el historial, sin depender de que aún exista el plan.

users/{uid}/sueno/{fecha}: fecha al despertar, horas, duración en minutos y esSueno. El ID por fecha y la transacción evitan nuevos duplicados. Se leen y pueden eliminarse registros antiguos con ID aleatorio.

users/{uid}/perfil/info: nombre y metas { distancia, fuerza, suenio }. Las metas son mensuales y permanecen fijas hasta editarlas.

## Estadísticas

Los filtros incluyen desde el inicio local de semana/mes/año hasta hoy. La comparación usa el periodo anterior completo, incluido su último día. Distancia convierte natación de metros a kilómetros. Ritmo de carrera = minutos totales / kilómetros totales de sesiones tipo run, ponderado por distancia. La racha puede terminar ayer mientras hoy aún no tenga actividad.

Los objetivos siempre usan el mes actual y los récords todo el historial. El selector de rango solo aparece en el panel, donde sí aplica al resumen, gráfico e historial.

## Compatibilidad

Los registros sin duracionMinutos se interpretan con la convención histórica hh:mm. No se adivina si un valor como 42:10 significaba horas o minutos: el formulario avisa al editar y permite corregirlo. No se ejecutan migraciones ni borrados automáticos.
