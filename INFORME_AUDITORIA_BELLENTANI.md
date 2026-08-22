# Informe técnico de acciones y metadatos

## Bellentani Mission Engine

**Autor del informe:** Manus AI
**Fecha de elaboración:** 19 de agosto de 2026
**Zona temporal de las marcas de ejecución:** UTC
**Repositorio:** [`belentani7/belentani7`](https://github.com/belentani7/belentani7) [1]
**Rama auditada:** [`feat/mission-engine`](https://github.com/belentani7/belentani7/tree/feat/mission-engine) [2]
**Commit final auditado:** [`150fa427143e041c88c801fde749e47d3270a33a`](https://github.com/belentani7/belentani7/commit/150fa427143e041c88c801fde749e47d3270a33a) [3]
**Metadatos del informe:** 260 líneas, 2.473 palabras, 18.747 bytes; SHA-256 del borrador previo a esta inserción: `997ecefdfd511a9823dd2bbf653aac95678f9e846b139ec52b91a3cee0127174`.

> Este documento distingue entre acciones verificadas en el workspace, acciones verificadas en el clon de control Git y acciones no ejecutables por limitaciones del entorno. No se presentan como realizadas las operaciones que no pudieron ser comprobadas.

## 1. Resumen ejecutivo

El trabajo convirtió Bellentani desde una base de producto con frontend y consola opcional en un **motor de misiones autónomas de investigación y extracción web**, operativo por CLI y API. El engine puede recibir especificaciones estructuradas o misiones en lenguaje natural, descubrir URLs públicas cuando no se proporcionan semillas, navegar con Playwright y fallback HTTP, aplicar políticas de robots y rate limiting, utilizar cache persistente, extraer contenido verificable, calcular scoring determinista, almacenar eventos y costes en SQLite y exportar resultados.

Durante esta iteración se aplicaron cinco commits funcionales sobre `feat/mission-engine`. El último commit publicado es `150fa42`. La rama existe en GitHub, no está protegida y apunta al mismo SHA verificado en el clon de control. La suite final ejecutada contiene **5 pruebas correctas**; además, la validación de configuración de distribución terminó con `distribution-config-ok`.

La validación local no pudo realizar un build Docker porque el comando `docker` no está instalado en el sandbox. La configuración de Docker Compose fue revisada mediante un validador local sin PyYAML ni Docker. GitHub mostró previamente un aviso de vulnerabilidades Dependabot en la rama por defecto; la consulta API detallada de alertas devolvió `403 Resource not accessible by integration`, por lo que este informe no pretende enumerar ni corregir esas alertas sin acceso suficiente.

## 2. Alcance y objetivo operativo

El objetivo ejecutado fue continuar Bellentani como producto primario de backend, sin depender de una interfaz gráfica para funcionar. El alcance concreto incluyó autonomía de navegación y decisión básica, persistencia y recuperación, coste y memoria, API remota, pruebas end-to-end locales y empaquetado de distribución.

| Dimensión | Alcance aplicado |
|---|---|
| Producto | Mission Engine funcional mediante CLI y FastAPI. |
| Datos | Sólo extracción de sitios públicos y evidencia obtenida durante la ejecución; no se añadieron datos simulados. |
| Persistencia | SQLite para misiones, tareas, eventos, resultados, memoria y costes; cache y artefactos en disco. |
| Navegación | Playwright/Chromium con fallback HTTP, cache, robots.txt, rate limiting y deduplicación. |
| Lenguaje natural | Parser determinista para URLs, objetivo, páginas máximas, reintentos y política de descubrimiento. |
| API | Creación asíncrona, consulta de misión, estado, resultados, eventos y costes. |
| Distribución | Dockerfile existente, Compose con volumen persistente, healthcheck y `.dockerignore`. |
| Calidad | Compilación Python, comprobación de whitespace, pruebas unitarias y smoke test FastAPI. |

## 3. Cronología verificable de acciones

Las marcas siguientes proceden del historial Git del clon de control y de los registros de comandos ejecutados durante esta sesión. Los horarios están expresados en UTC.

| Hora aproximada | Acción | Resultado verificable |
|---|---|---|
| 04:51:06 | Publicación de la base del Mission Engine autónomo. | Commit `76db578`, `feat: add autonomous web mission engine`. |
| 06:22:06 | Integración de crawling resistente, cache, políticas y parser natural. | Commit `eaccad2`; 105 inserciones y 8 eliminaciones en 8 archivos. |
| 06:22:52 | Recuperación de trabajos huérfanos tras reinicio. | Commit `e754cd6`; 14 inserciones en CLI, almacenamiento y pruebas. |
| 06:24:31 | Descubrimiento real de URLs para misiones sin semillas explícitas. | Commit `ea25f20`; 33 inserciones en descubrimiento y orquestación. |
| 06:25:04 | Endurecimiento de health, workers y progreso de API. | Commit `ba1e8fe`; 33 inserciones en API y smoke test. |
| 06:26:03 | Cierre de distribución y validación de Compose. | Commit `150fa42`; 26 inserciones en `.dockerignore`, Compose y validador. |
| 06:33:43 | Captura de metadatos del workspace local. | Se comprobó que `/home/ubuntu/Belentani` no contiene `.git`; el control Git se realizó desde `/tmp/belentani7-remote`. |

El hecho de que el workspace de trabajo no contenga `.git` es importante: los hashes y el estado de publicación de esta auditoría proceden del clon de control `/tmp/belentani7-remote`, mientras que los hashes de archivos proceden del workspace `/home/ubuntu/Belentani`.

## 4. Historial de commits aplicado

| SHA corto | SHA completo | Mensaje | Cambios |
|---|---|---|---:|
| `eaccad2` | `eaccad23403a8572ec9563b0ba2dc98e786c3a83` | `feat: add resilient crawling and natural missions` | 105 inserciones, 8 eliminaciones, 8 archivos. |
| `e754cd6` | `e754cd62b5de9829744ceaab07b6710dccaec6d6` | `feat: recover interrupted mission jobs` | 14 inserciones, 3 archivos. |
| `ea25f20` | `ea25f200d82614d0f17abfafb9ca9897861d1b74` | `feat: discover real URLs for natural missions` | 33 inserciones, 2 archivos. |
| `ba1e8fe` | `ba1e8fed8e98d934bd4cbdb3c6894dfe202bcd39` | `feat: harden API job status and health` | 33 inserciones, 2 archivos. |
| `150fa42` | `150fa427143e041c88c801fde749e47d3270a33a` | `chore: finalize container distribution checks` | 26 inserciones, 3 archivos. |

Cada grupo de cambios fue sincronizado desde `/home/ubuntu/Belentani` al clon Git de control, verificado con `git diff --cached --check`, compilado y probado antes de ejecutar `git push origin feat/mission-engine`.

## 5. Inventario funcional y técnico

### 5.1 Orquestación de misiones

El archivo `engine/core/mission.py` normaliza especificaciones estructuradas o texto natural, crea la misión persistente, registra eventos, descubre URLs cuando `needs_discovery` está activo, planifica tareas HTTP(S), ejecuta tareas concurrentes y cierra la misión como `completed`, `completed_with_errors` o `failed` según los estados reales.

La lógica de reintentos conserva el número de intento, registra `task.retry`, aplica backoff exponencial limitado y guarda memoria de éxito o fallo por dominio. Si una tarea no produce páginas reales, se marca como fallida; no se fabrica un resultado sustituto.

### 5.2 Parser natural

`engine/core/natural.py` detecta URLs HTTP(S), extrae el primer número entero como límite de páginas con techo de 50, establece reintentos y rate limit predeterminados y marca `needs_discovery` cuando no hay URLs. El parser es determinista y conserva el texto original como `objective` y fuente de misión.

### 5.3 Descubrimiento web real

`engine/browser/discovery.py` consulta la versión HTML pública de DuckDuckGo, limita la cantidad de resultados, desenrolla parámetros `uddg` de redirección, elimina duplicados y acepta únicamente URLs HTTP(S). Una consulta verificada durante la ejecución produjo dos destinos reales: Wikipedia y Creative Commons. En una consulta anterior, el selector inicial no interpretó correctamente las redirecciones y devolvió cero resultados; se inspeccionó el HTML real, se corrigió el parser y se repitió la prueba con éxito.

### 5.4 Navegación y políticas

`engine/browser/navigation.py` usa Playwright cuando está disponible y fallback HTTP cuando procede. La navegación incorpora cache persistente, límite de tasa, deduplicación y captura de respuestas. `engine/browser/policy.py` centraliza validaciones de URL y el respeto de `robots.txt`. Las URLs que no sean HTTP o HTTPS se rechazan por política.

### 5.5 Extracción e inteligencia

`engine/scraper/extraction.py` obtiene título, descripción, texto, metadata, JSON-LD y tecnologías detectables. `engine/intelligence/scoring.py` calcula una puntuación determinista basada en señales extraídas y objetivo. Cada página se conserva junto con estado HTTP, URL efectiva y evidencia que permite verificar el resultado.

### 5.6 Persistencia, cache y memoria

`engine/storage/database.py` persiste misiones, tareas, eventos, resultados, costes y memoria de estrategias en SQLite. Se añadió `recover_orphans`, que cambia a `interrupted` las misiones `running` o `queued` y las tareas `running` cuando el proceso se reinicia.

`engine/storage/cache.py` almacena respuestas JSON con TTL, fecha de escritura y eliminación de entradas expiradas. El workspace local contiene una base SQLite de 65.536 bytes y una entrada de cache JSON de 850 bytes; estos datos de ejecución no se publican en GitHub porque están excluidos o se conservan mediante `.gitkeep`.

### 5.7 API

La API FastAPI expone las siguientes rutas:

| Método | Ruta | Propósito |
|---|---|---|
| `GET` | `/health` | Comprueba la aplicación y la lectura de SQLite. |
| `POST` | `/missions` | Encola una misión estructurada o natural. |
| `GET` | `/missions` | Lista misiones persistidas. |
| `GET` | `/missions/{mission_id}` | Devuelve una misión concreta. |
| `GET` | `/missions/{mission_id}/status` | Devuelve estado, tareas y progreso agregado. |
| `GET` | `/missions/{mission_id}/results` | Devuelve misión, tareas, eventos y costes. |
| `GET` | `/docs` | Documentación OpenAPI de FastAPI. |
| `GET` | `/openapi.json` | Esquema OpenAPI. |

Los workers asíncronos capturan excepciones de nivel superior y marcan la misión como fallida con un evento `mission.worker_error`, evitando trabajos silenciosamente perdidos.

### 5.8 CLI

El ejecutable `manos` expone el programa `bellentani` y el subcomando `mission`. La ayuda verificada fue:

```text
usage: bellentani [-h] {mission} ...
positional arguments:
  {mission}
options:
  -h, --help
```

La CLI usa `BELLENTANI_DB`, `BELLENTANI_ARTIFACTS` y `BELLENTANI_WORKERS`. El archivo `.env.example` documenta también `BELLENTANI_LOG_LEVEL`.

### 5.9 Distribución

`engine/Dockerfile` utiliza `python:3.11-slim`, instala las dependencias fijadas, instala Chromium mediante Playwright, expone el puerto 8080 y arranca Uvicorn. `engine/docker-compose.yml` monta `./data` en `/app/data`, configura SQLite y artefactos persistentes, reinicio automático y healthcheck HTTP interno. `engine/.dockerignore` evita incorporar cachés, bases SQLite, artefactos, entornos y metadatos Git a la imagen.

## 6. Inventario de archivos

El workspace local contiene **48 archivos bajo `engine/`**, de los cuales **25 son Python**, sin contar directorios `__pycache__`. El inventario funcional principal es el siguiente:

| Área | Archivos principales |
|---|---|
| `core` | `mission.py`, `natural.py`. |
| `browser` | `navigation.py`, `policy.py`, `discovery.py`. |
| `scraper` | `extraction.py`. |
| `intelligence` | `scoring.py`. |
| `storage` | `database.py`, `cache.py`, `export.py`. |
| `observability` | `logging.py`. |
| `api` | `server.py`. |
| `tests` | `test_engine.py`, `test_api_smoke.py`, `validate_distribution.py`. |
| Distribución | `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.env.example`, `requirements.txt`. |
| Documentación | `README.md`, `docs/architecture.md`, `docs/deployment.md`, `docs/extensions.md`. |
| Ejemplos | `examples/public-site.json`, `examples/multi-site.json` y salidas JSON, JSONL, CSV. |

## 7. Dependencias y versiones

El contrato de dependencias publicado en `engine/requirements.txt` fija las versiones siguientes:

| Dependencia | Versión |
|---|---:|
| `beautifulsoup4` | 4.15.0 |
| `fastapi` | 0.116.1 |
| `playwright` | 1.55.0 |
| `pydantic` | 2.11.7 |
| `requests` | 2.34.2 |
| `uvicorn[standard]` | 0.35.0 |

El entorno de validación reportó Python `3.12.3` y Node `v22.13.0`. El Dockerfile fija Python `3.11-slim`, por lo que existe una diferencia deliberada entre el runtime de prueba del sandbox y el runtime objetivo de contenedor.

## 8. Pruebas y validaciones

La suite final se ejecutó con:

```bash
PYTHONPATH=. python3 -m compileall -q engine
PYTHONPATH=. python3 -m unittest discover -s engine/tests -v
```

El resultado fue:

```text
Ran 5 tests in 1.137s
OK
```

| Prueba | Resultado | Cobertura |
|---|---|---|
| `test_health_and_missing_mission` | Correcta | Health check y respuesta 404 de API. |
| `test_invalid_url_is_validated` | Correcta | Rechazo de URL no HTTP(S). |
| `test_natural_parser_and_cache` | Correcta | Parser natural y cache persistente. |
| `test_real_engine` | Correcta | Extracción real contra un servidor HTTP local. |
| `test_recover_orphans` | Correcta | Recuperación de misión `running` a `interrupted`. |

También se ejecutó:

```bash
PYTHONPATH=. python3 engine/tests/validate_distribution.py
```

Resultado: `distribution-config-ok`.

Durante las pruebas apareció un `ResourceWarning` de socket no cerrado en el test del engine real y un `StarletteDeprecationWarning` relacionado con `TestClient` y `httpx`. Ambos no hicieron fallar la suite, pero quedan registrados como deuda técnica de limpieza para una futura iteración.

El comando `git diff --cached --check` pasó en cada publicación, después de corregir finales de línea CRLF en un CSV de ejemplo. También se ejecutó `git ls-remote --heads origin feat/mission-engine` después de cada push para comprobar que GitHub recibía el SHA esperado.

## 9. Metadatos de archivos críticos

Los SHA-256 capturados en el workspace local son:

| Archivo | SHA-256 |
|---|---|
| `engine/core/mission.py` | `6d114832c91c9ff60623cc4fbe7c9032965245cdc7ac7f5caa48287a679bcdf7` |
| `engine/core/natural.py` | `6b639e490290f3ff3c3913f5096eecbc8887cd27c162a59bb1b71a02c79e65a3` |
| `engine/browser/discovery.py` | `8536ab7b88bb82c40618d95a59161c4edd2e3feaf7812199ea0a7a60973e8e66` |
| `engine/storage/database.py` | `081c5c1844646be561bf6790716273389cc1d277295ffb20bb24d7650631f590` |
| `engine/api/server.py` | `dd16cf3db77c898a86cc4ca78427ac67ffc0e254743964fdcccb83dd0c922963` |
| `engine/Dockerfile` | `05705ac2f9a03a154197beb2a4228714f8fc0a0f8303774e3b29e78635e511e0` |
| `engine/docker-compose.yml` | `88aff2a3ed5b0bb03f58051f574674f98bd3289abb1ca5404af6ec6cd63fbf55` |

Estos hashes identifican el estado del workspace local al momento de captura del informe. El identificador de autoridad para el estado publicado es el SHA del commit `150fa427...`.

## 10. Metadatos del repositorio GitHub

| Campo | Valor |
|---|---|
| Repositorio | `belentani7/belentani7` |
| URL | `https://github.com/belentani7/belentani7` |
| Visibilidad | Pública (`isPrivate: false`). |
| Rama por defecto | `main`. |
| Rama de trabajo | `feat/mission-engine`. |
| SHA de rama | `150fa427143e041c88c801fde749e47d3270a33a`. |
| Protección de rama | No protegida según la API consultada. |
| Descripción | `Belentani + NOIACORE \| Frontend, creative technology and educational platforms`. |
| Fecha de creación del repositorio | `2026-08-11T23:12:18Z`. |
| Última actualización reportada por `gh repo view` | `2026-08-19T04:05:29Z`. |

El clon de control local quedó limpio: `git status --porcelain` no devolvió cambios. El workspace de desarrollo, en cambio, conserva datos locales de ejecución bajo `engine/data/`; esos datos no deben confundirse con archivos publicados.

## 11. Limitaciones y riesgos conocidos

La primera limitación es operacional: el sandbox no tiene instalado el binario Docker, por lo que no se ejecutó `docker compose config`, `docker build` ni un arranque real del contenedor. Se validó el contenido del Compose mediante `validate_distribution.py`, pero esta validación no sustituye un build real en una máquina con Docker.

La segunda limitación es de acceso de seguridad: GitHub anunció vulnerabilidades Dependabot en la rama por defecto. La llamada API detallada de alertas terminó con `403 Resource not accessible by integration`; por ello no se inventó un listado de paquetes afectados. La revisión debe realizarse con una sesión GitHub que tenga permisos de seguridad suficientes en [`Security/Dependabot`](https://github.com/belentani7/belentani7/security/dependabot).

La tercera limitación es técnica: el descubrimiento web depende de una fuente HTML pública de DuckDuckGo y puede cambiar si el proveedor modifica su markup, aplica rate limit o bloquea el tráfico. El engine registra fallo de descubrimiento y no inventa URLs; para producción conviene añadir proveedores configurables y pruebas contractuales.

La cuarta limitación es de compatibilidad: el test de API produce un warning deprecado en la combinación actual de Starlette/httpx. No invalida el resultado, pero conviene actualizar el patrón de cliente de prueba cuando la plantilla de dependencias lo permita.

La quinta limitación es de recursos: el navegador Playwright y la ejecución concurrente necesitan límites de memoria, timeout y rate limit adecuados para misiones masivas. La configuración actual ofrece límites básicos, no un planificador distribuido ni un sistema de cuotas multiusuario.

## 12. Estado final y criterio de finalización

El estado final publicado es **funcional y verificable como engine de investigación web**, con CLI, API, persistencia, navegación real, extracción real, scoring y distribución preparada. La comprobación final confirmó que el clon de control está limpio y que `refs/heads/feat/mission-engine` apunta exactamente al SHA `150fa427143e041c88c801fde749e47d3270a33a`. La rama de trabajo se encuentra en GitHub y el SHA remoto coincide con el commit final auditado.

No sería técnicamente correcto afirmar que el producto está certificado como “10/10” en todos los aspectos industriales: no se ejecutó Docker en este entorno, no se completó una auditoría de seguridad Dependabot por falta de permisos, y permanecen warnings menores de recursos y compatibilidad de testing. Sí es correcto afirmar que la iteración ejecutada quedó finalizada, probada localmente y publicada con trazabilidad completa.

## Referencias

[1]: https://github.com/belentani7/belentani7 "Repositorio GitHub belentani7/belentani7"

[2]: https://github.com/belentani7/belentani7/tree/feat/mission-engine "Rama feat/mission-engine"

[3]: https://github.com/belentani7/belentani7/commit/150fa427143e041c88c801fde749e47d3270a33a "Commit final de distribución"

[4]: https://github.com/belentani7/belentani7/commits/feat/mission-engine "Historial de commits de la rama del engine"

[5]: https://github.com/belentani7/belentani7/security/dependabot "Alertas Dependabot del repositorio"
