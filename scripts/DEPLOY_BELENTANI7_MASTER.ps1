<#
.SYNOPSIS
  BELENTANI7 — Verificación y publicación segura de README/HTML.
.DESCRIPTION
  Conserva los archivos existentes. Comprueba el repositorio real, ejecuta
  las pruebas disponibles y, con -Publish, abre una PR desde una rama nueva.
  No desarchiva repositorios ni realiza push directo a main.
.EXAMPLE
  ./scripts/DEPLOY_BELENTANI7_MASTER.ps1
.EXAMPLE
  ./scripts/DEPLOY_BELENTANI7_MASTER.ps1 -ReadmeSource ./nuevo-README.md -Publish
.EXAMPLE
  ./scripts/DEPLOY_BELENTANI7_MASTER.ps1 -HtmlSource ./nuevo-index.html -Publish
#>
[CmdletBinding()]
param(
    [string]$RepoPath = "",
    [string]$ReadmeSource = "",
    [string]$HtmlSource = "",
    [switch]$Publish
)
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Repo = "belentani7/belentani7"
$OriginalLocation = (Get-Location).Path

function Invoke-Checked {
    param([string]$Executable, [string[]]$Arguments)
    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw ("Error (" + $LASTEXITCODE + "): " + $Executable + " " + ($Arguments -join " "))
    }
}

function Resolve-Input {
    param([string]$InputPath)
    if ([string]::IsNullOrWhiteSpace($InputPath)) { return "" }
    $resolved = Resolve-Path -LiteralPath $InputPath -ErrorAction Stop
    if (-not (Test-Path -LiteralPath $resolved.Path -PathType Leaf)) {
        throw "No es un archivo: $InputPath"
    }
    return $resolved.Path
}

try {
    $ReadmeSource = Resolve-Input $ReadmeSource
    $HtmlSource = Resolve-Input $HtmlSource
    if (($ReadmeSource -or $HtmlSource) -and -not $Publish) {
        throw "Para aplicar archivos indica -Publish. Sin -Publish solo se audita."
    }
    if ($Publish -and -not ($ReadmeSource -or $HtmlSource)) {
        throw "Para publicar indica -ReadmeSource o -HtmlSource."
    }

    foreach ($cmd in @("gh", "git", "node", "npm")) {
        if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
            throw "Falta la herramienta requerida: $cmd"
        }
    }
    Invoke-Checked "gh" @("auth", "status")

    if ([string]::IsNullOrWhiteSpace($RepoPath)) {
        $RepoPath = Join-Path $HOME "workspace/belentani7"
    }
    if (-not (Test-Path -LiteralPath $RepoPath)) {
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $RepoPath) | Out-Null
        Invoke-Checked "gh" @("repo", "clone", $Repo, $RepoPath)
    }
    if (-not (Test-Path -LiteralPath (Join-Path $RepoPath ".git"))) {
        throw "El directorio no es un clon de Git: $RepoPath"
    }

    Set-Location -LiteralPath $RepoPath
    $remote = (& git remote get-url origin)
    if ($LASTEXITCODE -ne 0 -or $remote -notmatch '(?i)github\.com[:/]belentani7/belentani7(\.git)?$') {
        throw "El remoto origin no corresponde a $Repo. No se modifica."
    }

    $archive = (& gh repo view $Repo --json isArchived --jq ".isArchived")
    if ($LASTEXITCODE -ne 0) { throw "No se pudo comprobar el estado del repositorio." }
    if ($archive.Trim() -ne "false") {
        throw "Repositorio archivado o estado desconocido: $archive. No se desarchiva automáticamente."
    }

    $dirty = @(& git status --porcelain)
    if ($LASTEXITCODE -ne 0) { throw "No se pudo inspeccionar el estado de Git." }
    if ($dirty.Count -gt 0) {
        throw "Hay cambios locales sin guardar. Confírmalos o guárdalos antes de continuar."
    }

    Invoke-Checked "git" @("fetch", "origin", "main", "--prune")
    Invoke-Checked "git" @("switch", "main")
    Invoke-Checked "git" @("pull", "--ff-only", "origin", "main")

    if ($Publish) {
        $branch = "profile/safe-release-" + (Get-Date -Format "yyyyMMdd-HHmmss")
        Invoke-Checked "git" @("switch", "-c", $branch)
        if ($ReadmeSource) { Copy-Item -LiteralPath $ReadmeSource -Destination "README.md" -Force }
        if ($HtmlSource)   { Copy-Item -LiteralPath $HtmlSource -Destination "index.html" -Force }
    }

    foreach ($required in @("README.md", "index.html")) {
        if (-not (Test-Path -LiteralPath $required -PathType Leaf)) {
            throw "Falta el archivo requerido: $required"
        }
    }
    $html = Get-Content -LiteralPath "index.html" -Raw -Encoding UTF8
    foreach ($pattern in @('(?i)<!doctype\s+html', '(?i)<html\b', '(?i)<main\b', '(?i)<h1\b', '(?i)</html>')) {
        if ($html -notmatch $pattern) {
            throw "Falla comprobación básica HTML: $pattern"
        }
    }
    Write-Host "[OK] Comprobaciones básicas de estructura HTML (no equivalen a validación W3C)."

    if (Test-Path -LiteralPath "package.json") {
        Invoke-Checked "npm" @("test")
    } else {
        Write-Warning "No hay package.json; no se han ejecutado tests npm."
    }
    Invoke-Checked "git" @("diff", "--check")
    if (-not $Publish) {
        Write-Host "[OK] Auditoría finalizada. No se ha escrito nada en GitHub."
        return
    }

    $paths = @()
    if ($ReadmeSource) { $paths += "README.md" }
    if ($HtmlSource)   { $paths += "index.html" }
    & git add -- @paths
    if ($LASTEXITCODE -ne 0) { throw "Fallo al preparar archivos para commit." }
    & git diff --cached --quiet -- @paths
    $diffStatus = $LASTEXITCODE
    if ($diffStatus -eq 0) {
        Write-Host "[OK] Contenido idéntico. No se ha abierto PR."
        return
    }
    if ($diffStatus -ne 1) { throw "No se pudo verificar el diff preparado." }
    Invoke-Checked "git" @("commit", "-m", "docs(profile): verify and propose curated profile update")
    Invoke-Checked "git" @("push", "--set-upstream", "origin", $branch)
    Invoke-Checked "gh" @(
        "pr", "create", "--repo", $Repo, "--base", "main", "--head", $branch,
        "--title", "docs(profile): verified profile update",
        "--body", "Actualización acotada de README/HTML. Comprobación básica de HTML, npm test y git diff --check ejecutados. Revisión de CI y publicación definitiva pendientes de merge."
    )
    Write-Host "[OK] PR creada; main no se ha modificado. El despliegue definitivo depende del merge y del hosting."
}
finally {
    Set-Location -LiteralPath $OriginalLocation
}
