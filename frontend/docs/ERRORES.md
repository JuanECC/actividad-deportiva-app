# Validaciones y errores

Zod valida sesiones y sueño antes de escribir. Nombres se recortan, números negativos y duraciones inválidas se rechazan, y deporte/tipo deben coincidir. Las sesiones realizadas no aceptan fechas futuras. Duración admite minutos, mm:ss, hh:mm:ss y horas/minutos explícitos; se almacena en minutos.

Las mutaciones propagan el error al formulario. Solo se cierra el modal o anuncia éxito después de resolver la escritura. Un error de escritura no reemplaza permanentemente el historial por una pantalla de error.

Los botones se bloquean durante el guardado; el modal no se puede cerrar mientras hay una escritura pendiente. Escape y Tab se gestionan dentro del diálogo y se restaura el foco al cerrarlo.

El cliente HTTP usa un límite de 15 segundos, cancelación, respuestas JSON verificadas y mensajes para conexión, timeout, HTTP y saturación. Las pantallas permiten reintentar el catálogo.

Los errores de suscripción muestran un mensaje específico y se limpian con la siguiente respuesta exitosa. Si la suscripción termina por permisos, la interfaz indica recargar para reintentar.

ErrorBoundary cubre fallos de renderizado con un mensaje genérico; los errores asíncronos se capturan en sus propios formularios. Los detalles técnicos quedan en la consola, no en el mensaje visible.
