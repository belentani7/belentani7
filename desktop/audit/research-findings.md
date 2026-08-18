# Hallazgos de investigación para auditoría 10/10

## Cline
Fuente primaria: https://github.com/cline/cline

Cline publica un agente open source para IDE y terminal con CLI interactiva y headless, edición multiarchivo con checkpoints/diffs, ejecución de comandos, modos Plan/Act, reglas y skills, múltiples proveedores incluido Ollama/LM Studio y APIs OpenAI-compatible, plugins/MCP, equipos multiagente, sesiones persistentes y tareas programadas. La página declara licencia Apache 2.0.

## Monaco Editor
Fuente primaria: https://microsoft.github.io/monaco-editor/

Monaco es el editor que impulsa VS Code. La documentación pública describe IntelliSense/validación, colorización, múltiples lenguajes, editor de diferencias y temas. La página declara licencia MIT, soporte para navegadores de escritorio y versión publicada 0.55.1 al momento de la consulta.

## Implicación para Bellentani

La arquitectura actual de Bellentani cubre parte de estas capacidades mediante un textarea, agente configurable, terminal, memoria, Git y PVC-U, pero no alcanza todavía equivalencia 10/10 con Monaco/Cline: faltan editor Monaco real, diffs y checkpoints completos, ejecución multiagente persistente, plugins/MCP reales, headless CLI, scheduling y pruebas Windows nativas. Estos puntos son bloqueadores de la barrera 10/10 y deben corregirse antes de publicar un repositorio nuevo.

## OpenHands
Fuente primaria: https://github.com/OpenHands/OpenHands

El repositorio muestra una plataforma de desarrollo dirigida por IA con servidor/agente, frontend, integraciones Electron, herramientas, tests e infraestructura Docker/Helm. La página de GitHub muestra licencia MIT, actividad muy reciente y un volumen grande de contribuciones. Es una referencia fuerte para agente autónomo, ejecución y arquitectura de plataforma, pero también introduce complejidad operativa que Bellentani debe aislar y simplificar para Windows 11.

## Aider
Fuente primaria: https://github.com/Aider-AI/aider

Aider es un agente de programación para terminal con integración Git. La página primaria describe commits automáticos con mensajes sensibles y uso de herramientas Git para diff, gestión y undo de cambios. El repositorio declara licencia Apache 2.0. Es una referencia fuerte para flujo CLI y reversibilidad de cambios.

## Implicación adicional

La auditoría 10/10 debe exigir, como mínimo, editor real con diffs, agente CLI/headless, checkpoints o commits reversibles, ejecución aislada, pruebas automatizadas, proveedor local y compatible con OpenAI, persistencia de sesiones, extensibilidad y documentación de licencias. La versión actual aún no cumple 10/10 en esos puntos.
