# Bellentani 0.5.0

Bellentani es un IDE y agente de código persistente para Windows 11 construido como aplicación Electron con interfaz HTML/CSS/JavaScript, terminal PowerShell y un núcleo local auditable. Su arquitectura separa el proceso principal, el puente seguro y la interfaz, y mantiene la selección de proyectos, memoria, sesiones y snapshots en el equipo.

## Capacidades

La aplicación incluye editor Monaco, explorador de proyectos, búsqueda de archivos, pestaña activa, guardado, terminal PowerShell nativa en Windows, tareas de `package.json`, Git controlado, memoria persistente, proveedor IA OpenAI-compatible configurable y contexto de proyecto para el agente.

El agente puede generar planes, consultar contexto, proponer cambios y trabajar con un flujo reversible. El panel **Snapshot** crea una copia de seguridad; **Aplicar cambios** muestra un diff, exige confirmación y registra un snapshot de rollback; y la operación de recuperación puede usarse desde el núcleo o la CLI. El botón **Depurar** ejecuta una sesión Node con inspector y la somete a PVC-U antes de iniciar el proceso.

Las extensiones integradas cubren PVC-U, Git, PowerShell y el agente. Además, Bellentani descubre manifiestos JSON en `.bellentani/extensions` dentro del workspace. La CLI permite diagnóstico, auditoría, contexto, snapshot, diff y rollback.

## PVC-U

PVC-U valida entradas, secretos, prompt injection, operaciones de herramientas, tareas, Git, cambios del workspace, intención de agentes y ciclo de vida de modelos. Registra evidencia con hash encadenado, perfiles de riesgo, perfiles universales por dominio, `Validation Envelope`, auto-validación y revisión humana proporcional.

## Uso en Windows 11

Ejecuta `Bellentani-Setup-0.5.0.exe`, abre una carpeta y selecciona un proyecto. PowerShell se ejecuta nativamente en Windows 11. En el sandbox Linux se utiliza un modo compatible/simulado para la terminal.

## Desarrollo

```powershell
npm install
npm test
npm run dev
npm run build
```

El empaquetado genera `dist/Bellentani-Setup-0.5.0.exe` como distribución portable x64.

## CLI

```powershell
node bellentani-cli.js doctor
node bellentani-cli.js audit
node bellentani-cli.js context C:\ruta\proyecto
node bellentani-cli.js snapshot C:\ruta\proyecto
node bellentani-cli.js rollback C:\ruta\proyecto ID_DEL_SNAPSHOT
node bellentani-cli.js diff C:\ruta\proyecto src\app.js propuesta.txt
```

## Seguridad

El renderer no tiene acceso directo a Node.js. Las rutas se confinan al workspace, las operaciones de herramientas pasan por PVC-U, los patrones destructivos conocidos se bloquean, y las claves del proveedor IA no se guardan en el JSON de estado: se almacenan mediante `safeStorage` de Electron cuando el sistema lo permite.

## Estado y límites

Esta versión es una entrega funcional integrada, no una reimplementación industrial completa de VS Code, Cursor, Codex y OpenClaw. El depurador es básico, no sustituye un backend LSP completo, las extensiones locales son manifiestos y no un marketplace, y la ejecución aislada de procesos depende de la política local de Windows. La documentación distingue estas capacidades para evitar presentar como terminado lo que aún requiere una validación nativa y un ciclo de producción adicional.
