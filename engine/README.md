# Bellentani Mission Engine

El engine es la capa principal de Bellentani. Puede ejecutar misiones reales aunque se elimine todo el frontend y acepta especificaciones JSON o lenguaje natural con URLs explícitas.

## Instalación local

```bash
cd engine
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
playwright install chromium
```

## CLI

Desde la raíz del repositorio:

```bash
PYTHONPATH=. ./manos mission run engine/examples/public-site.json
PYTHONPATH=. ./manos mission status MISSION_ID
PYTHONPATH=. ./manos mission results MISSION_ID
PYTHONPATH=. ./manos mission export MISSION_ID csv engine/data/results/result.csv
PYTHONPATH=. ./manos mission run 'Analiza https://example.com y extrae SEO' --natural
```

La misión descarga páginas públicas realmente, extrae HTML, texto, metadatos, JSON-LD, enlaces y señales tecnológicas, guarda evidencias con hash y persiste resultados en SQLite. El navegador usa rate limiting, cache TTL, deduplicación y respeto de robots.txt.

## API

```bash
PYTHONPATH=. uvicorn engine.api.server:app --host 0.0.0.0 --port 8080
```

Endpoints: `POST /missions`, `GET /missions`, `GET /missions/{id}`, `GET /missions/{id}/status` y `GET /missions/{id}/results`.

## Docker

```bash
cd engine
docker compose up --build
```

Los datos se conservan en `engine/data`. La interfaz Electron/Web no participa en la ejecución del engine.
