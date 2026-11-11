# Qué significa finalizar una plataforma

Definición operativa del ecosistema, 11 de noviembre de 2026.
No existe una cantidad de HTML que convierta por sí sola un repositorio en un
producto terminado. Una plataforma está completa para una versión cuando entrega
los recorridos y resultados prometidos a su público, dentro de un alcance explícito,
y se puede instalar, probar, operar y recuperar de forma reproducible.

## Contrato de finalización por versión

| Área | Criterio de aceptación | Evidencia requerida |
|---|---|---|
| Propósito | Público, problema y resultado definidos en la ficha original | Requisito con identificador y caso de uso |
| Alcance | Cada módulo prometido tiene una implementación y un límite explícito | Matriz requisito → código → prueba |
| Recorridos | Un usuario completa la tarea principal de inicio a resultado | Prueba funcional del recorrido, también en móvil |
| Interfaz | Navegación, formularios, búsqueda y acciones tienen efecto real | Pruebas de interacción y rutas sin destinos vacíos |
| Estados | Carga, vacío, éxito, error y recuperación tienen comportamiento útil | Casos positivos y negativos |
| Datos | Lectura/escritura, validación, persistencia, importación y exportación funcionan según el producto | Round-trip, aislamiento y recuperación cuando correspondan |
| Identidad | Autenticación y autorización protegen cada recurso que las necesita | Pruebas de acceso permitido y denegado; no añadir login a una utilidad local que no lo requiera |
| Accesibilidad | Objetivo WCAG 2.2 AA, teclado, foco, contraste y movimiento reducido | Comprobación automatizada y revisión manual; no afirmar conformidad sin completar ambas |
| Seguridad | Controles aplicables de ASVS, gestión de secretos y dependencias | Revisión de amenazas, pruebas negativas y escaneo sin secretos nuevos |
| Rendimiento | Presupuesto acordado y carga de contenido real | Mediciones reproducibles en condiciones declaradas |
| Contenido | Textos, imágenes, datos y traducciones reales, con derechos y procedencia | Inventario de fuentes; sin cifras, reseñas, contactos ni certificaciones inventadas |
| Distribución | Build limpio, rutas y recursos correctos en el destino real | Artefacto versionado, URL y comprobación HTTP/funcional |
| Operación | Configuración, logs, salud, respaldo y rollback adecuados al producto | Procedimiento probado; no exponer datos privados en logs |
| Mantenimiento | Dependencias y responsable de cada integración identificados | README de instalación, pruebas, límites y actualización |
| Entrega | No quedan defectos bloqueantes en el alcance de la versión | CI del commit publicado y aceptación del recorrido principal |

## Tipos de producto

- Un sitio informativo termina cuando su contenido, navegación y contacto real
  funcionan; no necesita una base de datos artificial.
- Una herramienta local termina cuando procesa entradas válidas, rechaza las
  inválidas y conserva/exporta resultados sin depender de un servicio imaginario.
- Una plataforma con servidor requiere también pruebas de API, persistencia,
  permisos, despliegue y recuperación.
- Un campus requiere contenido formativo real y el recorrido de aprendizaje,
  evaluación y progreso que su ficha prometa.
- Un archivo artístico conserva originales y procedencia. Un prototipo o una
  simulación se etiqueta como tal hasta completar sus requisitos.

## Estados válidos

**Verificado** significa ejecutado sobre un commit y entorno identificados.
**Implementado sin verificar** exige una prueba pendiente.
**Bloqueado** identifica un acceso, dato o decisión concreta que falta.
**No aplicable** necesita una razón basada en el producto.
La ausencia de un requisito nunca se convierte automáticamente en aprobado.

## Referencias

- W3C, [WCAG 2.2](https://www.w3.org/TR/WCAG22/): criterios verificables de accesibilidad y requisitos de conformidad.
- OWASP, [ASVS](https://asvs.owasp.org/): requisitos para diseñar, desarrollar y comprobar seguridad de aplicaciones y servicios.
- NIST, [SSDF 1.1, SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final): prácticas de desarrollo seguro integrables en el ciclo de vida.

Esta definición combina esas referencias con criterios de producto y operación;
no presenta los tres documentos como una certificación universal de plataforma.
