/* Belentani / Judas — gallery as a contact sheet: monochrome studies with one red signal. */
import SiteShell from "@/components/SiteShell"

const studies = [
  { id: "G—01", title: "The guardian", note: "Portrait study / 2026", tone: "light" },
  { id: "G—02", title: "Artifact protocol", note: "Object study / 2026", tone: "dark" },
  { id: "G—03", title: "A room for Judas", note: "Space study / 2026", tone: "red" },
  { id: "G—04", title: "After the signal", note: "Frame study / 2026", tone: "line" },
]

export default function Gallery() {
  return (
    <SiteShell section="Archive 005 / Gallery">
      <section className="page-frame" style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}>
        <div className="flex flex-col justify-between gap-10 border-b border-[var(--border)] pb-8 md:flex-row md:items-end">
          <div className="fade-up"><div className="eyebrow">Archive 005 / Gallery</div><h1 className="section-title mt-7 max-w-[590px]">Images from the room behind the room.</h1></div>
          <p className="mono-copy max-w-[260px] fade-up delay-1">A contact sheet of fragments. The complete image is intentionally withheld.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2">
          {studies.map((study, index) => (
            <article key={study.id} className={`group ${index % 2 === 1 ? "sm:mt-24" : ""}`}>
              <div className={`relative aspect-[4/5] overflow-hidden border border-[var(--border)] bg-[#121212] ${study.tone === "light" ? "bg-[#d5d0c9]" : ""} ${study.tone === "red" ? "bg-[#421113]" : ""}`}>
                <div className="absolute inset-[12%] border border-[#e7e1d8]/20" />
                <div className="absolute left-[26%] top-[18%] h-[54%] w-[1px] bg-[#d8473f]" />
                <div className={`absolute left-[33%] top-[24%] h-40 w-40 rounded-full border ${study.tone === "light" ? "border-[#0b0b0b]/40" : "border-[#e7e1d8]/30"} sm:h-56 sm:w-56`} />
                {study.tone === "dark" && <div className="absolute bottom-[17%] right-[18%] h-28 w-28 border border-[#7d181d]" />}
                {study.tone === "red" && <div className="absolute bottom-[18%] left-[19%] h-20 w-20 border border-[#d8473f]" />}
                {study.tone === "line" && <div className="absolute bottom-[22%] left-[12%] right-[12%] h-px bg-[#d8473f]" />}
                <span className={`absolute bottom-5 left-5 font-mono text-xs uppercase tracking-[0.12em] ${study.tone === "light" ? "text-[#0b0b0b]/60" : "text-[#e7e1d8]/60"}`}>{study.id}</span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4"><div><h2 className="text-xl font-medium tracking-[-0.04em] text-[#e7e1d8]">{study.title}</h2><p className="mt-1 text-sm text-[#96918a]">{study.note}</p></div><span className="text-xl text-[#d8473f] transition-transform group-hover:translate-x-1">↗</span></div>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  )
}
