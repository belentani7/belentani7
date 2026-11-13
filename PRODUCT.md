# PRODUCT.md — belentani7 (perfil · casa de productos)

## Qué es
La presencia pública de Pedro Belentani en GitHub presentada como una **casa de
productos de software**: cada repositorio que ha superado fabricación completa
(se aplicaron las reglas de desarrollo del ecosistema, CI verde, deploy vivo)
se exhibe como una vitrina verificada. El resto del inventario (115 repos
vivos) queda en el catálogo, no en el escaparate.

## Para quién
- Contratadores y clientes potenciales (ES/EN) que evalúan capacidad real.
- Otros constructores que buscan patrones de gobernanza y fabricación.
- El propio ecosistema, como índice vivo de lo que existe y está verde.

## El trabajo de la superficie
Que un visitante entienda en una pantalla: (1) esto es una casa de productos,
no una lista de repos; (2) cada vitrina está verificada (CI verde + deploy
vivo, comprobados el 2026-11-07); (3) hay una forma concreta de fabricar
(reglas 00-core, hygiene CI, gitleaks) y una auditoría que lo demuestra.
Acción primaria: entrar al catálogo; secundaria: contacto.

## Prueba que earn belief
- 13 vitrinas verificadas: pushed + deployed (HTTP 200) + CI success, con URL
  de deploy real y fecha de última run verde.
- Auditoría unificada 2026-11-02→07 (434→115 repos, 314 restaurables,
  conformidad 99.9%, gates 54/60 verdes) publicada como HTML offline.
- Reglas de fabricación del ecosistema aplicadas (00-core.mdc 71/115 en
  remoto, hygiene.yml 71/115, gitleaks 75/115 — cifras verificadas hoy).

## Restricciones duraderas
- 100% offline: sin CDNs, sin webfonts remotas, GSAP incrustado inline.
- Superficie: GitHub Pages (belentani7.github.io/belentani7), repo de perfil.
- Idioma: español en la superficie web; README y bio en inglés.
- Lectura humana: medida 65–75ch, cuerpo ≥17px, jerarquía evidente.

## Qué NO es
No es un panel de métricas de vanidad: el número de repos no se presume como
logro; se presenta la línea verificada y el método. No muestra repos de
clientes como propios ni reivindica deploys ajenos.
