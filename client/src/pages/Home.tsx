import { ShaderAnimation } from "@/components/ShaderAnimation"
import { RippleShader, BloomShader, ParticleBloom } from "@/components/AdvancedShaders"
import { useLocation } from "wouter"
import { useState } from "react"

export default function Home() {
  const [, navigate] = useLocation()
  const [language, setLanguage] = useState<"es" | "en" | "pt" | "fr" | "it">("es")

  const translations = {
    es: {
      title: "BELENTANI",
      subtitle: "The Judas Era",
      artist: "El Artista",
      music: "Música",
      judas: "Judas",
      portal: "Portal",
      gallery: "Galería",
      contact: "Contacto",
    },
    en: {
      title: "BELENTANI",
      subtitle: "The Judas Era",
      artist: "The Artist",
      music: "Music",
      judas: "Judas",
      portal: "Portal",
      gallery: "Gallery",
      contact: "Contact",
    },
    pt: {
      title: "BELENTANI",
      subtitle: "A Era de Judas",
      artist: "O Artista",
      music: "Música",
      judas: "Judas",
      portal: "Portal",
      gallery: "Galeria",
      contact: "Contato",
    },
    fr: {
      title: "BELENTANI",
      subtitle: "L'Ère de Judas",
      artist: "L'Artiste",
      music: "Musique",
      judas: "Judas",
      portal: "Portail",
      gallery: "Galerie",
      contact: "Contact",
    },
    it: {
      title: "BELENTANI",
      subtitle: "L'Era di Giuda",
      artist: "L'Artista",
      music: "Musica",
      judas: "Giuda",
      portal: "Portale",
      gallery: "Galleria",
      contact: "Contatti",
    },
  }

  const t = translations[language]

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Shader Background - Multiple Layers */}
      <ShaderAnimation height="h-screen" colorMode="red" />
      <RippleShader />
      <BloomShader />
      <ParticleBloom />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/30 backdrop-blur-md border-b border-red-500/20">
        <div className="text-2xl font-bold text-red-500 neon-glow">BELENTANI</div>

        {/* Language Selector */}
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

      {/* Menu Links */}
      <div className="fixed top-20 left-0 right-0 z-40 flex justify-center gap-8 px-6 py-4 bg-black/20 backdrop-blur-sm border-b border-red-500/10">
        {[
          { label: t.artist, path: "/artist" },
          { label: t.music, path: "/music" },
          { label: t.judas, path: "/judas" },
          { label: t.portal, path: "/portal" },
          { label: t.gallery, path: "/gallery" },
          { label: t.contact, path: "/contact" },
          { label: "Skills", path: "/skills" },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="text-sm font-mono text-gray-300 hover:text-red-400 transition-colors duration-300 relative group"
          >
            {item.label}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300" />
          </button>
        ))}
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <div className="text-center space-y-6">
          <h1 className="text-8xl font-black text-red-500 drop-shadow-2xl animate-pulse" style={{ textShadow: "0 0 30px rgba(239, 68, 68, 0.8)" }}>
            {t.title}
          </h1>
          <p className="text-2xl font-mono text-gray-300 tracking-widest">{t.subtitle}</p>

          {/* Glitch Effect */}
          <div className="relative h-1 w-48 mx-auto overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .neon-glow {
          text-shadow: 0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.4);
        }
      `}</style>
    </div>
  )
}
