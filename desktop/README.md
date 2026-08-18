# Bellentani

Bellentani es un IDE y agente persistente de código para Windows 11. Combina un editor Monaco, explorador de proyectos, terminal PowerShell, Git, tareas, memoria local, proveedor de IA configurable, cambios revisables y controles PVC-U en una aplicación Electron.

## Uso

Ejecuta el portable generado en `dist/Bellentani-Setup-0.5.0.exe`, abre una carpeta de proyecto y trabaja desde la misma ventana. En Windows 11 la terminal usa PowerShell nativo. El agente solo modifica archivos después de mostrar el diff y solicitar confirmación; cada aplicación crea un snapshot para rollback.

## Capacidades

El editor ofrece pestañas y modelos Monaco por archivo, búsqueda global, guardado y diagnósticos básicos para JavaScript y JSON. El agente recibe contexto del workspace, puede usar un proveedor OpenAI-compatible y puede proponer archivos en formato estructurado para revisión, aplicación y recuperación. Git, tareas de `package.json`, snapshots, diff, rollback, depuración Node, extensiones locales y servidores MCP pasan por validación PVC-U y límites del workspace.

Las extensiones locales se descubren desde `.bellentani/extensions/*.json`. Los servidores MCP se configuran en `.bellentani/mcp.json` y requieren aprobación explícita antes de invocarse.

## Desarrollo

```powershell
npm ci
npm test
npm run build
```

El build genera `dist/Bellentani-Setup-0.5.0.exe` como portable x64. La CLI comparte el núcleo del escritorio:

```powershell
node bellentani-cli.js doctor
node bellentani-cli.js audit
node bellentani-cli.js context C:\ruta\proyecto
node bellentani-cli.js snapshot C:\ruta\proyecto
node bellentani-cli.js diff C:\ruta\proyecto src\app.js propuesta.txt
node bellentani-cli.js rollback C:\ruta\proyecto ID_DEL_SNAPSHOT
```

## Seguridad

El renderer no tiene acceso directo a Node.js. El proceso principal valida rutas contra el workspace, limita tiempo y salida de procesos, bloquea patrones destructivos conocidos, registra decisiones PVC-U y separa las credenciales IA del estado ordinario usando `safeStorage` cuando está disponible. La revisión humana es obligatoria para solicitudes, herramientas y servidores MCP de riesgo elevado.

## Arquitectura

`src/main.js` gestiona ventanas, IPC, procesos y persistencia. `src/preload.js` expone únicamente la API permitida. `src/workspace.js` implementa rutas, snapshots, diff, aplicación y rollback. `src/mcp.js` controla servidores MCP. `src/pvcu.js` aplica políticas y evidencia. `src/index.html` contiene la interfaz del IDE.

## Licencia

Bellentani se distribuye bajo MIT. Consulta `SECURITY.md` para reportar vulnerabilidades y `CONTRIBUTING.md` para cambios de código.
