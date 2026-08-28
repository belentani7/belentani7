# Bellentani

Bellentani es un entorno de desarrollo y agente persistente que combina una aplicación web y un escritorio Windows 11.

## Componentes

- `client/`: interfaz web React.
- `server/`: servicios del frontend web.
- `desktop/`: aplicación Electron para Windows 11 con Monaco, PowerShell, Git, agente, memoria, snapshots, rollback, CLI, MCP y PVC-U.

## Web

```bash
npm ci
npm run check
npm run build
npm run dev
```

## Escritorio Windows 11

```powershell
cd desktop
npm ci
npm test
npm run build
```

El build de escritorio genera `desktop/dist/Bellentani-Setup-0.5.0.exe` como portable x64.

## Flujo seguro

El agente trabaja con contexto del workspace, muestra diffs antes de aplicar cambios y crea snapshots para rollback. Las operaciones de terminal, Git, tareas, depuración y MCP pasan por validación PVC-U. Las rutas se confinan al proyecto y las credenciales IA se mantienen separadas del estado ordinario.

## Licencia y seguridad

El proyecto usa MIT. Consulta `desktop/LICENSE`, `desktop/SECURITY.md` y `desktop/CONTRIBUTING.md`.
