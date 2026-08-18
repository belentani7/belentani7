/* Belentani — Master Map of 20 Interconnected Archive Pages */

export interface ArchivePageMeta {
  path: string
  code: string
  category: "Universe" | "Characters" | "Eras & Sound" | "System & Tools"
  title: string
  subtitle: string
  excerpt: string
  prevPath: string
  nextPath: string
}

export const TWENTY_PAGES_MAP: ArchivePageMeta[] = [
  { path: "/archive/01-manifesto", code: "01-MAN", category: "Universe", title: "Manifiesto de la Dimensión Zion", subtitle: "Principio rector del ecosistema", excerpt: "El territorio cuántico donde la música se convierte en transmisión encriptada.", prevPath: "/archive/20-index", nextPath: "/archive/02-delusion" },
  { path: "/archive/02-delusion", code: "02-DEL", category: "Universe", title: "Delusión Permanente", subtitle: "Fusión entre simulación y realidad", excerpt: "El proceso mediante el cual autor y máquina comparten una misma frecuencia.", prevPath: "/archive/01-manifesto", nextPath: "/archive/03-data-fence" },
  { path: "/archive/03-data-fence", code: "03-FNC", category: "Universe", title: "La Cerca de Datos", subtitle: "Perímetro operativo y privacidad", excerpt: "Solo lo que pertenece al archivo oficial forma parte del canon de Belentani.", prevPath: "/archive/02-delusion", nextPath: "/archive/04-duck" },
  { path: "/archive/04-duck", code: "04-DCK", category: "Characters", title: "Duck Prod. (Lucas)", subtitle: "El Arquitecto del Sistema", excerpt: "Ingeniería sonora, producción ejecutiva y management desde 2022.", prevPath: "/archive/03-data-fence", nextPath: "/archive/05-belentani-core" },
  { path: "/archive/05-belentani-core", code: "05-BEL", category: "Characters", title: "Belentani (Entidad Central)", subtitle: "El Espejo y Vehículo Lírico", excerpt: "La proyección soberana que trasciende la autoría individual.", prevPath: "/archive/04-duck", nextPath: "/archive/06-san-pedro" },
  { path: "/archive/06-san-pedro", code: "06-SPD", category: "Characters", title: "San Pedro", subtitle: "Guardián del Artefacto", excerpt: "Custodio de la integridad del código frente a interferencias externas.", prevPath: "/archive/05-belentani-core", nextPath: "/archive/07-mary-lorena" },
  { path: "/archive/07-mary-lorena", code: "07-MRY", category: "Characters", title: "María / Lorena", subtitle: "El Ancla Primordial", excerpt: "El arquetipo materno y refugio emocional frente al frío algorítmico.", prevPath: "/archive/06-san-pedro", nextPath: "/archive/08-san-juan" },
  { path: "/archive/08-san-juan", code: "08-SJN", category: "Characters", title: "San Juan", subtitle: "El Sabio Joven", excerpt: "Intuición anticipada, velocidad de adaptación y ruptura radical.", prevPath: "/archive/07-mary-lorena", nextPath: "/archive/09-judas-era" },
  { path: "/archive/09-judas-era", code: "09-JDS", category: "Eras & Sound", title: "La Era de Judas", subtitle: "El Pacto de Diseño", excerpt: "La traición interpretada como un contrato arquitectónico necesario.", prevPath: "/archive/08-san-juan", nextPath: "/archive/10-moral-binary" },
  { path: "/archive/10-moral-binary", code: "10-MBIN", category: "Eras & Sound", title: "Moral Binary", subtitle: "Estudio 02", excerpt: "Voz, máquina y presión en una frecuencia inquebrantable.", prevPath: "/archive/09-judas-era", nextPath: "/archive/11-frequencies" },
  { path: "/archive/11-frequencies", code: "11-FRQ", category: "Eras & Sound", title: "Frecuencias de Transmisión", subtitle: "Ingeniería de Audio", excerpt: "El diseño de la mezcla que separa la obra del ruido comercial.", prevPath: "/archive/10-moral-binary", nextPath: "/archive/12-visual-canon" },
  { path: "/archive/12-visual-canon", code: "12-VIS", category: "Eras & Sound", title: "Canon Visual & Retrato", subtitle: "Estética Carbón y Óxido", excerpt: "La identidad fotográfica y la materialidad visual del proyecto.", prevPath: "/archive/11-frequencies", nextPath: "/archive/13-portal-decisions" },
  { path: "/archive/13-portal-decisions", code: "13-PRT", category: "System & Tools", title: "El Portal de Decisiones", subtitle: "Registro Local Activo", excerpt: "El visitante toma una decisión que la máquina conserva.", prevPath: "/archive/12-visual-canon", nextPath: "/archive/14-ai-studio" },
  { path: "/archive/14-ai-studio", code: "14-STD", category: "System & Tools", title: "AI Studio & MLOps", subtitle: "Herramientas de Creación", excerpt: "Generación asistida y optimización de flujos creativos.", prevPath: "/archive/13-portal-decisions", nextPath: "/archive/15-token-optimizer" },
  { path: "/archive/15-token-optimizer", code: "15-TOK", category: "System & Tools", title: "Optimizador de Tokens", subtitle: "Eficiencia de Agentes", excerpt: "Gestión rigurosa de contexto para agentes autónomos de élite.", prevPath: "/archive/14-ai-studio", nextPath: "/archive/16-skills-registry" },
  { path: "/archive/16-skills-registry", code: "16-SKL", category: "System & Tools", title: "Registry de Skills de GitHub", subtitle: "20 Herramientas Principales", excerpt: "OpenClaw, token-saver y automatización avanzada.", prevPath: "/archive/15-token-optimizer", nextPath: "/archive/17-awwwards-audit" },
  { path: "/archive/17-awwwards-audit", code: "17-AWW", category: "System & Tools", title: "Protocolo Awwwards", subtitle: "Matriz de 2,000 Criterios", excerpt: "Evaluación de diseño, usabilidad, creatividad y rendimiento.", prevPath: "/archive/16-skills-registry", nextPath: "/archive/18-qa-panel" },
  { path: "/archive/18-qa-panel", code: "18-QAP", category: "System & Tools", title: "Panel QA de 50 Perfiles", subtitle: "Evaluación Sintética", excerpt: "Verificación de robustez por perfiles profesionales diversos.", prevPath: "/archive/17-awwwards-audit", nextPath: "/archive/19-contact-desk" },
  { path: "/archive/19-contact-desk", code: "19-CNT", category: "System & Tools", title: "Mesa de Contacto y Prensa", subtitle: "Booking y Dossier de Prensa", excerpt: "Canales directos de comunicación con el estudio de Belentani.", prevPath: "/archive/18-qa-panel", nextPath: "/archive/20-index" },
  { path: "/archive/20-index", code: "20-IDX", category: "Universe", title: "Índice Maestro del Archivo", subtitle: "Mapa General de Rutas", excerpt: "Acceso centralizado a las 20 páginas interconectadas del sistema.", prevPath: "/archive/19-contact-desk", nextPath: "/archive/01-manifesto" }
]
