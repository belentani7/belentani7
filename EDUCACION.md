# Las cuatro instituciones educativas abiertas

No son cuatro webs de cursos. Son la misma tesis aplicada cuatro veces: **el conocimiento ya existe;
lo que falta es una ruta que una persona real pueda recorrer hoy, sin pagar y sin dar sus datos**.

Estado comprobado con `curl` y con la API el 2026-11-16.

| Institución | Qué enseña | Alcance | Entrada |
|---|---|---|---|
| **open-school** | Currículum abierto completo | 5.639 páginas HTML (lecciones, módulos, rutas) | https://belentani7.github.io/open-school/ — 200 |
| **ManosAbiertas** | Cursos, CV y recursos para migrantes en Barcelona | 832 páginas | https://manos-abiertas-rho.vercel.app |
| **aprende-brasil** | Alfabetización en portugués brasileño | 205 módulos × 5 etapas (alfabetización, informática, matemáticas, …) | sin demo pública: React estático que se sirve desde el repo |
| **secure-t** | Ciberseguridad, IA responsable y gobernanza | 28 páginas HTML, laboratorios y tests | sin demo pública: se sirve desde el repo |

## La carta

Lo que las cuatro comparten y lo que no:

| Regla | aprende-brasil | secure-t | open-school | ManosAbiertas |
|---|---|---|---|---|
| Sin matrícula | declarado | declarado (*anonymous enrolment*) | no declarado | no declarado |
| Sin datos personales | declarado (`localStorage`) | declarado | no declarado | no declarado |
| Sin publicidad | declarado | no declarado | no declarado | no declarado |
| Verificable por script | no | tests | `tools/verify_site.py` | no |
| Licencia | propia (`NOASSERTION`) | propia (`NOASSERTION`) | MIT | MIT |

Esa tabla es el trabajo pendiente real: **dos instituciones tienen la carta escrita y dos no**. Las
cuatro deberían poder decir las mismas cinco frases.

## Por qué van juntas

- **open-school** es el currículum general: cualquier tema, cualquier nivel.
- **aprende-brasil** es el caso de alfabetización: quien no tuvo escuela, en su idioma.
- **ManosAbiertas** es el caso local: Barcelona, migración, empleabilidad.
- **secure-t** es el caso profesional: quien ya trabaja y necesita criterio técnico.

Si se leen por separado son cuatro proyectos pequeños. Juntas son una institución con cuatro
facultades, y comparten la misma promesa: entrar sin pedir permiso a nadie.

## Lo que falta para que sean una institución de verdad

1. **Escrito igual en las cuatro**: la carta de cinco reglas, o se cumple o no se dice.
2. **Un índice único**: un solo enlace que liste las cuatro y diga por dónde empezar. Hoy es este
   fichero; debería estar también en la portada de cada repo.
3. **Demo para `aprende-brasil` y `secure-t`**: dos de las cuatro no se pueden recorrer sin clonar
   el repositorio, y una institución sin puerta abierta es un folleto.

Ninguna de las tres se resuelve con metadata: son ediciones de README, un deploy de Pages y un
enlace. Eso queda fuera de lo que este perfil puede arreglar por API.
