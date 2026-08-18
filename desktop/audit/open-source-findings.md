# Hallazgos open source para la auditoría de Bellentani

**Fecha:** 2026-08-18

## Cline

Fuente primaria: https://github.com/cline/cline

Cline documenta un agente open source con interfaz de IDE y terminal, modo Plan/Act, aprobación humana por acción, edición con diff y checkpoints, ejecución de comandos, reglas de proyecto, múltiples proveedores, MCP, SDK, CLI headless, equipos multiagente y automatizaciones programadas. Esto establece el nivel de referencia para agente persistente, revisión de cambios, herramientas y automatización.

## OpenHands

Fuente primaria: https://github.com/All-Hands-AI/OpenHands

OpenHands documenta un centro de control autoalojado para agentes y automatizaciones, con backends locales, remotos y en contenedores, servidor de agentes, UI persistente y conexión a múltiples backends. También advierte que un agente instalado directamente en el equipo tiene acceso completo al sistema de archivos, lo que refuerza la necesidad de sandbox y permisos explícitos en Bellentani.

## Aider

Fuente primaria: https://github.com/Aider-AI/aider

Aider documenta un agente orientado a terminal y Git que crea mapas del código, edita múltiples archivos, realiza commits automáticos, permite diff/undo, ejecuta lint y pruebas y acepta proveedores locales o remotos. Es una referencia para contexto de repositorio, edición multiarchivo y recuperación.

## Theia

Fuente primaria: https://theia-ide.org/

Theia documenta un IDE de escritorio y nube, modular, vendor-neutral, compatible con el ecosistema de extensiones VS Code/Open VSX, con Monaco, LSP, pestañas, workbench y agentes personalizables. Es la referencia para el frontend y la extensibilidad que todavía debe superar Bellentani.

## Conclusión de fase

Bellentani 0.4.0 dispone de Monaco, agente configurable, snapshots, rollback, CLI, PowerShell, Git, PVC-U y extensiones locales, pero aún está por debajo del nivel de referencia en LSP, depuración completa, marketplace/extensiones reales, sandbox de procesos, multiagente y automatizaciones persistentes. Estas áreas deben recibir implementación y pruebas antes de afirmar 10/10.

## Protocolos de interoperabilidad

Fuentes primarias: [LSP](https://microsoft.github.io/language-server-protocol/), [DAP](https://microsoft.github.io/debug-adapter-protocol/), [MCP](https://modelcontextprotocol.io/specification/2025-06-18).

LSP define un protocolo estándar para que editores y servidores de lenguaje intercambien capacidades como diagnósticos, navegación y completado. DAP define el protocolo abstracto entre un IDE y un depurador/runtime. MCP define un protocolo abierto para conectar aplicaciones LLM con fuentes de datos y herramientas externas. Bellentani todavía no implementa clientes completos de estos tres protocolos; por tanto, no puede recibir 10/10 de backend o frontend bajo una rúbrica estricta de paridad funcional.
