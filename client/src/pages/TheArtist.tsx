import { ShaderAnimation } from "@/components/ShaderAnimation"
import { MatrixRain, WaterRain, NeonRings } from "@/components/VisualEffects"
import { useLocation } from "wouter"
import { useState } from "react"

export default function TheArtist() {
  const [, navigate] = useLocation()
  const [language, setLanguage] = useState<"es" | "en" | "pt" | "fr" | "it">("es")

  const translations = {
    es: {
      backHome: "← Inicio",
      theArtist: "El Artista",
      belentanisPlanet: "Planeta de Belentani: Era Judas",
      narrative: "La integración del Guerrero y el Ángel, el hack de la Dimensión Zion, y el proceso de Delusión Permanente.",
      duckProd: "Sistema Arquitecto // Duck Prod.",
      duckBio: "Mi nombre verdadero es Lucas, pero probablemente me conoces como Duck. Soy productor musical desde 2022, responsable del sonido, producción y management de Belentani.",
      stPedro: "San Pedro: El Guardián del Artefacto",
      stPedroDesc: "El portador del artefacto, el que mantiene la integridad del código.",
      judas: "Judas: El Pacto Secreto",
      judasDesc: "El villano por diseño, aceptó un secreto para encajar en una historia que el mundo necesita oír.",
      mary: "María/Lorena: La Madre Arquetipo",
      maryDesc: "La belleza y la fuerza de la mujer, madre de los doce discípulos.",
      stJohn: "San Juan: El Sabio Joven",
      stJohnDesc: "El joven sabio, la fortaleza del arquetipo, completo con la sabiduría.",
    },
    en: {
      backHome: "← Home",
      theArtist: "The Artist",
      belentanisPlanet: "Belentani's Planet: Judas Era",
      narrative: "The integration of the Warrior and the Angel, the Zion Dimension hack, and the Permanent Delusion process.",
      duckProd: "System Architect // Duck Prod.",
      duckBio: "My real name is Lucas, but you probably know me as Duck. I've been a music producer since 2022, responsible for the sound, production and management of Belentani.",
      stPedro: "Saint Peter: The Guardian of the Artifact",
      stPedroDesc: "The bearer of the artifact, the one who maintains the integrity of the code.",
      judas: "Judas: The Secret Pact",
      judasDesc: "The villain by design, accepted a secret to fit into a story the world needs to hear.",
      mary: "Mary/Lorena: The Mother Archetype",
      maryDesc: "The beauty and strength of woman, mother of the twelve disciples.",
      stJohn: "Saint John: The Young Sage",
      stJohnDesc: "The young sage, the strength of the archetype, complete with wisdom.",
    },
    pt: {
      backHome: "← Início",
      theArtist: "O Artista",
      belentanisPlanet: "Planeta de Belentani: Era Judas",
      narrative: "A integração do Guerreiro e do Anjo, o hack da Dimensão Zion, e o processo de Ilusão Permanente.",
      duckProd: "Arquiteto do Sistema // Duck Prod.",
      duckBio: "Meu nome verdadeiro é Lucas, mas você provavelmente me conhece como Duck. Sou produtor musical desde 2022, responsável pelo som, produção e gestão de Belentani.",
      stPedro: "São Pedro: O Guardião do Artefato",
      stPedroDesc: "O portador do artefato, aquele que mantém a integridade do código.",
      judas: "Judas: O Pacto Secreto",
      judasDesc: "O vilão por design, aceitou um segredo para se encaixar em uma história que o mundo precisa ouvir.",
      mary: "Maria/Lorena: O Arquétipo da Mãe",
      maryDesc: "A beleza e a força da mulher, mãe dos doze discípulos.",
      stJohn: "São João: O Jovem Sábio",
      stJohnDesc: "O jovem sábio, a força do arquétipo, completo com sabedoria.",
    },
    fr: {
      backHome: "← Accueil",
      theArtist: "L'Artiste",
      belentanisPlanet: "Planète de Belentani: Ère de Judas",
      narrative: "L'intégration du Guerrier et de l'Ange, le piratage de la Dimension Zion, et le processus d'Illusion Permanente.",
      duckProd: "Architecte Système // Duck Prod.",
      duckBio: "Mon vrai nom est Lucas, mais vous me connaissez probablement sous le nom de Duck. Je suis producteur musical depuis 2022, responsable du son, de la production et de la gestion de Belentani.",
      stPedro: "Saint Pierre: Le Gardien de l'Artefact",
      stPedroDesc: "Le porteur de l'artefact, celui qui maintient l'intégrité du code.",
      judas: "Judas: Le Pacte Secret",
      judasDesc: "Le méchant par design, a accepté un secret pour s'adapter à une histoire que le monde doit entendre.",
      mary: "Marie/Lorena: L'Archétype de la Mère",
      maryDesc: "La beauté et la force de la femme, mère des douze disciples.",
      stJohn: "Saint Jean: Le Jeune Sage",
      stJohnDesc: "Le jeune sage, la force de l'archétype, complet avec la sagesse.",
    },
    it: {
      backHome: "← Home",
      theArtist: "L'Artista",
      belentanisPlanet: "Pianeta di Belentani: Era di Giuda",
      narrative: "L'integrazione del Guerriero e dell'Angelo, l'hack della Dimensione Zion, e il processo di Illusione Permanente.",
      duckProd: "Architetto di Sistema // Duck Prod.",
      duckBio: "Il mio vero nome è Lucas, ma probabilmente mi conosci come Duck. Sono un produttore musicale dal 2022, responsabile del suono, della produzione e della gestione di Belentani.",
      stPedro: "San Pietro: Il Guardiano dell'Artefatto",
      stPedroDesc: "Il portatore dell'artefatto, colui che mantiene l'integrità del codice.",
      judas: "Giuda: Il Patto Segreto",
      judasDesc: "Il cattivo per design, ha accettato un segreto per adattarsi a una storia che il mondo deve ascoltare.",
      mary: "Maria/Lorena: L'Archetipo della Madre",
      maryDesc: "La bellezza e la forza della donna, madre dei dodici discepoli.",
      stJohn: "San Giovanni: Il Giovane Saggio",
      stJohnDesc: "Il giovane saggio, la forza dell'archetipo, completo di saggezza.",
    },
  }

  const t = translations[language]

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Background Effects */}
      <NeonRings />
      <MatrixRain />
      <WaterRain />

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
      <div className="relative z-20 pt-24 px-6 pb-12 max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-red-500 mb-2" style={{ textShadow: "0 0 20px rgba(239, 68, 68, 0.6)" }}>
          {t.theArtist}
        </h1>
        <h2 className="text-2xl font-mono text-gray-300 mb-8">{t.belentanisPlanet}</h2>

        {/* Narrative Section */}
        <section className="mb-12 p-6 border border-red-500/30 bg-red-500/5 rounded-lg backdrop-blur-sm">
          <p className="text-gray-300 leading-relaxed font-mono text-sm">{t.narrative}</p>
        </section>

        {/* Archetypes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Duck */}
          <div className="p-6 border border-cyan-500/30 bg-cyan-500/5 rounded-lg backdrop-blur-sm hover:border-cyan-500/60 transition-all">
            <h3 className="text-xl font-bold text-cyan-400 mb-2">{t.duckProd}</h3>
            <p className="text-gray-300 text-sm font-mono">{t.duckBio}</p>
            <div className="mt-4 flex gap-2">
              <a href="https://instagram.com/duck4s" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs">
                Instagram
              </a>
              <a href="https://duck.46graus.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs">
                Web
              </a>
            </div>
          </div>

          {/* St. Pedro */}
          <div className="p-6 border border-green-500/30 bg-green-500/5 rounded-lg backdrop-blur-sm hover:border-green-500/60 transition-all">
            <h3 className="text-xl font-bold text-green-400 mb-2">{t.stPedro}</h3>
            <p className="text-gray-300 text-sm font-mono">{t.stPedroDesc}</p>
          </div>

          {/* Judas */}
          <div className="p-6 border border-purple-500/30 bg-purple-500/5 rounded-lg backdrop-blur-sm hover:border-purple-500/60 transition-all">
            <h3 className="text-xl font-bold text-purple-400 mb-2">{t.judas}</h3>
            <p className="text-gray-300 text-sm font-mono">{t.judasDesc}</p>
          </div>

          {/* Mary */}
          <div className="p-6 border border-pink-500/30 bg-pink-500/5 rounded-lg backdrop-blur-sm hover:border-pink-500/60 transition-all">
            <h3 className="text-xl font-bold text-pink-400 mb-2">{t.mary}</h3>
            <p className="text-gray-300 text-sm font-mono">{t.maryDesc}</p>
          </div>

          {/* St. John */}
          <div className="p-6 border border-yellow-500/30 bg-yellow-500/5 rounded-lg backdrop-blur-sm hover:border-yellow-500/60 transition-all md:col-span-2">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">{t.stJohn}</h3>
            <p className="text-gray-300 text-sm font-mono">{t.stJohnDesc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
