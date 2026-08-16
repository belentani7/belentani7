/* Belentani / Judas — music page as a release index: no fake player, clear archive states. */
import SiteShell from "@/components/SiteShell"
import { Link } from "wouter"

const releases = [
  { id: "01", title: "Judas", type: "Next release", detail: "Single / first signal", state: "Preparing" },
  { id: "02", title: "Moral Binary", type: "Study 02", detail: "Voice / machine / pressure", state: "In progress" },
  { id: "03", title: "Artifact", type: "Study 01", detail: "A guardian keeps the code", state: "Archived" },
]

export default function Music() {
  return (
    <SiteShell section="Archive 003 / Music">
      <section className="page-frame" style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div className="fade-up">
            <div className="eyebrow">Archive 003 / Music</div>
            <h1 className="section-title mt-7 max-w-[500px]">Listen before the archive changes.</h1>
          </div>
          <div className="fade-up delay-1">
            <p className="body-copy max-w-[620px]">La música de Belentani no se presenta como una playlist cerrada. Cada pieza es una habitación: tiene una entrada, una tensión y una salida que puede cambiar con el tiempo.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="editorial-button">Notify me</Link>
              <a className="editorial-button ghost" href="mailto:studio@belentani.art">Request press file</a>
            </div>
          </div>
        </div>

        <div className="mt-24 border-t border-[var(--border)]">
          {releases.map((release) => (
            <article key={release.id} className="grid grid-cols-[70px_1fr_auto] gap-4 border-b border-[var(--border)] py-7 sm:grid-cols-[90px_1.2fr_1fr_auto] sm:items-center sm:gap-8">
              <span className="index-number">{release.id}</span>
              <div>
                <h2 className="text-3xl font-medium tracking-[-0.06em] text-[#e7e1d8] sm:text-5xl">{release.title}</h2>
                <p className="mt-2 text-sm text-[#96918a]">{release.type} · {release.detail}</p>
              </div>
              <span className="archive-label hidden sm:block">{release.state}</span>
              <span className="text-xl text-[#d8473f]">{release.state === "Archived" ? "↗" : "—"}</span>
            </article>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="border border-[var(--border)] bg-[#101010] p-6 sm:p-8">
            <span className="archive-label">Listening room</span>
            <h2 className="mt-8 max-w-[430px] text-4xl font-medium leading-[0.96] tracking-[-0.06em] text-[#e7e1d8]">The sound is not finished until it leaves you a question.</h2>
            <div className="mt-14 flex items-end gap-1 border-b border-[#7d181d] pb-3" aria-hidden="true">
              {[18, 34, 24, 52, 30, 44, 22, 66, 39, 28, 58, 32, 46, 24, 60, 36, 18, 50].map((height, index) => <span key={index} className="flex-1 bg-[#d8473f]" style={{ height: `${height}px`, opacity: index % 3 === 0 ? 0.6 : 0.9 }} />)}
            </div>
            <p className="mono-copy mt-4">01:15 — signal pending / no playback attached</p>
          </div>
          <div className="manifesto-block self-end">
            <p>“La canción es el lugar donde la máquina ya no puede fingir que no siente.”</p>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
