/* Belentani — 2,000 Criteria Awwwards Competition Protocol & Matrix */

export interface CriteriaDimension {
  id: string
  name: string
  weight: number
  subcriteriaCount: number
  description: string
  keyFocus: string[]
}

export const AWWWARDS_COMPETITION_PROTOCOL = {
  title: "Protocolo de Competición Awwwards (2,000 Criterios)",
  subtitle: "Metodología de excelencia para asegurar el reconocimiento de Site of the Day / Developer Award",
  targetScore: "9.85 / 10.00",
  dimensions: [
    {
      id: "design",
      name: "1. Design & Aesthetic Vision",
      weight: 400,
      subcriteriaCount: 400,
      description: "Evaluación de la tipografía editorial, paleta de colores carbón/hueso/rojo óxido, jerarquía visual asimétrica y atmósfera inmersiva sin ruidos visuales.",
      keyFocus: ["Space Grotesk typography rhythm", "Micro-contrast", "Zero generic gradients", "Authentic storytelling layout"]
    },
    {
      id: "usability",
      name: "2. Usability & Navigation Architecture",
      weight: 400,
      subcriteriaCount: 400,
      description: "Fluidez de enrutamiento SPA, consistencia del SiteShell, accesibilidad WCAG 2.2 AA y predictibilidad en dispositivos móviles y de escritorio.",
      keyFocus: ["Keyboard navigation", "Focus rings", "Touch targets", "Instant route switching"]
    },
    {
      id: "creativity",
      name: "3. Creativity & Conceptual Innovation",
      weight: 400,
      subcriteriaCount: 400,
      description: "Integración de la mitología de Belentani, el Dossier Maestro, el Portal de decisiones y el uso de shaders atmosféricos en harmonía con el arte visual.",
      keyFocus: ["Mythological coherence", "Persistent local states", "Immersive lore codex", "Artistic direction"]
    },
    {
      id: "content",
      name: "4. Content & Narrative Integrity",
      weight: 400,
      subcriteriaCount: 400,
      description: "Riqueza del corpus narrativo extraído del archivo original, ausencia de resúmenes superficiales y claridad en la exposición de arquetipos y eras.",
      keyFocus: ["Zero placeholder text", "Deep character backstories", "Precise terminology", "Editorial tone"]
    },
    {
      id: "performance",
      name: "5. Technical Performance & Code Quality",
      weight: 400,
      subcriteriaCount: 400,
      description: "Optimización de paquetes Vite/React 19, cumplimiento estricto de TypeScript sin errores, lazy loading y carga instantánea por debajo de los estándares web.",
      keyFocus: ["Zero TypeScript warnings", "Optimized asset delivery", "Robust error boundaries", "Clean component separation"]
    }
  ] as CriteriaDimension[]
}
