# Catálogo Wger

Base configurable: VITE_API_URL, por defecto https://wger.de/api/v2.

El gimnasio usa GET /exerciseinfo/?limit=20&offset=0 con filtros category, muscles y equipment. El resultado contiene categorías, músculos y traducciones completas, evitando una petición de detalle por tarjeta.

Catálogos auxiliares: /exercisecategory/, /muscle/, /equipment/ y /language/, con limit=100. Los idiomas se resuelven por short_name: se prefiere es, luego en y por último la primera traducción disponible. En la consulta verificada, español corresponde al ID 4 e inglés al 2.

La paginación usa count y offset. Cada cambio de filtro reinicia la primera página y cancela la petición anterior. Las consultas auxiliares comparten caché en memoria; un fallo elimina su entrada para permitir reintentos.

Las descripciones HTML se convierten a texto, sin insertar HTML externo en React. Cada ejercicio enlaza a Wger e incluye atribución/licencia cuando están disponibles.

La pestaña de deportes usa utils/deportes.js, sin consultar TheSportsDB. Los helpers de nutrición, deportes externos y detalle individual permanecen como código auxiliar; no hay página de nutrición conectada.

Referencia primaria: https://wger.readthedocs.io/en/latest/api/api.html
