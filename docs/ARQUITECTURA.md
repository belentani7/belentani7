

<!-- repo-forge:docs-arquitectura:inicio -->
# Arquitectura

## Tipo

sitio estático publicable tal cual

## Piezas observadas

| Pieza | Evidencia |
|---|---|
| Lenguajes | JSON 46.1%, HTML 16.6%, JavaScript 10.1%, Markdown 9.6%, TypeScript 7.4%, Python 4.0% |
| Puntos de entrada | engine/cli.py |
| Páginas HTML | 17 |
| Tests | 20 archivos |
| Dependencias de paquete | 2 |

## Capas propuestas

```text
contenido/      datos y textos versionados
plataforma/     ficha, diseño y contrato del producto
brand/          tokens, marca y activos
scripts/        verificación y operación
tests/          pruebas ejecutables
```

La propuesta no mueve archivos existentes: describe dónde debe vivir lo nuevo para que
el repositorio siga siendo legible.

## Deuda declarada

- 6 lenguajes: coste de contexto alto.

<!-- repo-forge:arquitectura -->
<!-- repo-forge:docs-arquitectura:fin -->
