/* Belentani / Judas — studio page: a clear creative workflow, not a fake generative demo. */
import { useState } from "react"
import SiteShell from "@/components/SiteShell"

const steps = ["Signal", "Structure", "Revision"]

export default function Studio() {
  const [brief, setBrief] = useState("")
  const [step, setStep] = useState(0)
  const [saved, setSaved] = useState(false)

  const saveBrief = () => {
    if (!brief.trim()) return
    localStorage.setItem("belentani-studio-brief", brief.trim())
    setSaved(true)
    setStep(1)
  }

  return (
    <SiteShell section="Studio / Working room">
      <section className="page-frame" style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
          <div className="fade-up"><div className="eyebrow">Studio / Working room</div><h1 className="section-title mt-7 max-w-[430px]">Turn the feeling into a brief.</h1><p className="mono-copy mt-8 max-w-[280px]">The studio does not promise an instant masterpiece. It gives the idea a structure that can survive revision.</p></div>
          <div className="fade-up delay-1">
            <div className="flex border-y border-[var(--border)] py-4">{steps.map((label, index) => <div key={label} className={`flex-1 font-mono text-xs uppercase tracking-[0.1em] ${index <= step ? "text-[#d8473f]" : "text-[#5f5b56]"}`}><span className="mr-2">0{index + 1}</span>{label}</div>)}</div>
            <label className="mt-12 block"><span className="archive-label">Creative signal</span><textarea value={brief} onChange={(event) => { setBrief(event.target.value); setSaved(false) }} rows={8} className="mt-4 w-full resize-y border border-[var(--border)] bg-[#101010] p-5 text-xl leading-relaxed text-[#e7e1d8] outline-none transition-colors placeholder:text-[#5f5b56] focus:border-[#d8473f]" placeholder="Write an emotion, a texture, a scene or a contradiction..." /></label>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><button type="button" className="editorial-button" onClick={saveBrief}>Save signal</button><span className="mono-copy">{saved ? "Signal stored locally / structure ready" : "No API call / no fake output"}</span></div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 border-t border-[var(--border)] pt-6 md:grid-cols-3">
          <div><span className="index-number">01 / Signal</span><p className="mt-5 text-lg leading-7 text-[#e7e1d8]">Captura una intuición sin exigirle todavía una forma final.</p></div>
          <div><span className="index-number">02 / Structure</span><p className="mt-5 text-lg leading-7 text-[#e7e1d8]">Convierte la intuición en una escena, una textura, un ritmo o una imagen.</p></div>
          <div><span className="index-number">03 / Revision</span><p className="mt-5 text-lg leading-7 text-[#e7e1d8]">Lo que se guarda puede volver a editarse. Nada se declara definitivo por defecto.</p></div>
        </div>
      </section>
    </SiteShell>
  )
}
