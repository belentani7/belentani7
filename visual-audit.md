# Visual audit — 2026-08-16

La portada renderiza con fondo carbón, textura de grano discreta, un acento rojo óxido controlado, tipografía Space Grotesk para display y IBM Plex Mono para metadatos. La composición asimétrica del hero funciona: título dominante a la izquierda, ficha de Judas a la derecha, navegación compacta y enlaces con jerarquía clara. El CTA `Try AI studio` llega a `/studio` y la ruta comparte el mismo shell.

Studio carga correctamente y muestra un flujo de tres pasos (`Signal / Structure / Revision`), un campo de texto y persistencia local. El formulario no promete generación real ni finge una integración de IA. Los overlays verdes/azules de la captura son marcadores del inspector del navegador, no parte de la interfaz.

Pendiente de validación: probar Portal con persistencia local, revisar una página narrativa y ejecutar la comprobación final del proyecto.

Portal renderiza con el mismo sistema visual y la interacción funciona: al seleccionar B, la tarjeta cambia a rojo óxido, aparece ✓, la respuesta cambia a “No estás solo en tu traición.” y se registra `Local path registered: B`. La barra inferior del navegador en la captura es el aviso de preview, no forma parte del sitio.
