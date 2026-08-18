# Rúbrica 10/10 de Bellentani7

La publicación solo está autorizada cuando cada dimensión obtiene 10/10 mediante evidencia reproducible. La paridad no se evalúa por marketing, sino por capacidades ejecutables, pruebas y documentación.

| Dimensión | Criterios obligatorios para 10/10 |
|---|---|
| Backend | IPC aislado; validación de esquemas; permisos por workspace; persistencia segura; agente real; streaming/cancelación; herramientas MCP; sandbox OS-level; timeouts; auditoría; pruebas unitarias e integración Windows |
| Frontend | Monaco; pestañas/modelos; árbol y búsqueda; diff/merge; LSP; DAP; terminal; panel de agente; estados de error/carga; accesibilidad; extensiones; diseño coherente |
| Utilidad | Abrir/editar/guardar; Git; tareas; PowerShell; snapshots/rollback; agente multiarchivo; pruebas/lint; CLI; memoria; sesiones; exportación/diagnóstico |
| Relevancia | Resuelve el workspace de código persistente y el flujo agente-IDE; evidencia comparativa frente a Cline, OpenHands, Aider y Theia; documentación de casos de uso |
| Potencial | Arquitectura modular; proveedores locales/remotos; Open VSX/MCP; multiagente; automatización; APIs; empaquetado firmado; roadmap medible |
| Identidad | Marca Bellentani consistente; UX propia; nombre, appId, README, licencia y repo alineados; propuesta diferencial PVC-U y reversibilidad |

## Estado provisional tras la auditoría inicial

| Dimensión | Estado | Bloqueadores principales |
|---|---:|---|
| Backend | 7/10 | No hay sandbox OS-level, MCP runtime, streaming/cancelación ni integración Windows completa |
| Frontend | 8/10 | Monaco, pestañas y diff ya presentes; faltan LSP/DAP completos, merge visual y host de extensiones real |
| Utilidad | 8/10 | Flujo local sólido; faltan multiagente, pruebas automáticas del workspace real y automatización persistente |
| Relevancia | 9/10 | Encaja con el nicho; requiere casos de uso comparativos y operación nativa Windows |
| Potencial | 9/10 | Buena base modular; faltan adaptadores MCP/Open VSX y ciclo de distribución |
| Identidad | 10/10 | Marca y propuesta PVC-U diferenciadas |

**Regla:** no publicar mientras exista una puntuación menor que 10.
