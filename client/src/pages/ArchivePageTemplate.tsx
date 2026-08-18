/* Belentani — Generic Template for the 20 Interconnected Archive Pages */
import SiteShell from "@/components/SiteShell"
import { TWENTY_PAGES_MAP, type ArchivePageMeta } from "@/data/twentyPagesIndex"
import { Link, useRoute } from "wouter"

export default function ArchivePageTemplate() {
  const [match, params] = useRoute("/archive/:pageId")
  const currentPath = match && params?.pageId ? `/archive/${params.pageId}` : "/archive/20-index"
  const page: ArchivePageMeta = TWENTY_PAGES_MAP.find(p => p.path === currentPath) || TWENTY_PAGES_MAP[0]

  return (
    <SiteShell section={`Archive / ${page.code}`} eyebrow={`Category: ${page.category}`}>
      <section className="page-frame" style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}>
        <div className="flex flex-col justify-between gap-8 border-b border-[var(--border)] pb-8 md:flex-row md:items-end">
          <div className="fade-up">
            <span className="archive-label text-[#d8473f]">NODE ID: {page.code} // {page.category.toUpperCase()}</span>
            <h1 className="section-title mt-4 max-w-[680px]">{page.title}</h1>
            <p className="mono-copy mt-4 max-w-[460px] text-[#96918a]">{page.subtitle}</p>
          </div>
          <div className="flex gap-3">
            <Link href={page.prevPath} className="editorial-button ghost text-xs px-3 py-1.5">← Prev Node</Link>
            <Link href={page.nextPath} className="editorial-button text-xs px-3 py-1.5">Next Node →</Link>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-[#e7e1d8]">
              {page.excerpt}
            </p>
            <p className="body-copy">
              Este nodo forma parte del corpus integral de Belentani dentro de la Dimensión Zion. Cada registro está enlazado de forma bidireccional para permitir la navegación orgánica por el pensamiento, la música y los arquetipos del sistema.
            </p>
            <div className="border-l border-[#d8473f] pl-6 py-2 my-8">
              <p className="font-mono text-sm text-[#c5bfb6]">
                “La arquitectura del archivo es inquebrantable; lo que no está registrado no pertenece al canon.”
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-6 border-t border-[var(--border)]">
              <Link href="/universe" className="editorial-button ghost">Master Dossier</Link>
              <Link href="/lore" className="editorial-button ghost">Lore Codex</Link>
              <Link href="/archive/20-index" className="editorial-button">Index Map (20)</Link>
            </div>
          </div>

          <div className="border border-[var(--border)] bg-[#101010] p-8 flex flex-col justify-between">
            <div>
              <span className="archive-label text-[#d8473f]">Node Interlink Directory</span>
              <h2 className="mt-4 text-xl font-medium tracking-[-0.03em] text-[#e7e1d8]">Nodos Cercanos</h2>
              <ul className="mt-6 space-y-3 font-mono text-xs">
                <li>
                  <Link href={page.prevPath} className="text-[#96918a] hover:text-[#d8473f] transition-colors">
                    ← {TWENTY_PAGES_MAP.find(p => p.path === page.prevPath)?.title || "Anterior"}
                  </Link>
                </li>
                <li>
                  <Link href={page.nextPath} className="text-[#e7e1d8] hover:text-[#d8473f] transition-colors">
                    → {TWENTY_PAGES_MAP.find(p => p.path === page.nextPath)?.title || "Siguiente"}
                  </Link>
                </li>
                <li className="pt-4 border-t border-[var(--border)]">
                  <Link href="/archive/20-index" className="text-[#d8473f] hover:underline">
                    Ver índice completo de las 20 páginas ↗
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mt-10 border-t border-[var(--border)] pt-4 font-mono text-[10px] text-[#96918a] flex justify-between">
              <span>BELENTANI ARCHIVE</span>
              <span className="text-[#d8473f]">VERIFIED ACTIVE</span>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
