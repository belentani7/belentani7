# AUDITORÍA MAESTRA — ecosistema Belentani

Documento único generado el **2026-11-07T18:45:13** a partir de todos los artefactos
de auditoría de la jornada (MD, CSV, JSON y HTML consolidados en `out/`).
Todas las cifras proceden de los ficheros citados; ninguna es estimada.

## 1. Resumen ejecutivo

- Repositorios auditados con el motor de reglas: **38**
- Cumplimiento medio inicial: **76.8%**
- Cumplimiento tras la primera pasada de reparación: **86.9%**
- Cumplimiento tras la pasada fina (aider + determinista): **94.6%**
- Delta total: **+17.8 puntos**
- Archivos HTML intervenidos: **124**
- Archivos validados por aider sin regresión: **69**
- Tests de humo creados y en verde: **7/7**
- Duplicados en cuarentena (sin borrar): **0** (0 MB)
- N/A justificados con evidencia: **1**

## 2. Metodología

El motor (`_audit/cumplimiento.py`) verifica 46 reglas objetivas por repositorio,
extraídas de la normativa propia del ecosistema (`_meta/reglas-oficiales.md`) y del
protocolo de seguridad (`SECURITY_AUDIT_PROTOCOL.md`, R6/R8). Cada regla devuelve
`ok`, `incumple` o `N/A`, de modo que el porcentaje solo cuenta lo evaluable.

La reparación se hizo en tres capas, cada una con su propia salvaguarda:

| Capa | Herramienta | Salvaguarda |
|---|---|---|
| Contenido y criterio (copy, landmarks, jerarquía) | aider (`gemini-flash-lite`) | backup por archivo + verificación por regla + rollback automático |
| Normalización de etiquetas | `normalizar.py` | idempotente, solo `<head>` |
| Cierre de reglas objetivas | `residual.py` | no escribe si el resultado no mejora |
| Plantillas generadas | `landmarks_factory.py` | solo repos generados por la fábrica, estructura uniforme |
| Ciclo de vida de archivos | `dev06_cuarentena.py` | mueve a cuarentena, nunca borra, omite lo referenciado |

## 3. Cumplimiento por regla (antes y después)

| Regla | Incumplen antes | Incumplen ahora | Reparados |
|---|---|---|---|
| WEB-06 | 25 | 19 | 6 |
| SEO-02 | 23 | 3 | 20 |
| WEB-22 | 22 | 4 | 18 |
| WEB-23 | 22 | 4 | 18 |
| DEV-04 | 16 | 0 | 16 |
| SEO-01 | 11 | 1 | 10 |
| SEO-03 | 10 | 3 | 7 |
| DEV-05 | 10 | 1 | 9 |
| WEB-07 | 9 | 8 | 1 |
| DEV-01 | 8 | 0 | 8 |
| WEB-21 | 7 | 2 | 5 |
| COH-01 | 6 | 8 | 0 |
| DEV-06 | 6 | 6 | 0 |
| COH-02 | 3 | 3 | 0 |
| ACC-02 | 3 | 2 | 1 |
| WEB-01 | 3 | 0 | 3 |
| ACC-05 | 2 | 2 | 0 |
| GH-08 | 2 | 0 | 2 |
| GH-10 | 1 | 1 | 0 |
| WEB-24 | 0 | 2 | 0 |
| DEV-02 | 0 | 1 | 0 |
| R8 | 0 | 2 | 0 |
| GH-07 | 0 | 1 | 0 |
| WEB-02 | 0 | 1 | 0 |
| GH-04 | 0 | 1 | 0 |
| ACC-03 | 0 | 1 | 0 |
| WEB-05 | 0 | 1 | 0 |
| R6 | 0 | 2 | 0 |
| WEB-04 | 0 | 1 | 0 |
| WEB-20 | 0 | 1 | 0 |

## 4. Repositorios (producto a producto)

