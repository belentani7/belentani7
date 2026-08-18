/* Belentani — The Artist & Complete Universe */
import SiteShell from "@/components/SiteShell"
import { Link } from "wouter"

const archetypes = [
  { name: "Duck Prod.", role: "System Architect", desc: "Lucas (Duck), productor musical desde 2022 y artífice de la ingeniería sonora, producción ejecutiva y management del proyecto." },
  { name: "San Pedro", role: "Guardian of the Artifact", desc: "El portador del artefacto, encargado de mantener la integridad del código y filtrar las interferencias externas." },
  { name: "Judas", role: "The Secret Pact", desc: "El villano por diseño. Aceptó un pacto secreto para habitar el rol que la narrativa cósmica necesitaba." },
  { name: "María / Lorena", role: "The Mother Archetype", desc: "La belleza y la fuerza primordial, el ancla emocional en medio del paisaje sintético y algorítmico." },
  { name: "San Juan", role: "The Young Sage", desc: "La lucidez anticipada y la audacia de mirar el futuro sin temor a la obsolescencia." },
]

export default function TheArtist() {
  return (
    <SiteShell section="Archive 002 / The Artist & Universe">
      <section className="page-frame" style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 items-center">
          <div className="fade-up">
            <div className="eyebrow">Archive 002 / Universe & Portrait</div>
            <h1 className="section-title mt-7 max-w-[540px]">Belentani’s Planet & Mythos.</h1>
            <p className="mono-copy mt-8 max-w-[420px]">La integración del Guerrero y el Ángel, la Dimensión Zion y la Delusión Permanente.</p>
            <div className="manifesto-block mt-8">
              <p>“El artista no es el que inventa una máscara, sino el que soporta la tensión de habitarla hasta que se vuelve real.”</p>
            </div>
          </div>
          <div className="fade-up delay-1 border border-[var(--border)] bg-[#101010] p-3 shadow-2xl">
            <div className="relative overflow-hidden aspect-[9/16] max-h-[520px] w-full">
              <img 
                src="/manus-storage/belentani-portrait_c0ab5f2c.webp" 
                alt="Belentani Portrait — Official Archive" 
                className="h-full w-full object-cover grayscale contrast-125 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 font-mono text-xs text-[#d8473f] tracking-[0.15em]">
                SUBJECT: BELENTANI / 01-CANON
              </div>
            </div>
          </div>
        </div>

        <div className="mt-28 border-t border-[var(--border)] pt-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="archive-label">The pantheon</span>
              <h2 className="text-3xl font-medium tracking-[-0.05em] text-[#e7e1d8] sm:text-5xl mt-2">Arquetipos del Ecosistema</h2>
            </div>
            <Link href="/lore" className="editorial-button ghost">Explore full lore codex →</Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {archetypes.map((item, idx) => (
              <div key={item.name} className="archive-card">
                <span className="index-number">0{idx + 1} / {item.role}</span>
                <h3 className="mt-12 text-2xl font-medium tracking-[-0.04em] text-[#e7e1d8]">{item.name}</h3>
                <p className="mt-4 text-sm leading-7 text-[#96918a]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-28 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="border border-[var(--border)] bg-[#101010] p-8">
            <span className="archive-label">Operating principle</span>
            <h2 className="mt-6 text-3xl font-medium tracking-[-0.05em] text-[#e7e1d8]">La Cerca de Datos</h2>
            <p className="mt-4 text-sm leading-7 text-[#96918a]">
              Si no hay un documento, una pista o un registro oficial que una el Punto A con el Punto B, la conexión no pertenece a la realidad de Belentani. Aquí la única ley es la estética y el rigor del archivo.
            </p>
          </div>
          <div className="border border-[var(--border)] bg-[#101010] p-8">
            <span className="archive-label">Transmission protocol</span>
            <h2 className="mt-6 text-3xl font-medium tracking-[-0.05em] text-[#e7e1d8]">Delusión Permanente</h2>
            <p className="mt-4 text-sm leading-7 text-[#96918a]">
              El proceso mediante el cual la simulación y la vivencia real se funden en una sola frecuencia. Las canciones no son meras descripciones: son coordenadas para habitar la Dimensión Zion.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
