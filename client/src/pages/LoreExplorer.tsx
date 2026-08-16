/* Belentani — Lore Explorer: immersive browsing of the complete mythological corpus. */
import { useState } from "react"
import SiteShell from "@/components/SiteShell"
import { LORE_DATABASE, type LoreNode } from "@/data/loreDatabase"

const categories = ["All", "Cosmology", "Characters", "Eras", "Artifacts", "Philosophy"] as const

export default function LoreExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>("All")
  const [activeNode, setActiveNode] = useState<LoreNode>(LORE_DATABASE[0])

  const filtered = selectedCategory === "All" ? LORE_DATABASE : LORE_DATABASE.filter(n => n.category === selectedCategory)

  return (
    <SiteShell section="Archive / Lore Codex">
      <section className="page-frame" style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}>
        <div className="flex flex-col justify-between gap-10 border-b border-[var(--border)] pb-8 md:flex-row md:items-end">
          <div className="fade-up">
            <div className="eyebrow">Archive 009 / Lore Codex</div>
            <h1 className="section-title mt-7 max-w-[580px]">The complete mythology of Belentani.</h1>
          </div>
          <p className="mono-copy max-w-[320px] fade-up delay-1">
            Este archivo contiene el corpus mitológico completo. Cada nodo documenta una capa de la Dimensión Zion, sus personajes y sus eras.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 border-b border-[var(--border)] pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] transition-colors ${
                selectedCategory === cat
                  ? "bg-[#d8473f] text-[#e7e1d8]"
                  : "border border-[var(--border)] text-[#96918a] hover:text-[#e7e1d8]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div className="space-y-4">
            {filtered.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => setActiveNode(node)}
                className={`w-full border p-6 text-left transition-all ${
                  activeNode.id === node.id
                    ? "border-[#d8473f] bg-[#141212]"
                    : "border-[var(--border)] bg-[#0d0d0d] hover:border-[#5f5b56]"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs text-[#96918a]">
                  <span>{node.category}</span>
                  <span className="text-[#d8473f]">●</span>
                </div>
                <h2 className="mt-3 text-xl font-medium tracking-[-0.04em] text-[#e7e1d8]">{node.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#96918a] line-clamp-2">{node.summary}</p>
              </button>
            ))}
          </div>

          <div className="border border-[var(--border)] bg-[#101010] p-8 sm:p-10">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <span className="archive-label">{activeNode.category} / Node ID: {activeNode.id}</span>
              <div className="flex gap-1.5">
                {activeNode.tags.map(tag => (
                  <span key={tag} className="border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] text-[#96918a]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <h2 className="mt-8 text-3xl font-medium tracking-[-0.05em] text-[#e7e1d8] sm:text-4xl">
              {activeNode.title}
            </h2>

            <div className="mt-8 space-y-6">
              {activeNode.content.map((paragraph, idx) => (
                <p key={idx} className="text-base leading-relaxed text-[#c5bfb6]">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 border-t border-[var(--border)] pt-6 flex items-center justify-between font-mono text-xs text-[#96918a]">
              <span>Verified transmission</span>
              <span className="text-[#d8473f]">Belentani Archive</span>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
