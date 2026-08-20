# 📡 Documentación de la API — Wger

## 🔗 URL Base

https://wger.de/api/v2/

---

## 🔑 Autenticación

La API de **Wger** no requiere una API Key para consultar los endpoints públicos.

La autenticación mediante **OAuth** únicamente es necesaria para operaciones relacionadas con el usuario, como:

* Crear rutinas personalizadas.
* Registrar entrenamientos propios.
* Gestionar información privada del usuario.

Para las consultas utilizadas en el proyecto, **no es necesario implementar autenticación**.

---

# ✅ Endpoints probados y funcionales

## 1. Lista de ejercicios

### Endpoint

```http
GET /exercise/
```

### Parámetros

| Parámetro   | Descripción                                   | Ejemplo        |
| ----------- | --------------------------------------------- | -------------- |
| `language`  | Idioma de los datos                           | `?language=2`  |
| `limit`     | Número de resultados por página               | `?limit=20`    |
| `offset`    | Número de resultados a saltar para paginación | `?offset=20`   |
| `category`  | Filtrar por categoría de ejercicio            | `?category=10` |
| `muscles`   | Filtrar por músculo principal                 | `?muscles=1`   |
| `equipment` | Filtrar por equipamiento                      | `?equipment=1` |

### URL probada

```text
https://wger.de/api/v2/exercise/?language=2&limit=3
```

### Respuesta JSON

```json
{
  "count": 860,
  "next": "https://wger.de/api/v2/exercise/?language=2&limit=3&offset=3",
  "previous": null,
  "results": [
    {
      "id": 9,
      "uuid": "1b020b3a-3732-4c7e-92fd-a0cec90ed69b",
      "category": 10,
      "muscles": [11, 8],
      "muscles_secondary": [10, 6],
      "equipment": [10],
      "license_author": "deusinvictus"
    }
  ]
}
```

> **Nota:** Los datos de nombre y descripción en español se obtienen mediante el endpoint `GET /exerciseinfo/{id}/?language=2`.

---

## 2. Grupos musculares

### Endpoint

```http
GET /muscle/
```

### Parámetros

| Parámetro  | Descripción         | Ejemplo       |
| ---------- | ------------------- | ------------- |
| `language` | Idioma de los datos | `?language=2` |

### URL probada

```text
https://wger.de/api/v2/muscle/?language=2
```

### Respuesta JSON

```json
{
  "count": 15,
  "results": [
    {
      "id": 1,
      "name": "Biceps brachii",
      "name_en": "Biceps",
      "is_front": true,
      "image_url_main": "https://wger.de/static/images/muscles/main/muscle-1.svg",
      "image_url_secondary": "https://wger.de/static/images/muscles/secondary/muscle-1.svg"
    }
  ]
}
```

> **Nota:** La API proporciona **15 grupos musculares**, incluyendo imágenes SVG para representar la musculatura principal y secundaria.

---

## 3. Categorías de ejercicio

### Endpoint

```http
GET /exercisecategory/
```

### URL probada

```text
https://wger.de/api/v2/exercisecategory/
```

### Respuesta JSON

```json
{
  "count": 8,
  "results": [
    {
      "id": 10,
      "name": "Abs"
    },
    {
      "id": 8,
      "name": "Arms"
    },
    {
      "id": 12,
      "name": "Back"
    },
    {
      "id": 14,
      "name": "Calves"
    },
    {
      "id": 15,
      "name": "Cardio"
    },
    {
      "id": 11,
      "name": "Chest"
    },
    {
      "id": 9,
      "name": "Legs"
    },
    {
      "id": 13,
      "name": "Shoulders"
    }
  ]
}
```

### Categorías disponibles

| ID | Categoría |
| -: | --------- |
| 10 | Abs       |
|  8 | Arms      |
| 12 | Back      |
| 14 | Calves    |
| 15 | Cardio    |
| 11 | Chest     |
|  9 | Legs      |
| 13 | Shoulders |

---

## 4. Equipamiento

### Endpoint

```http
GET /equipment/
```

### URL probada

```text
https://wger.de/api/v2/equipment/
```

### Respuesta JSON

```json
{
  "count": 12,
  "results": [
    {
      "id": 1,
      "name": "Barbell"
    },
    {
      "id": 8,
      "name": "Bench"
    },
    {
      "id": 12,
      "name": "Cable machine"
    },
    {
      "id": 3,
      "name": "Dumbbell"
    },
    {
      "id": 4,
      "name": "Gym mat"
    },
    {
      "id": 9,
      "name": "Incline bench"
    },
    {
      "id": 10,
      "name": "Kettlebell"
    },
    {
      "id": 6,
      "name": "Pull-up bar"
    },
    {
      "id": 11,
      "name": "Resistance band"
    },
    {
      "id": 2,
      "name": "SZ-Bar"
    },
    {
      "id": 5,
      "name": "Swiss Ball"
    },
    {
      "id": 7,
      "name": "none (bodyweight exercise)"
    }
  ]
}
```

