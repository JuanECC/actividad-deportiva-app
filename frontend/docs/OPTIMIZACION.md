# Rendimiento

Los filtros del gimnasio usan dependencias primitivas y cancelación: respuestas antiguas no sustituyen resultados de filtros nuevos. El gimnasio solo se monta al seleccionar su pestaña.

Las consultas de categorías, músculos, equipamiento e idiomas comparten caché en memoria. Se eliminó la consulta duplicada de músculos del flujo activo. exerciseinfo trae los nombres e instrucciones sin pedir un detalle por cada tarjeta.

El catálogo pagina de 20 en 20. Historial de actividades y sueño muestran 10 registros y permiten ampliar. Actualmente Firestore sigue suscribiendo el historial completo del usuario: para volúmenes grandes convendrá paginación y agregados en servidor.

Los cálculos están centralizados en utils/actividad.js. El reloj se actualiza una vez por minuto para evitar que fecha, rangos y racha queden congelados al cambiar de día.

La compilación separa React y los módulos principales de Firebase para mejorar el aprovechamiento de caché. Workbox cachea recursos estáticos y consultas públicas de Wger; las actualizaciones de la PWA requieren una acción del usuario para no interrumpir formularios.
