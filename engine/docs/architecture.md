# Arquitectura

`engine/core` normaliza la misión, crea el plan, ejecuta tareas concurrentes, reintenta errores y valida estados. `engine/browser` navega con Playwright cuando Chromium está disponible y usa HTTP como fallback verificable. `engine/scraper` transforma snapshots reales en registros estructurados. `engine/intelligence` puntúa únicamente campos observados y crea oportunidades con evidencia. `engine/storage` conserva misiones, tareas, eventos, memoria, costes y exportaciones en SQLite. `engine/api` y `manos` son interfaces equivalentes sobre el mismo motor.
