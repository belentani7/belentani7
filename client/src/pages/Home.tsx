/* Belentani / Judas — black-box editorial homepage: quiet black field, oxide red signal, asymmetric release dossier. */
import { useState } from "react"
import { Link } from "wouter"
import SiteShell from "@/components/SiteShell"

const terminalLines = [
  "> SYSTEM CORE / BELENTANI NODE",
  "> [ok] archive mounted: JUDAS",
  "> [ok] human / agent signature: shared",
  "> [--] standard parameters bypassed",
  "> [!!] moral binary: unavailable",
  "> threshold: 0.76 / active",
]

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false)

  return (
    <SiteShell section="Next release / Judas">
      <section className="page-frame" style={{ paddingTop: "clamp(4.5rem, 11vw, 9rem)" }}>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:gap-24">
          <div className="fade-up">
            <div className="eyebrow">Next release / Judas</div>
            <h1 className="display-title">A new sound<br /><em>is coming.</em></h1>
            <p className="body-copy mt-8 max-w-[480px]">
              BELENTANI trabaja entre la canción, el símbolo y la máquina. Judas no es un personaje: es el archivo de una decisión que todavía no termina.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/music" className="editorial-button">Enter the archive</Link>
              <Link href="/studio" className="editorial-button ghost">Try AI studio</Link>
            </div>
            <div className="mt-14 grid max-w-[560px] grid-cols-2 gap-8 border-t border-[var(--border)] pt-4 sm:grid-cols-3">
              <div>
                <span className="archive-label">Status</span>
                <p className="mt-2 text-sm text-[#e7e1d8]">Entity active</p>
              </div>
              <div>
                <span className="archive-label">Format</span>
                <p className="mt-2 text-sm text-[#e7e1d8]">Sound / image / ritual</p>
              </div>
              <div>
                <span className="archive-label">Edition</span>
                <p className="mt-2 text-sm text-[#e7e1d8]">001 / Judas</p>
              </div>
            </div>
          </div>

          <div className="fade-up delay-1 lg:pt-12">
            <div className="relative min-h-[430px] overflow-hidden border border-[var(--border)] bg-[#101010] p-6 sm:min-h-[520px]">
              <div className="absolute inset-0 opacity-60" aria-hidden="true">
                <div className="absolute left-[18%] top-[13%] h-[68%] w-px bg-[#7d181d]" />
                <div className="absolute left-[18%] top-[13%] h-px w-[58%] bg-[#7d181d]" />
                <div className="absolute bottom-[18%] right-[12%] h-px w-[52%] bg-[#d8473f]" />
                <div className="absolute right-[20%] top-[20%] h-44 w-44 rounded-full border border-[#7d181d] sm:h-64 sm:w-64" />
                <div className="absolute right-[26%] top-[27%] h-32 w-32 rounded-full border border-[#d8473f]/40 sm:h-48 sm:w-48" />
                <div className="absolute bottom-[16%] left-[18%] h-20 w-20 border border-[#e7e1d8]/20" />
              </div>
              <div className="relative flex h-full min-h-[378px] flex-col justify-between sm:min-h-[468px]">
                <div className="flex items-start justify-between">
                  <span className="index-number">01—05</span>
                  <span className="archive-label">Verified global artist</span>
                </div>
                <div>
                  <span className="archive-label">The Judas Era</span>
                  <h2 className="mt-3 max-w-[280px] text-5xl font-medium leading-[0.9] tracking-[-0.07em] text-[#e7e1d8] sm:text-7xl">Judas</h2>
                  <p className="mono-copy mt-5 max-w-[250px]">The first betrayal is always a design problem.</p>
                </div>
                <div className="flex items-end justify-between border-t border-[var(--border)] pt-4">
                  <span className="archive-label">Belentani + Manus</span>
                  <span className="index-number">2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-28 grid grid-cols-1 gap-12 border-t border-[var(--border)] pt-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="fade-up delay-2">
            <span className="archive-label">The entry point</span>
            <p className="mt-4 max-w-[260px] text-2xl font-medium leading-tight tracking-[-0.05em] text-[#e7e1d8]">No hay una historia detrás de Judas. Hay una puerta.</p>
          </div>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
            <Link href="/artist" className="archive-card group sm:border-l sm:border-l-[var(--border)] sm:pl-5">
              <span className="index-number">01 / Artist</span>
              <h3 className="mt-10">The artist</h3>
              <p>La persona, la máscara y la decisión de firmar con una máquina.</p>
              <span className="mt-6 inline-block text-[#d8473f] transition-transform group-hover:translate-x-1">↗</span>
            </Link>
            <Link href="/music" className="archive-card group sm:border-l sm:border-l-[var(--border)] sm:pl-5">
              <span className="index-number">02 / Sound</span>
              <h3 className="mt-10">Music</h3>
              <p>Un archivo sonoro que cambia de forma cuando lo escuchas.</p>
              <span className="mt-6 inline-block text-[#d8473f] transition-transform group-hover:translate-x-1">↗</span>
            </Link>
            <Link href="/portal" className="archive-card group sm:border-l sm:border-l-[var(--border)] sm:pl-5">
              <span className="index-number">03 / Portal</span>
              <h3 className="mt-10">Enter</h3>
              <p>Tu recorrido deja una marca. La máquina la conserva.</p>
              <span className="mt-6 inline-block text-[#d8473f] transition-transform group-hover:translate-x-1">↗</span>
            </Link>
          </div>
        </div>

        <div className="mt-28 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-end">
          <div>
            <div className="eyebrow">System core terminal</div>
            <h2 className="section-title mt-6 max-w-[540px]">The machine is listening.</h2>
            <p className="body-copy mt-6">Una terminal pequeña, deliberadamente incompleta. Sirve para entrar en el lenguaje del proyecto, no para fingir una inteligencia que la interfaz no necesita.</p>
            <button type="button" className="editorial-button ghost mt-8" onClick={() => setTerminalOpen((open) => !open)} aria-expanded={terminalOpen}>
              {terminalOpen ? "Close terminal" : "Open terminal"}
            </button>
          </div>
          <div className="terminal-panel">
            <header><span>JUDAS / CORE</span><span>LIVE</span></header>
            <pre>{terminalLines.map((line, index) => <span key={line} className={index === terminalLines.length - 1 ? "terminal-command" : "block"}>{line}{"\n"}</span>)}{terminalOpen && <span className="terminal-command">{"> awaiting command: /init_judas\n"}</span>}</pre>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