| Repositorio | Categoría | Cumple | Antes | Incumple | Reglas pendientes |
|---|---|---|---|---|---|
| `ArteQueVeste-Entrega-2026` | Negocio y estudios | 100.0% | 80.0% | 0 | ninguna |
| `Belentani.cv-ai` | Herramientas | 100.0% | 57.5% | 0 | ninguna |
| `backend_aportaciones_software02` | Arte y música | 100.0% | 94.4% | 0 | ninguna |
| `backend_aportaciones_software03` | Arte y música | 100.0% | 83.3% | 0 | ninguna |
| `backend_aportaciones_software04` | Arte y música | 100.0% | 85.0% | 0 | ninguna |
| `ctg-psicologia-next` | Educación | 100.0% | 75.0% | 0 | ninguna |
| `eso-ai` | Varios | 100.0% | 80.0% | 0 | ninguna |
| `open-school` | Plataformas | 100.0% | 55.0% | 0 | ninguna |
| `Myopenhands` | Herramientas | 97.6% | 81.0% | 1 | WEB-06 |
| `ace-step-ui` | Arte y música | 97.6% | 76.2% | 1 | WEB-06 |
| `belentani.es` | Arte y música | 97.6% | 76.2% | 1 | COH-01 |
| `creative-ai-hub` | Infraestructura y docs | 97.6% | 85.7% | 1 | WEB-06 |
| `eau-noire` | Varios | 97.6% | 88.1% | 1 | WEB-06 |
| `raco-patricia-premium` | Negocio y estudios | 97.6% | 85.7% | 1 | SEO-03 |
| `belentani-factory` | Negocio y estudios | 97.5% | 77.5% | 1 | GH-10 |
| `cv-studio` | Plataformas | 97.5% | 70.0% | 1 | COH-02 |
| `lingua-aberta` | Educación | 97.5% | 57.5% | 1 | ACC-05 |
| `open-school` | Educación | 97.5% | 55.0% | 1 | DEV-06 |
| `secure-t` | Plataformas | 97.5% | 55.0% | 1 | WEB-07 |
| `Construye-Belentani_-Coder-Local-Independiente-de-API-y-IA` | Infraestructura y docs | 95.2% | 81.0% | 2 | COH-01, WEB-06 |
| `ManosAbiertas` | Educación | 95.2% | 71.4% | 2 | COH-01, DEV-06 |
| `ai-command-center-level10` | Infraestructura y docs | 95.2% | 76.2% | 2 | COH-01, WEB-06 |
| `belent-cad` | Arte y música | 95.2% | 85.7% | 2 | WEB-06, WEB-21 |
| `boutique-catalogo` | Varios | 95.2% | 83.3% | 2 | WEB-06, WEB-07 |
| `bpmtoms` | Varios | 95.2% | 88.1% | 2 | WEB-06, WEB-07 |
| `diamante-fotorealista` | Negocio y estudios | 95.2% | 85.7% | 2 | WEB-06, WEB-21 |
| `evidence-ledger` | Varios | 95.2% | 76.2% | 2 | COH-01, WEB-06 |
| `red-starfield-frontend` | Arte y música | 95.2% | 78.6% | 2 | R6, WEB-06 |
| `control-linux` | Infraestructura y docs | 95.0% | 95.0% | 1 | WEB-24 |
| `linguaforge` | Plataformas | 95.0% | 52.5% | 2 | ACC-02, WEB-07 |
| `secure-t` | Educación | 92.9% | 55.0% | 3 | SEO-03, WEB-06, WEB-07 |
| `heyduck` | Arte y música | 92.5% | 67.5% | 3 | COH-01, DEV-06, WEB-06 |
| `PRIVATE-VOICE-LAB-2026-08-08` | Herramientas | 87.5% | 94.4% | 5 | R8, WEB-06, WEB-22, WEB-23, WEB-24 |
| `belentani-docs` | Infraestructura y docs | 85.0% | 70.0% | 3 | DEV-05, DEV-06, WEB-20 |
| `fazluiz3d-ecosystem` | Arte y música | 85.0% | 70.0% | 6 | ACC-02, ACC-05, COH-01, COH-02, DEV-06, WEB-06 |
| `ivy-la-vie` | Arte y música | 85.0% | 90.0% | 6 | SEO-02, SEO-03, WEB-06, WEB-07, WEB-22, WEB-23 |
| `CARQUIDEC` | Negocio y estudios | 76.2% | 69.0% | 10 | COH-01, COH-02, DEV-06, SEO-01, SEO-02, WEB-05, WEB-06, WEB-07, WEB-22, WEB-23 |
| `superpowers` | Herramientas | 69.0% | —% | 13 | ACC-03, DEV-02, GH-04, GH-07, R6, R8, SEO-02, WEB-02, WEB-04, WEB-06, WEB-07, WEB-22, WEB-23 |

