/* Belentani / Judas — portal page as a quiet decision path with persistent local state. */
import { useState } from "react"
import SiteShell from "@/components/SiteShell"

const paths = [
  { id: "A", title: "Keep the name", text: "La identidad permanece visible. La máquina trabaja alrededor de ella." },
  { id: "B", title: "Give up the name", text: "El personaje toma el control del relato y el archivo cambia de autor." },
  { id: "C", title: "Leave it unresolved", text: "No se decide. La tensión se guarda como el único resultado honesto." },
]

export default function Portal() {
  const [selected, setSelected] = useState<string | null>(() => localStorage.getItem("belentani-portal-path"))

  const choosePath = (id: string) => {
    setSelected(id)
    localStorage.setItem("belentani-portal-path", id)
  }

  return (
    <SiteShell section="Archive 006 / Portal">
      <section className="page-frame" style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div className="fade-up"><div className="eyebrow">Archive 006 / Portal</div><h1 className="section-title mt-7 max-w-[470px]">Choose what the archive keeps.</h1></div>
          <div className="fade-up delay-1"><p className="body-copy">El Portal no diagnostica al visitante ni inventa una identidad. Solo registra una decisión y la convierte en una pequeña pieza de la mitología de Judas.</p><div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.1em] text-[#96918a]"><span className="h-2 w-2 bg-[#d8473f]" /> Local path persistence / active</div></div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-0 border-t border-[var(--border)] md:grid-cols-3">
          {paths.map((path) => (
            <button key={path.id} type="button" onClick={() => choosePath(path.id)} className={`group min-h-[280px] border-b border-[var(--border)] p-6 text-left transition-colors md:border-b-0 md:border-r md:p-8 ${selected === path.id ? "bg-[#7d181d]" : "hover:bg-[#121212]"}`} aria-pressed={selected === path.id}>
              <div className="flex items-start justify-between"><span className={`index-number ${selected === path.id ? "text-[#e7e1d8]" : ""}`}>{path.id}</span><span className={`text-xl ${selected === path.id ? "text-[#e7e1d8]" : "text-[#d8473f]"}`}>{selected === path.id ? "✓" : "↗"}</span></div>
              <h2 className="mt-24 text-3xl font-medium leading-[0.95] tracking-[-0.06em] text-[#e7e1d8]">{path.title}</h2>
              <p className={`mt-4 text-sm leading-6 ${selected === path.id ? "text-[#f4efe8]/75" : "text-[#96918a]"}`}>{path.text}</p>
            </button>
          ))}
        </div>

        <div className="mt-20 max-w-[720px] border-l border-[#d8473f] pl-6">
          <span className="archive-label">Portal response</span>
          <p className="mt-5 text-3xl font-medium leading-[1.05] tracking-[-0.06em] text-[#e7e1d8] sm:text-5xl">{selected ? "No estás solo en tu traición." : "Elige una puerta. La máquina esperará."}</p>
          <p className="mono-copy mt-6">{selected ? `Local path registered: ${selected} / the archive will remember.` : "No path registered / waiting for an intentional gesture."}</p>
        </div>
      </section>
    </SiteShell>
  )
}
