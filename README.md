# Belentani Mission Engine

Belentani es un motor ejecutable de investigación web. La interfaz Electron es opcional: el producto principal funciona por CLI y API aunque se elimine todo el frontend.

## Primera ejecución real

```bash
cd /home/ubuntu/Belentani
PYTHONPATH=. ./manos mission run engine/examples/public-site.json
PYTHONPATH=. ./manos mission status ID_DE_MISION
PYTHONPATH=. ./manos mission results ID_DE_MISION
PYTHONPATH=. ./manos mission export ID_DE_MISION csv engine/data/results/result.csv
```

El engine navega URLs públicas de forma real, sigue páginas internas dentro del mismo host, extrae HTML, texto, títulos, descripciones, headings, enlaces, JSON-LD, señales de tecnología y oportunidades, y conserva evidencia con hash, estado, timestamps y artefactos.

## Misión multi-URL

```bash
PYTHONPATH=. ./manos mission run engine/examples/multi-site.json
```

La ejecución usa concurrencia controlada, rate limiting por host, retries, errores aislados, persistencia SQLite y deduplicación de URLs.

## API

```bash
PYTHONPATH=. uvicorn engine.api.server:app --host 0.0.0.0 --port 8080
```

La API ofrece `POST /missions`, `GET /missions`, `GET /missions/{id}`, `GET /missions/{id}/status` y `GET /missions/{id}/results`. Las misiones se ejecutan en workers y pueden consultarse mientras avanzan.

## Docker

```bash
cd engine
docker compose up --build
```

El contenedor instala Playwright Chromium, persiste SQLite y artefactos en `engine/data`, y expone el puerto 8080. En el sandbox actual no hay daemon Docker; el Dockerfile y compose están preparados para un host con Docker.

## Desarrollo y pruebas

```bash
cd /home/ubuntu/Belentani
PYTHONPATH=. python3 -m unittest discover -s engine/tests -v
```

Los tests ejecutan un servidor HTTP real local y verifican extracción, JSON-LD, evidencia, validación de URLs y persistencia. `engine/requirements.txt` contiene las dependencias del motor. La arquitectura se separa en `core`, `browser`, `scraper`, `intelligence`, `storage`, `observability`, `integrations` y `api`.

## Interfaces existentes

`desktop/` conserva el IDE Electron y la consola opcional. No es necesario para ejecutar misiones. La CLI `manos` y la API FastAPI usan directamente `engine/`.

## Configuración

Copia `engine/.env.example` y configura `BELLENTANI_DB`, `BELLENTANI_ARTIFACTS` y `BELLENTANI_WORKERS`. No se generan datos ficticios: si una fuente falla, la misión registra el error y no inventa el resultado.