### Equipamiento disponible

| ID | Equipamiento      |
| -: | ----------------- |
|  1 | Barbell           |
|  8 | Bench             |
| 12 | Cable machine     |
|  3 | Dumbbell          |
|  4 | Gym mat           |
|  9 | Incline bench     |
| 10 | Kettlebell        |
|  6 | Pull-up bar       |
| 11 | Resistance band   |
|  2 | SZ-Bar            |
|  5 | Swiss Ball        |
|  7 | None / Bodyweight |

---

## 5. Ingredientes nutricionales

### Endpoint

```http
GET /ingredient/
```

### Parámetros

| Parámetro  | Descripción                     | Ejemplo       |
| ---------- | ------------------------------- | ------------- |
| `language` | Idioma de los datos             | `?language=2` |
| `limit`    | Número de resultados por página | `?limit=20`   |
| `offset`   | Número de resultados a saltar   | `?offset=20`  |

### URL probada

```text
https://wger.de/api/v2/ingredient/?language=2&limit=3
```

### Respuesta JSON

```json
{
  "count": 1358902,
  "results": [
    {
      "id": 1714069,
      "name": "La pizza chèvre affiné Lardons",
      "brand": "Sodebo",
      "energy": 238,
      "protein": "11.465",
      "carbohydrates": "25.478",
      "carbohydrates_sugar": "3.312",
      "fat": "9.554",
      "fat_saturated": "5.605",
      "fiber": "4.140",
      "sodium": null,
      "source_name": "Open Food Facts"
    }
  ]
}
```

> **Nota:** El endpoint contiene más de **1.3 millones de ingredientes**, con información nutricional como energía, proteínas, carbohidratos, grasas, fibra y sodio.

---

# 🏗️ Integración en el proyecto

La API de Wger se integra en diferentes partes del proyecto para proporcionar información relacionada con ejercicios, actividad física y nutrición.

| Archivo                     | Descripción                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| `src/services/wgerApi.js`   | Cliente HTTP encargado de realizar las peticiones a la API de Wger   |
| `src/pages/Actividades.jsx` | Página encargada de mostrar el catálogo de ejercicios                |
| `src/pages/Nutricion.jsx`   | Página encargada del buscador de alimentos e información nutricional |

---

# 🔄 Flujo de integración

```text
                 ┌─────────────────────┐
                 │     Aplicación      │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   wgerApi.js        │
                 │ Cliente HTTP        │
                 └──────────┬──────────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │ API Exercises   │   │ API Nutrition   │
        └────────┬────────┘   └────────┬────────┘
                 │                     │
                 ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │ Actividades.jsx │   │ Nutricion.jsx   │
        └─────────────────┘   └─────────────────┘
```

---

# 📊 Resumen de endpoints

| Endpoint                  | Uso en el proyecto                   |    Estado    |
| ------------------------- | ------------------------------------ | :----------: |
| `GET /exercise/`          | Catálogo de ejercicios               |   ✅ Probado  |
| `GET /exerciseinfo/{id}/` | Detalle del ejercicio y traducciones | ⏳ Por probar |
| `GET /muscle/`            | Filtro por grupos musculares         |   ✅ Probado  |
| `GET /exercisecategory/`  | Categorías de ejercicios             |   ✅ Probado  |
| `GET /equipment/`         | Filtro por equipamiento              |   ✅ Probado  |
| `GET /ingredient/`        | Buscador de alimentos                |   ✅ Probado  |
| `GET /exerciseimage/`     | Imágenes de ejercicios               | ⏳ Por probar |

---

# 🧪 Estado de las pruebas

Los endpoints principales necesarios para la integración del proyecto fueron probados correctamente.

### Endpoints funcionales

* `/exercise/`
* `/muscle/`
* `/exercisecategory/`
* `/equipment/`
* `/ingredient/`

### Endpoints pendientes

* `/exerciseinfo/{id}/`
* `/exerciseimage/`

---

# 📅 Información de las pruebas

**Fecha:** 18 de agosto de 2026
**Realizado por:** Equipo SPLIT

### Resultado

> ✅ **Todos los endpoints principales utilizados por el proyecto funcionan correctamente.**

---

# 🔗 Referencia

Documentación y API oficial de Wger:

https://wger.de/api/v2/
