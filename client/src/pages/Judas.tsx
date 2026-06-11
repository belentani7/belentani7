import { ShaderAnimation } from "@/components/ShaderAnimation"
import { MatrixRain, WaterRain, DigitalInsects } from "@/components/VisualEffects"
import { useLocation } from "wouter"
import { useState } from "react"

export default function Judas() {
  const [, navigate] = useLocation()
  const [language, setLanguage] = useState<"es" | "en" | "pt" | "fr" | "it">("es")

  const translations = {
    es: {
      backHome: "← Inicio",
      judas: "JUDAS",
      eraJudas: "La Era de Judas",
      theMythTitle: "El Mito del Guardián y Judas",
      theMythDesc: "Una historia de fachadas. El mundo ve un traidor, pero el Guardián y Judas saben que son familia bajo un pacto secreto. Esa ambigüedad es lo que hace que una canción o un proyecto artístico sea profundo sin necesidad de ser conflictivo en la vida real.",
      theSecretPact: "El Pacto Secreto",
      secretDesc: "Judas aceptó un secreto para encajar en una historia que el mundo necesita oír. El villano por diseño, el que quiere ser recordado, pero no por sus acciones, sino por su papel en la narrativa cósmica.",
      depersonalization: "Despersonalización Total",
      depersonalizationDesc: "Al hablar de 'El Guardián' y 'El Artefacto', los nombres reales se disuelven en el mito. Nadie puede señalar con el dedo porque estamos hablando de conceptos cuánticos y deudas impagables de inspiración.",
      dataFence: "La Cerca de Datos",
      dataFenceDesc: "Si no hay un documento que una el Punto A con el Punto B, la conexión no existe. Aquí la única conexión es la estética Belentani.",
    },
    en: {
      backHome: "← Home",
      judas: "JUDAS",
      eraJudas: "The Judas Era",
      theMythTitle: "The Myth of the Guardian and Judas",
      theMythDesc: "A story of facades. The world sees a traitor, but the Guardian and Judas know they are family under a secret pact. That ambiguity is what makes a song or artistic project deep without needing to be conflictive in real life.",
      theSecretPact: "The Secret Pact",
      secretDesc: "Judas accepted a secret to fit into a story the world needs to hear. The villain by design, the one who wants to be remembered, but not for his actions, but for his role in the cosmic narrative.",
      depersonalization: "Total Depersonalization",
      depersonalizationDesc: "When speaking of 'The Guardian' and 'The Artifact', real names dissolve into myth. No one can point a finger because we are talking about quantum concepts and unpayable debts of inspiration.",
      dataFence: "The Data Fence",
      dataFenceDesc: "If there is no document connecting Point A to Point B, the connection does not exist. Here the only connection is the Belentani aesthetic.",
    },
    pt: {
      backHome: "← Início",
      judas: "JUDAS",
      eraJudas: "A Era de Judas",
      theMythTitle: "O Mito do Guardião e Judas",
      theMythDesc: "Uma história de fachadas. O mundo vê um traidor, mas o Guardião e Judas sabem que são família sob um pacto secreto. Essa ambigüidade é o que torna uma música ou um projeto artístico profundo sem precisar ser conflituoso na vida real.",
      theSecretPact: "O Pacto Secreto",
      secretDesc: "Judas aceitou um segredo para se encaixar em uma história que o mundo precisa ouvir. O vilão por design, aquele que quer ser lembrado, mas não por suas ações, mas por seu papel na narrativa cósmica.",
      depersonalization: "Despersonalização Total",
      depersonalizationDesc: "Ao falar de 'O Guardião' e 'O Artefato', os nomes reais se dissolvem no mito. Ninguém pode apontar o dedo porque estamos falando de conceitos quânticos e dívidas impagáveis de inspiração.",
      dataFence: "A Cerca de Dados",
      dataFenceDesc: "Se não há um documento conectando o Ponto A ao Ponto B, a conexão não existe. Aqui a única conexão é a estética Belentani.",
    },
    fr: {
      backHome: "← Accueil",
      judas: "JUDAS",
      eraJudas: "L'Ère de Judas",
      theMythTitle: "Le Mythe du Gardien et Judas",
      theMythDesc: "Une histoire de façades. Le monde voit un traître, mais le Gardien et Judas savent qu'ils sont une famille sous un pacte secret. Cette ambiguïté est ce qui rend une chanson ou un projet artistique profond sans avoir besoin d'être conflictuel dans la vie réelle.",
      theSecretPact: "Le Pacte Secret",
      secretDesc: "Judas a accepté un secret pour s'adapter à une histoire que le monde doit entendre. Le méchant par design, celui qui veut être remembré, mais pas pour ses actions, mais pour son rôle dans la narration cosmique.",
      depersonalization: "Dépersonnalisation Totale",
      depersonalizationDesc: "Quand on parle du 'Gardien' et de l'Artefact', les noms réels se dissolvent dans le mythe. Personne ne peut pointer du doigt car nous parlons de concepts quantiques et de dettes impayables d'inspiration.",
      dataFence: "La Clôture de Données",
      dataFenceDesc: "S'il n'y a pas de document reliant le Point A au Point B, la connexion n'existe pas. Ici, la seule connexion est l'esthétique Belentani.",
    },
    it: {
      backHome: "← Home",
      judas: "GIUDA",
      eraJudas: "L'Era di Giuda",
      theMythTitle: "Il Mito del Guardiano e Giuda",
      theMythDesc: "Una storia di facciate. Il mondo vede un traditore, ma il Guardiano e Giuda sanno di essere una famiglia sotto un patto segreto. Quella ambiguità è ciò che rende una canzone o un progetto artistico profondo senza bisogno di essere conflittuale nella vita reale.",
      theSecretPact: "Il Patto Segreto",
      secretDesc: "Giuda ha accettato un segreto per adattarsi a una storia che il mondo deve ascoltare. Il cattivo per design, colui che vuole essere ricordato, ma non per le sue azioni, ma per il suo ruolo nella narrativa cosmica.",
      depersonalization: "Depersonalizzazione Totale",
      depersonalizationDesc: "Quando si parla del 'Guardiano' e dell'Artefatto', i nomi reali si dissolvono nel mito. Nessuno può puntare il dito perché stiamo parlando di concetti quantici e debiti impagabili di ispirazione.",
      dataFence: "La Recinzione di Dati",
      dataFenceDesc: "Se non c'è un documento che collega il Punto A al Punto B, la connessione non esiste. Qui l'unica connessione è l'estetica Belentani.",
    },
  }

  const t = translations[language]

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Background Effects */}
      <ShaderAnimation height="h-screen" colorMode="red" />
      <MatrixRain />
      <WaterRain />
      <DigitalInsects />

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
        <h1 className="text-7xl font-black text-red-500 mb-2 animate-pulse" style={{ textShadow: "0 0 30px rgba(239, 68, 68, 0.8)" }}>
          {t.judas}
        </h1>
        <h2 className="text-2xl font-mono text-gray-300 mb-12">{t.eraJudas}</h2>

        {/* Myth Section */}
        <section className="mb-12 p-8 border-2 border-red-500/50 bg-red-500/10 rounded-lg backdrop-blur-sm">
          <h3 className="text-3xl font-bold text-red-400 mb-4">{t.theMythTitle}</h3>
          <p className="text-gray-300 leading-relaxed font-mono text-sm">{t.theMythDesc}</p>
        </section>

        {/* Narrative Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Secret Pact */}
          <div className="p-6 border border-purple-500/40 bg-purple-500/10 rounded-lg backdrop-blur-sm hover:border-purple-500/80 transition-all">
            <h3 className="text-xl font-bold text-purple-400 mb-3">{t.theSecretPact}</h3>
            <p className="text-gray-300 text-sm font-mono leading-relaxed">{t.secretDesc}</p>
          </div>

          {/* Depersonalization */}
          <div className="p-6 border border-cyan-500/40 bg-cyan-500/10 rounded-lg backdrop-blur-sm hover:border-cyan-500/80 transition-all">
            <h3 className="text-xl font-bold text-cyan-400 mb-3">{t.depersonalization}</h3>
            <p className="text-gray-300 text-sm font-mono leading-relaxed">{t.depersonalizationDesc}</p>
          </div>

          {/* Data Fence */}
          <div className="p-6 border border-green-500/40 bg-green-500/10 rounded-lg backdrop-blur-sm hover:border-green-500/80 transition-all md:col-span-2">
            <h3 className="text-xl font-bold text-green-400 mb-3">{t.dataFence}</h3>
            <p className="text-gray-300 text-sm font-mono leading-relaxed">{t.dataFenceDesc}</p>
          </div>
        </div>

        {/* System Message */}
        <div className="p-6 border border-red-500/30 bg-black/50 rounded-lg backdrop-blur-sm text-center">
          <p className="text-red-500 font-mono text-xs tracking-widest animate-pulse">
            SYSTEM CORE TERMINAL // REAL DATA FLOW
          </p>
          <p className="text-gray-500 font-mono text-xs mt-2">¿En qué frecuencia estás transmitiendo hoy?</p>
        </div>
      </div>
    </div>
  )
}
