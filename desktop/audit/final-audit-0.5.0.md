# Auditoría máxima de Bellentani 0.5.0 / belentani7

**Fecha:** 18 de agosto de 2026
**Decisión:** **No publicar todavía como 10/10**.

## Alcance

La auditoría cubrió el desktop Electron de Windows 11 y el frontend web existente en el repositorio `belentani7/belentani7`. Se verificaron dependencias con instalación limpia, auditoría completa de npm, tipos TypeScript, build Vite, build Electron portable, sintaxis de los módulos, pruebas PVC-U, rutas de workspace, snapshots, rollback, MCP, CLI y diff de Git.

La investigación comparó Bellentani con Cline, OpenHands, Aider, Theia, Monaco, LSP, DAP y MCP. Cline y Aider establecen referencias para agentes con edición multiarchivo, terminal, Git, diff y recuperación [1] [2]. OpenHands establece referencias para agentes persistentes y ejecución con backends aislados [3]. Theia establece referencias para workbench, LSP, DAP y extensiones VS Code/Open VSX [4]. LSP, DAP y MCP son protocolos abiertos de interoperabilidad que Bellentani debe implementar plenamente para afirmar paridad [5] [6] [7].

## Evidencia de pruebas

| Prueba | Resultado |
|---|---|
| `npm ci` desktop | PASS |
| `npm audit` desktop completo | 0 vulnerabilidades |
| `npm test` desktop | PASS |
| Doctor y auditoría CLI | PASS |
| PVC-U y cadena de evidencia | PASS |
| Rutas fuera del workspace | PASS |
| Snapshot, diff y rollback | PASS |
| MCP no aprobado | Revisión humana obligatoria |
| Sintaxis main/preload/pvcu/workspace/mcp | PASS |
| Sintaxis JavaScript de interfaz | PASS |
| `npm ci` frontend remoto | PASS |
| `npm audit` frontend remoto completo | 0 vulnerabilidades |
| `npm run check` frontend remoto | PASS |
| `npm run build` frontend remoto | PASS |
| `npm run build` Electron portable | PASS |
| `git diff --cached --check` | PASS |

## Puntuación estricta

| Dimensión | Puntuación | Razón de no alcanzar 10 |
|---|---:|---|
| Backend | **8/10** | El puente IPC, PVC-U, secretos, timeouts, límites de salida, snapshots, CLI y MCP están implementados; faltan sandbox OS-level, streaming/cancelación de proveedores, multiagente real y pruebas nativas Windows automatizadas. |
| Frontend | **9/10** | Monaco, pestañas/modelos, árbol, búsqueda, terminal, panel de agente, diff, tareas, extensiones locales y diagnósticos están presentes; faltan LSP completo, DAP visual completo, merge editor y host Open VSX real. |
| Utilidad | **9/10** | El flujo local de editar, revisar, aplicar, revertir, ejecutar, auditar y usar Git es funcional; faltan automatizaciones persistentes, worktrees multiagente y cobertura nativa completa de tareas/depuración. |
| Relevancia | **9/10** | El producto responde al nicho IDE/agente persistente y añade una diferenciación PVC-U; falta demostrar operación prolongada sobre proyectos reales en Windows. |
| Potencial | **9/10** | La arquitectura es modular y el monorepo conserva frontend web y desktop; faltan distribución firmada, actualizador, marketplace de extensiones, adaptadores LSP/DAP/MCP completos y colaboración. |
| Identidad | **10/10** | Marca Bellentani coherente, propuesta PVC-U diferenciada, UX propia, licencia y documentación alineadas. |

## Decisión de publicación

La condición del usuario exige **10/10 en las seis dimensiones**. Como backend, frontend, utilidad, relevancia y potencial siguen por debajo de 10 bajo una rúbrica comparable con las referencias open source, **no se debe publicar ni declarar el repositorio como versión final 10/10**. El repositorio remoto `belentani7/belentani7` ya existía y contiene una aplicación web; por seguridad, se preparó una rama local de integración con `desktop/`, pero no se sobrescribió ni se publicó el cambio.

## Próxima barrera objetiva

Para alcanzar 10/10 se requieren: sandbox de procesos con aislamiento OS-level y permisos por herramienta; cliente LSP con diagnósticos/completado/navegación; cliente DAP con breakpoints, variables, stack y controles; streaming y cancelación de proveedores; runtime MCP completo con handshake y transporte; worktrees y sesiones multiagente; host Open VSX; firma y actualización del instalador; y una matriz automatizada de pruebas nativas en Windows 11.

## Referencias

[1] [Cline — agente open source para IDE y terminal](https://github.com/cline/cline)
[2] [Aider — programación asistida en terminal con Git](https://github.com/Aider-AI/aider)
[3] [OpenHands — agentes de desarrollo y automatización](https://github.com/OpenHands/OpenHands)
[4] [Theia — IDE extensible de escritorio y nube](https://theia-ide.org/)
[5] [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
[6] [Debug Adapter Protocol](https://microsoft.github.io/debug-adapter-protocol/)
[7] [Model Context Protocol specification](https://modelcontextprotocol.io/specification/2025-06-18)
