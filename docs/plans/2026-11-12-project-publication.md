# Perfil y publicación de proyectos verificables

## Problema y aceptación
La sincronización posterior sustituyó la portada y el README ya verificados: siete pruebas de presentación fallan y se perdió el título Senior solicitado. Conservar las versiones sincronizadas como texto, recuperar la presentación validada y mantener Living Machine actualizado.

Secure-T y MUSIC OS tienen código validado pero sus sitios propios no están habilitados. El perfil es una puerta del ecosistema; su publicación puede ensamblar demostraciones desde commits públicos concretos sin duplicar sus fuentes en este repositorio.

## Diseño y ADR
Un manifiesto fija repositorio y commit. Checkout en CI descarga únicamente esas versiones; el ensamblador usa el constructor de lista blanca de Secure-T y el directorio estático site de MUSIC OS. Publica bajo docs/projects y no copia historiales, repositorios ni fuentes privadas. La página de índice explica qué se ejecuta y qué sigue siendo local.

## Validación
Pruebas de presentación del perfil, contratos del ensamblador, construcción real de ambos artefactos, recursos locales, doctor y Gitleaks. El despliegue usa los permisos existentes de Pages y se verifica al finalizar; no se añaden credenciales ni se presupone disponibilidad de los servicios de IA.

La publicación solicitada activa el build automático para los cambios del perfil en main. Se actualiza el contrato anterior de ejecución exclusivamente manual: se mantiene el guard de Pages preexistente y los PR nunca ejecutan deploy. No se activa Pages ni se añaden tokens automáticamente.

## Prueba de motor incompatible con el guard SSRF
El CI reveló una prueba antigua que esperaba completar un crawl de loopback, ahora prohibido por el guard existente. Se verifica el recorrido de misión con una respuesta HTTP controlada y se añade una comprobación explícita de que los destinos internos se rechazan antes de llamar a cualquier transporte. No se cambia el guard ni se añade una excepción de red en producción.

## Verificación pública y orden de publicación
El artefacto desplegado contenía las 497 páginas del campus, pero un despliegue nativo de la rama terminó seis segundos después y las rutas nuevas devolvieron 404. Se coordina la promoción: el workflow espera a que termine el publicador nativo del mismo commit y publica después el artefacto completo. No se intenta cambiar la configuración administrativa de Pages ni se amplían credenciales. Las pruebas cubren runs en cola, activos, completados y de otros commits.
