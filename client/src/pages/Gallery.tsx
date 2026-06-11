import { ShaderAnimation } from "@/components/ShaderAnimation"
import { useLocation } from "wouter"
import { useState } from "react"

export default function Gallery() {
  const [, navigate] = useLocation()
  const [language, setLanguage] = useState<"es" | "en" | "pt" | "fr" | "it">("es")

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <ShaderAnimation height="h-screen" colorMode="red" />
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md border-b border-red-500/20">
        <button onClick={() => navigate("/")} className="text-red-500 hover:text-red-400 transition-colors font-mono">← Inicio</button>
        <div className="flex gap-2">
          {(["es", "en", "pt", "fr", "it"] as const).map((lang) => (
            <button key={lang} onClick={() => setLanguage(lang)} className={`px-2 py-1 text-xs font-mono transition-all ${language === lang ? "text-red-500 border border-red-500 bg-red-500/10" : "text-gray-400 border border-gray-600 hover:text-red-400"}`}>{lang.toUpperCase()}</button>
          ))}
        </div>
      </nav>
      <div className="relative z-20 pt-24 px-6 pb-12 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-black text-red-500 mb-4" style={{ textShadow: "0 0 20px rgba(239, 68, 68, 0.6)" }}>GALERÍA</h1>
        <p className="text-gray-400 font-mono">Fotos, arte y visuales del proyecto Belentani</p>
      </div>
    </div>
  )
}
