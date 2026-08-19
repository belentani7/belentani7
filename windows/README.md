# Bellentani para Windows 11

## Artefactos

El instalador Electron se genera con `electron-builder` y se publica en `dist/`. El paquete incluye la consola visual, el código del Mission Engine, la CLI `manos` y los lanzadores PowerShell/CMD.

## Instalación del runtime del engine

El instalador de escritorio no puede redistribuir automáticamente un intérprete Python ni Chromium de Playwright desde este entorno Linux. Para usar el engine en Windows 11, instala Python 3.11 o superior, abre PowerShell y ejecuta:

```powershell
cd "$env:LOCALAPPDATA\Programs\Bellentani\resources\app"
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r engine\requirements.txt
.\.venv\Scripts\python.exe -m playwright install chromium
```

Si Python ya está instalado globalmente, el launcher utiliza `py` o `python` automáticamente. Los datos persistentes se guardan en `%LOCALAPPDATA%\Bellentani\data`.

## Arranque de la API

Ejecuta `start-engine.cmd` o:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\start-engine.ps1 -Mode api
```

La API estará disponible en `http://127.0.0.1:8080/docs`.

## Ejecución de una misión

```powershell
.\start-engine.cmd -Mode cli -Mission "Analiza https://example.com y extrae SEO"
```

## Compilación desde Windows

```powershell
npm ci
npm run build:win
```

El script usa `electron-builder` y genera NSIS y portable para Windows x64. Para una distribución firmada, configura un certificado Authenticode; los binarios actuales no están firmados.

## Limitaciones verificadas

La compilación del EXE no puede validarse ejecutándolo dentro del sandbox Linux. Los EXE históricos de `dist/` son binarios PE/NSIS existentes, pero el instalador de esta configuración debe recompilarse después de sincronizar estos cambios. La ejecución final debe probarse en una máquina Windows 11 real.
