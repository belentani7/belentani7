import { ShaderAnimation } from "@/components/ShaderAnimation"
import { MatrixRain, NeonRings } from "@/components/VisualEffects"
import { useLocation } from "wouter"
import { useState } from "react"

const SKILLS = [
  { id: 1, name: "Planning-with-files", desc: "Memoria a largo plazo con plan persistente", category: "Autonomía", link: "https://github.com/OthmanAdi/planning-with-files" },
  { id: 2, name: "Dev-Browser", desc: "Navegador sin interfaz para exploración autónoma", category: "Desarrollo Web", link: "https://github.com/SawyerHood/dev-browser" },
  { id: 3, name: "openclaw-superpowers", desc: "56 habilidades para agentes OpenClaw", category: "Agente Autónomo", link: "https://github.com/ArchieIndian/openclaw-superpowers" },
  { id: 4, name: "ByteRover", desc: "Gestión de conocimiento del proyecto", category: "Administración", link: "https://github.com/sundial-org/awesome-openclaw-skills" },
  { id: 5, name: "token-saver-context-compression", desc: "Reduce 48% uso de tokens sin perder calidad", category: "Ahorro de Tokens", link: "https://agentskills.so/token-saver-context-compression" },
  { id: 6, name: "Vercel Agent Skills", desc: "Estándar de Vercel para Next.js", category: "Desarrollo Web", link: "https://github.com/vercel-labs/agent-skills" },
  { id: 7, name: "sogni-creative-agent-skill", desc: "Genera y edita imágenes y vídeos con IA", category: "Creación Multimedia", link: "https://www.npmjs.com/package/@sogni-ai/sogni-creative-agent-skill" },
  { id: 8, name: "music-skill", desc: "Modifica MIDI y convierte a audio", category: "Producción Musical", link: "https://github.com/KaleLjl/music-skill" },
  { id: 9, name: "music-composition", desc: "Composición musical en 24+ géneros", category: "Producción Musical", link: "https://github.com/SJY051/music-composition" },
  { id: 10, name: "mcp-skills", desc: "Descubre e instala habilidades automáticamente", category: "Agente Autónomo", link: "https://github.com/FranciscoYuster/mcp-skills" },
  { id: 11, name: "openclaw-ghsa-maintainer", desc: "Mantiene seguridad analizando vulnerabilidades", category: "Seguridad", link: "https://seektool.ai/ai/skillsmp-com" },
  { id: 12, name: "agent-browser", desc: "Navegador headless en Rust ultrarrápido", category: "Desarrollo Web", link: "https://github.com/sundial-org/awesome-openclaw-skills" },
  { id: 13, name: "Banuba AI Skills", desc: "SDKs de editor de vídeo y foto", category: "Creación Multimedia", link: "https://github.com/Banuba/ai-skills" },
  { id: 14, name: "prd-decompose", desc: "Convierte requisitos en tareas ejecutables", category: "Gestión Proyectos", link: "https://github.com/PSDN-AI/nexus-skills" },
  { id: 15, name: "promote-skill", desc: "Empaqueta y publica skills en marketplaces", category: "Agente Autónomo", link: "https://github.com/ralyodio/agent-skills" },
  { id: 16, name: "self-improving-agent", desc: "Captura errores para auto-mejora continua", category: "Agente Autónomo", link: "https://github.com/sundial-org/awesome-openclaw-skills" },
  { id: 17, name: "SkillReducer", desc: "Comprime instrucciones de skills", category: "Ahorro de Tokens", link: "https://export.arxiv.org/abs/2503.12345" },
  { id: 18, name: "academic-deep-research", desc: "Investigaciones rigurosas y transparentes", category: "Investigación", link: "https://github.com/LeoYeAI/openclaw-master-skills" },
  { id: 19, name: "openclaw-secret-scanning", desc: "Limpia secretos filtrados automáticamente", category: "Seguridad", link: "https://seektool.ai/ai/skillsmp-com" },
  { id: 20, name: "context-compression", desc: "Gestiona millones de tokens con resúmenes", category: "Ahorro de Tokens", link: "https://agentskills.so/context-compression" },
]

const CATEGORIES = ["Todas", "Autonomía", "Desarrollo Web", "Agente Autónomo", "Administración", "Ahorro de Tokens", "Creación Multimedia", "Producción Musical", "Seguridad", "Gestión Proyectos", "Investigación"]