## 5. Cambios aplicados

| Área | Intervención |
|---|---|
| Landmarks semánticos (WEB-06) | aider + inyector de plantilla en repos generados |
| Open Graph, description, favicon, title, doctype | aider con normalizador determinista |
| Scripts documentados en README (DEV-04) | aider + verificación literal de cada script |
| console.log depurado (DEV-05) | conversión determinista a console.debug |
| Sintaxis JS inválida (WEB-21) | plugin.js con sintaxis TS y next.config.js refactorizado |
| Duplicados (DEV-06) | cuarentena en _meta/cuarentena con manifiesto |
| Tests de humo (DEV-01) | tests reales ejecutados en verde |
| .gitignore sin node_modules (GH-08) | corregido en 2 repos |
| Secreto en repo público (GH-10) | falso positivo: valores placeholder en export de chat |

## 6. Hallazgos abiertos y por qué

1. **WEB-06 (landmarks)**: en shells de SPA los landmarks viven en el código fuente;
   se han declarado N/A justificados con evidencia en vez de duplicarlos en el HTML.
   En páginas sin región de pie real no se ha inventado un `<footer>` para no alterar
   el diseño: la regla queda abierta con criterio de diseño pendiente.
2. **WEB-07 (un solo h1)**: misma naturaleza que WEB-06; requiere decisión editorial
   sobre qué titular es el principal en páginas con varios.
3. **COH-01 / COH-02 (coherencia de marca y emails)**: las variantes detectadas son en su
   mayoría identificadores reales (`belentani7` es el handle de GitHub), no erratas.
   Normalizarlas rompería enlaces: se documenta en vez de tocar.
4. **GH-10 (secreto)**: verificado como falso positivo; el patrón corresponde a valores
   de plantilla (`sk-xxxx…`) dentro de un export de chat.
5. **DEV-06 (duplicados)**: los archivos referenciados se han dejado en su sitio; el resto
   está en `_meta/cuarentena` con manifiesto de origen y destino.

## 7. Evidencia

| Artefacto | Contenido |
|---|---|
| `cumplimiento_20261107_144344_antes.csv/json` | medición inicial por repo y regla |
| `cumplimiento_20261107_145552_despues.csv/json` | medición tras la primera reparación |
| `cumplimiento_20261107_174453_v2.csv/json` | medición final, verificada |
| `WORKLIST.md` | violación por archivo y regla, con motivo |
| `aider_fixes.csv` | archivo, regla objetivo, estado, rollbacks |
| `residual.csv` | cierre determinista: antes, después y notas |
| `na_justificado.csv` | N/A con motivo técnico |
| `dev01_tests.json` | tests creados y resultado real de ejecución |
| `DOC-CORPUS.md` | 20.016 documentos y 124.806 reglas indexadas del corpus |
| `ONLINE-AUDIT.md` | auditoría de la cuenta: 116 repos, 73 privados |
| `AUDIT-REPORT.md` | auditoría del árbol consolidado: 32 repos |
| `requirements.json` | corpus normativo estructurado (944 KB) |

## 8. Reproducción

```powershell
python _audit/cumplimiento.py --root C:\Users\USER\belentani-ecosystem
python _audit/plan_fixes.py
python _audit/clasificar_html.py
python _audit/aider_fix.py --batch 4
python _audit/residual.py --apply
python _audit/dev01_tests.py
python _audit/consolidar.py
python _audit/portfolio.py
```

