/* Belentani — 100-Step Audit View */
import SiteShell from "@/components/SiteShell"
import { AUDIT_100_BLOCKS } from "@/data/audit100Steps"

export default function Audit100View() {
  return (
    <SiteShell section="Archive 013 / 100-Step Audit">
      <section className="page-frame" style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}>
        <div className="flex flex-col justify-between gap-10 border-b border-[var(--border)] pb-8 md:flex-row md:items-end">
          <div className="fade-up">
            <div className="eyebrow">Archive 013 / Quality Protocol</div>
            <h1 className="section-title mt-7 max-w-[640px]">Revisión de 100 pasos y limpieza de archivo.</h1>
            <p className="mono-copy mt-4 max-w-[500px] text-[#96918a]">Protocolo de verificación exhaustiva en 10 bloques operativos.</p>
          </div>
          <div className="text-right">
            <span className="archive-label">Audit Status</span>
            <p className="mt-2 text-4xl font-medium tracking-[-0.05em] text-[#d8473f]">100 / 100 OK</p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {AUDIT_100_BLOCKS.map((block) => (
            <div key={block.blockNumber} className="border border-[var(--border)] bg-[#101010] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-[#96918a]">
                  <span className="text-[#d8473f]">BLOCK {block.blockNumber} / 10</span>
                  <span>Steps {block.stepsRange}</span>
                </div>
                <h2 className="mt-3 text-xl font-medium tracking-[-0.03em] text-[#e7e1d8]">{block.title}</h2>
                <p className="mt-2 text-sm text-[#b5afa7]">{block.objective}</p>
              </div>
              <div className="mt-6 border-t border-[var(--border)] pt-4 font-mono text-xs text-[#96918a]">
                <strong className="text-[#c5bfb6]">Criterio:</strong> {block.verificationCriteria}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  )
}
