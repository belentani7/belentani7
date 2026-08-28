# Extensiones

Añadir un navegador alternativo en `engine/browser`, un extractor en `engine/scraper` o una estrategia de puntuación en `engine/intelligence`. Cada extensión debe devolver datos serializables, conservar URL y hash de evidencia, fallar sin inventar valores y añadir una prueba unittest. Las integraciones LLM deben ser opcionales: la extracción determinista tiene prioridad.
