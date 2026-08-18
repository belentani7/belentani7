/* Belentani — Master Index of the 20 Interconnected Pages */
import SiteShell from "@/components/SiteShell"
import { TWENTY_PAGES_MAP } from "@/data/twentyPagesIndex"
import { Link } from "wouter"

export default function ArchiveIndexView() {
  return (
    <SiteShell section="Archive 20 / Master Map" eyebrow="Belentani / Interconnected Network">
      <section className="page-frame" style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}>
        <div className="flex flex-col justify-between gap-10 border-b border-[var(--border)] pb-8 md:flex-row md:items-end">
          <div className="fade-up">
            <div className="eyebrow">Archive 20 / Network Index</div>
            <h1 className="section-title mt-7 max-w-[640px]">Las 20 páginas interconectadas del archivo.</h1>
            <p className="mono-copy mt-4 max-w-[500px] text-[#96918a]">Mapa maestro de navegación cruzada por todo el universo Belentani.</p>
          </div>
          <div className="text-right">
            <span className="archive-label">Total Nodes</span>
            <p className="mt-2 text-4xl font-medium tracking-[-0.05em] text-[#d8473f]">20 / 20 Active</p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TWENTY_PAGES_MAP.map((page) => (
            <Link key={page.path} href={page.path} className="border border-[var(--border)] bg-[#101010] p-6 transition-all hover:border-[#d8473f] block group">
              <div className="flex items-center justify-between font-mono text-xs text-[#96918a]">
                <span className="text-[#d8473f]">{page.code}</span>
                <span>{page.category}</span>
              </div>
              <h2 className="mt-4 text-lg font-medium tracking-[-0.03em] text-[#e7e1d8] group-hover:text-[#d8473f] transition-colors">{page.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-[#96918a] line-clamp-2">{page.excerpt}</p>
              <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-3 font-mono text-[10px] text-[#96918a]">
                <span>Node link</span>
                <span className="text-[#d8473f] transition-transform group-hover:translate-x-1">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  )
}
