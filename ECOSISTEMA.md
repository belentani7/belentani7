# Ecosistema — qué proyectos solo tienen sentido conectados

Algunos repositorios de esta cuenta no se explican solos. Un router sin registro no enruta a nada;
un portal 3D sin la obra detrás es una demo; tres webs del mismo universo compiten por el mismo
clic. Este fichero dice qué va con qué y cuál es la puerta de entrada de cada grupo.

Enlaces comprobados con `curl` el 2026-11-16. Los marcados *privado* no tienen URL pública.

## 1. Universo del artista

| Pieza | Rol | Enlace |
|---|---|---|
| `belentani.es` | Puerta principal: galaxia, catálogo musical, lore | https://belentani.es |
| `omega-web` | La versión estática de Omega | https://belentani7.github.io/omega-web/ |
| `belentani-omega-immersive-portal` | La versión experiencial: se entra en un espacio | https://belentani-omega-immersive-portal.vercel.app |
| `belentani-studio-motion` | Componentes cinéticos del mismo mundo *privado* | — |
| `belentani-visual-engine` | Escenas Three.js desde el lore *privado* | — |
| `hbo-noir-icons` | Sistema visual del universo | repo |
| `premium-effects-registry` | Registro de efectos que consumen las otras piezas | repo |
| `kepler` | Estudio WebGL medido: 200.000 partículas | https://belentani7.github.io/kepler/ |

**Por qué van juntos:** el README de este perfil ya declara que Studio Motion y Visual Engine son
«two complementary tools» del mismo mundo. Los demás son entradas distintas a ese mundo: quien
llega por el portal 3D y quien llega por Omega estática ven la misma obra, no dos proyectos.

**Riesgo:** tres puertas públicas al mismo universo. Si no dicen a qué universo pertenecen, parecen
tres proyectos a medias en vez de uno grande.

## 2. Canon Judas

| Pieza | Rol | Enlace |
|---|---|---|
| `belentani-judas-web` | Interfaz y sistema narrativo de la era | https://belentani7.github.io/belentani-judas-web/ |
| `judas-experience-unificado` | La obra reunida en una sola experiencia | repo |
| `BELENTANI-JUDAS-ERA-FULLSTACK` | **Marcador de posición**, no proyecto | https://belentani7.github.io/BELENTANI-JUDAS-ERA-FULLSTACK/ |
| `belentani.es` | El canon editorial en cuatro capítulos | https://belentani.es |

**Por qué van juntos:** `judas-experience-unificado` unifica; `belentani-judas-web` es la cara;
el «FULLSTACK» es una portada de 564 bytes que declara la obra y no la implementa.

**Decisión pendiente:** el marcador de posición debería apuntar a la experiencia unificada o
desaparecer. Hoy ocupa el nombre más ambicioso del grupo con el contenido más pequeño.

## 3. Agentes y skills

| Pieza | Rol | Depende de |
|---|---|---|
| `meta-skill` | Router: decide qué skill y qué modelo | necesita skills que enrutar |
| `skills-registry` | Registro de skills | hoy indexa **una** |
| `mimo_patch` | Router de Sistema 1 en un archivo | decide antes de llamar al LLM |
| `belentani-forge` | Generador de proyectos | sabe crear `mcp-server`, `fastapi`, `next` |
| `agent-linux` | Entorno con MCP para agentes | usa las skills anteriores |

**Por qué van juntos y por qué hoy no funcionan:** este es el caso más claro de tu frase. `meta-skill`
es un router sin catálogo donde elegir, y `skills-registry` es un catálogo con una sola entrada. Cada
uno por separado es correcto y ninguno sirve para lo que promete. El router necesita el registro lleno;
el registro necesita que alguien lo consulte.

**Arreglo real:** mover las 23 skills que ya existen repartidas por otros repos a
`skills-registry/skills/<nombre>/SKILL.md`, con el `source` verificado, y que `meta-skill` lea ese
índice en vez de su `index.json` local.

## 4. Educación abierta

| Pieza | Rol | Enlace |
|---|---|---|
| `open-school` | 5.639 páginas de currículum abierto | https://belentani7.github.io/open-school/ |
| `aprende-brasil` | 205 módulos de alfabetización en portugués | repo (sin demo) |
| `ManosAbiertas` | El caso de Barcelona: cursos y CV para migrantes | repo |
| `secure-t` | Formación en ciberseguridad y gobernanza de IA | repo |

**Por qué van juntos:** comparten la misma tesis (conocimiento que ya existe, convertido en una ruta
que alguien puede recorrer hoy, sin pagar y sin dar datos). Por separado parecen cuatro webs
educativas sueltas; juntos son un currículum con un caso local.

## 5. Barcelona comunitaria

| Pieza | Rol | Enlace |
|---|---|---|
| `Cruzando-el-charco` | 72 recursos para personas LGTBIQ+ migrantes, 11 idiomas, sin JS | https://belentani7.github.io/Cruzando-el-charco/ |
| `trama-trans-bcn` | Apoyo oficial a personas trans, con salida rápida | repo |

**Por qué van juntos:** mismo público, misma ciudad, misma regla de privacidad (sin cookies, sin
formularios, sin analítica). `Cruzando-el-charco` es el directorio general; `trama-trans-bcn` es el
caso concreto con memoria y protocolo de verificación.

## 6. Herramientas de inspección

| Pieza | Rol |
|---|---|
| `profile-lint` | Audita READMEs de perfil: enlaces muertos, alt text, promesas |
| `safe-exec` | Evalúa los bytes de un script antes de ejecutarlo |
| `neural-git-tui` | Explora el historial de Git como red neuronal |
| `keyrotor` | Rotación de claves desde la CLI |

**Por qué van juntos:** las cuatro parten de lo mismo — desconfiar de lo que no se ha comprobado —
aplicado a cuatro superficies distintas: un README, un script, un historial y una credencial.

## Regla de este mapa

Un enlace entra aquí solo si responde 200 en el momento de escribirlo. Si un proyecto no tiene
puerta de entrada pública, se dice; no se inventa una URL.
