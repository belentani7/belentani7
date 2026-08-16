/* Belentani / Judas — artist page as a restrained dossier, not a neon character sheet. */
import SiteShell from "@/components/SiteShell"

export default function TheArtist() {
  return (
    <SiteShell section="Archive 002 / Artist">
      <section className="page-frame" style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div className="fade-up">
            <div className="eyebrow">Archive 002 / Artist</div>
            <h1 className="section-title mt-7 max-w-[440px]">The person behind the signal.</h1>
            <p className="mono-copy mt-8 max-w-[300px]">Belentani is not a profile. It is a method for making the private audible.</p>
          </div>
          <div className="fade-up delay-1">
            <div className="manifesto-block">
              <p>“La traición también puede ser una arquitectura.”</p>
            </div>
            <p className="body-copy mt-10 max-w-[660px]">El proyecto nace en una zona de fricción: entre lo que el artista quiere decir, lo que una máquina puede devolver y lo que el público completa por su cuenta. La obra no intenta resolver esa tensión. La mantiene encendida.</p>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-12 border-t border-[var(--border)] pt-6 md:grid-cols-3">
          <div className="fade-up delay-1">
            <span className="index-number">01 / Voice</span>
            <h2 className="mt-5 text-2xl font-medium tracking-[-0.04em] text-[#e7e1d8]">Una voz sin género fijo.</h2>
            <p className="mt-4 text-sm leading-7 text-[#96918a]">Canción, spoken word, textura y ruido conviven sin pedir permiso para cambiar de forma.</p>
          </div>
          <div className="fade-up delay-2">
            <span className="index-number">02 / Image</span>
            <h2 className="mt-5 text-2xl font-medium tracking-[-0.04em] text-[#e7e1d8]">El símbolo no explica.</h2>
            <p className="mt-4 text-sm leading-7 text-[#96918a]">Cada imagen funciona como una pista. La lectura final siempre permanece abierta.</p>
          </div>
          <div className="fade-up delay-3">
            <span className="index-number">03 / Machine</span>
            <h2 className="mt-5 text-2xl font-medium tracking-[-0.04em] text-[#e7e1d8]">La herramienta tiene firma.</h2>
            <p className="mt-4 text-sm leading-7 text-[#96918a]">La IA no suplanta al artista: hace visible el diálogo entre intención, accidente y edición.</p>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="border-y border-[var(--border)] py-6">
            <div className="flex items-center justify-between">
              <span className="archive-label">Working statement</span>
              <span className="index-number">B / 01</span>
            </div>
            <p className="mt-8 max-w-[780px] text-3xl font-medium leading-[1.04] tracking-[-0.06em] text-[#e7e1d8] sm:text-5xl">No quiero una máscara más limpia. Quiero una máscara que deje ver el mecanismo.</p>
          </div>
          <div className="lg:pt-6">
            <span className="archive-label">Current state</span>
            <div className="mt-5 space-y-4">
              {["voice / calibrated", "image / unresolved", "archive / growing"].map((item) => (
                <div key={item} className="flex items-center justify-between border-b border-[var(--border)] pb-3 font-mono text-xs uppercase tracking-[0.08em] text-[#96918a]"><span>{item}</span><span className="text-[#d8473f]">●</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