export default function Skills() {
  const [, navigate] = useLocation()
  const [language, setLanguage] = useState<"es" | "en" | "pt" | "fr" | "it">("es")
  const [selectedCategory, setSelectedCategory] = useState("Todas")

  const translations = {
    es: {
      backHome: "← Inicio",
      skills: "SKILLS & TOOLS",
      subtitle: "Las 20 herramientas principales para agentes autónomos",
      description: "Integra estas skills de GitHub para convertir tu agente en un todoterreno capaz de desarrollar, crear, investigar y optimizar.",
      allCategories: "Todas",
      category: "Categoría",
      install: "Instalar",
      learn: "Aprender",
    },
    en: {
      backHome: "← Home",
      skills: "SKILLS & TOOLS",
      subtitle: "The 20 main tools for autonomous agents",
      description: "Integrate these GitHub skills to turn your agent into a versatile tool capable of developing, creating, researching and optimizing.",
      allCategories: "All",
      category: "Category",
      install: "Install",
      learn: "Learn",
    },
    pt: {
      backHome: "← Início",
      skills: "SKILLS & TOOLS",
      subtitle: "As 20 ferramentas principais para agentes autônomos",
      description: "Integre essas skills do GitHub para transformar seu agente em uma ferramenta versátil capaz de desenvolver, criar, pesquisar e otimizar.",
      allCategories: "Todas",
      category: "Categoria",
      install: "Instalar",
      learn: "Aprender",
    },
    fr: {
      backHome: "← Accueil",
      skills: "SKILLS & TOOLS",
      subtitle: "Les 20 principaux outils pour les agents autonomes",
      description: "Intégrez ces skills GitHub pour transformer votre agent en un outil polyvalent capable de développer, créer, rechercher et optimiser.",
      allCategories: "Tous",
      category: "Catégorie",
      install: "Installer",
      learn: "Apprendre",
    },
    it: {
      backHome: "← Home",
      skills: "SKILLS & TOOLS",
      subtitle: "I 20 principali strumenti per agenti autonomi",
      description: "Integra questi skill di GitHub per trasformare il tuo agente in uno strumento versatile capace di sviluppare, creare, ricercare e ottimizzare.",
      allCategories: "Tutti",
      category: "Categoria",
      install: "Installa",
      learn: "Impara",
    },
  }

  const t = translations[language]
  const filteredSkills = selectedCategory === "Todas" ? SKILLS : SKILLS.filter(s => s.category === selectedCategory)

  const categoryColors: Record<string, string> = {
    "Autonomía": "cyan",
    "Desarrollo Web": "blue",
    "Agente Autónomo": "purple",
    "Administración": "green",
    "Ahorro de Tokens": "yellow",
    "Creación Multimedia": "pink",
    "Producción Musical": "red",
    "Seguridad": "orange",
    "Gestión Proyectos": "indigo",
    "Investigación": "violet",
  }

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Background Effects */}
      <NeonRings />
      <MatrixRain />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md border-b border-red-500/20">
        <button
          onClick={() => navigate("/")}
          className="text-red-500 hover:text-red-400 transition-colors font-mono"
        >
          {t.backHome}
        </button>

        <div className="flex gap-2">
          {(["es", "en", "pt", "fr", "it"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2 py-1 text-xs font-mono transition-all ${
                language === lang
                  ? "text-red-500 border border-red-500 bg-red-500/10"
                  : "text-gray-400 border border-gray-600 hover:text-red-400"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-20 pt-24 px-6 pb-12 max-w-6xl mx-auto">
        <h1 className="text-5xl font-black text-red-500 mb-2" style={{ textShadow: "0 0 20px rgba(239, 68, 68, 0.6)" }}>
          {t.skills}
        </h1>
        <h2 className="text-xl font-mono text-gray-300 mb-4">{t.subtitle}</h2>
        <p className="text-gray-400 font-mono text-sm mb-8">{t.description}</p>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-mono transition-all rounded ${
                selectedCategory === cat
                  ? "text-red-500 border border-red-500 bg-red-500/20"
                  : "text-gray-400 border border-gray-600 hover:text-red-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 border border-red-500/30 bg-red-500/5 rounded-lg backdrop-blur-sm hover:border-red-500/60 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold text-red-400 group-hover:text-red-300 transition-colors">
                  {skill.name}
                </h3>
                <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 font-mono">
                  {skill.category}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">{skill.desc}</p>
              <a
                href={skill.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-cyan-400 hover:text-cyan-300 font-mono underline"
              >
                {t.learn} →
              </a>
            </div>
          ))}
        </div>

        {/* OpenClaw Highlight */}
        <section className="mt-12 p-6 border-2 border-purple-500/50 bg-purple-500/10 rounded-lg backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-purple-400 mb-3">🚀 El Universo OpenClaw</h3>
          <p className="text-gray-300 text-sm font-mono mb-4">
            OpenClaw es la base más potente para agentes autónomos. Accede a más de 1,300 habilidades diseñadas para agentes que no paran.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="https://github.com/LeoYeAI/openclaw-master-skills" target="_blank" rel="noopener noreferrer" className="p-3 border border-purple-500/40 bg-purple-500/5 rounded hover:border-purple-500/80 transition-all">
              <p className="text-sm font-bold text-purple-300 mb-1">OpenClaw Master Skills</p>
              <p className="text-xs text-gray-400">1,200+ habilidades actualizadas semanalmente</p>
            </a>
            <a href="https://github.com/ArchieIndian/openclaw-superpowers" target="_blank" rel="noopener noreferrer" className="p-3 border border-purple-500/40 bg-purple-500/5 rounded hover:border-purple-500/80 transition-all">
              <p className="text-sm font-bold text-purple-300 mb-1">openclaw-superpowers</p>
              <p className="text-xs text-gray-400">56 capacidades en un comando</p>
            </a>
            <a href="https://github.com/disi3r/openclaw-skill-manus" target="_blank" rel="noopener noreferrer" className="p-3 border border-purple-500/40 bg-purple-500/5 rounded hover:border-purple-500/80 transition-all">
              <p className="text-sm font-bold text-purple-300 mb-1">openclaw-skill-manus</p>
              <p className="text-xs text-gray-400">Conecta OpenClaw con Manus</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
