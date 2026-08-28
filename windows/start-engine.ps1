param(
  [ValidateSet('api','cli')]
  [string]$Mode = 'api',
  [string]$Mission = ''
)
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$Engine = Join-Path $Root 'engine'
$Data = Join-Path $env:LOCALAPPDATA 'Bellentani\data'
New-Item -ItemType Directory -Force -Path $Data, (Join-Path $Data 'artifacts'), (Join-Path $Data 'cache') | Out-Null
$env:BELLENTANI_DB = Join-Path $Data 'bellentani.db'
$env:BELLENTANI_ARTIFACTS = Join-Path $Data 'artifacts'
$env:BELLENTANI_WORKERS = if ($env:BELLENTANI_WORKERS) { $env:BELLENTANI_WORKERS } else { '3' }
$env:PYTHONPATH = $Root

$python = Get-Command py -ErrorAction SilentlyContinue
if (-not $python) { $python = Get-Command python -ErrorAction SilentlyContinue }
if (-not $python) { throw 'Python 3.11+ no está instalado. Instala Python desde https://www.python.org/downloads/windows/ y vuelve a ejecutar.' }

if ($Mode -eq 'api') {
  & $python.Source -m uvicorn engine.api.server:app --host 127.0.0.1 --port 8080
} else {
  if ([string]::IsNullOrWhiteSpace($Mission)) { throw 'Uso: start-engine.ps1 -Mode cli -Mission "Analiza https://example.com"' }
  & $python.Source (Join-Path $Root 'manos') mission run $Mission --natural
}
