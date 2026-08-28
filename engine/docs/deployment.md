# Despliegue

Local: instalar `engine/requirements.txt`, ejecutar `playwright install chromium` y lanzar `PYTHONPATH=. uvicorn engine.api.server:app --port 8080`.

Docker: ejecutar `cd engine && docker compose up --build`. El volumen `engine/data` conserva SQLite y artefactos. Configurar `BELLENTANI_DB`, `BELLENTANI_ARTIFACTS` y `BELLENTANI_WORKERS` por entorno; no se incluyen secretos en el repositorio.
