/* Belentani — Master Dossier & Universe Explorer */
import { useState } from "react";
import SiteShell from "@/components/SiteShell";
import { BELENTANI_MASTER_DOSSIER } from "@/data/belentaniMasterDossier";

export default function BelentaniUniverse() {
  const [activeTab, setActiveTab] = useState<"dossier" | "characters">(
    "dossier"
  );
  const [selectedChar, setSelectedChar] = useState(
    BELENTANI_MASTER_DOSSIER.characters[0]
  );

  return (
    <SiteShell section="Archive 011 / Master Dossier">
      <section
        className="page-frame"
        style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}
      >
        <div className="flex flex-col justify-between gap-10 border-b border-[var(--border)] pb-8 md:flex-row md:items-end">
          <div className="fade-up">
            <div className="eyebrow">Archive 011 / Master Corpus</div>
            <h1 className="section-title mt-7 max-w-[640px]">
              {BELENTANI_MASTER_DOSSIER.title}
            </h1>
            <p className="mono-copy mt-4 max-w-[500px] text-[#96918a]">
              {BELENTANI_MASTER_DOSSIER.subtitle}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("dossier")}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] transition-all ${
                activeTab === "dossier"
                  ? "bg-[#d8473f] text-[#e7e1d8]"
                  : "border border-[var(--border)] text-[#96918a] hover:text-[#e7e1d8]"
              }`}
            >
              Dossier & Capítulos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("characters")}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] transition-all ${
                activeTab === "characters"
                  ? "bg-[#d8473f] text-[#e7e1d8]"
                  : "border border-[var(--border)] text-[#96918a] hover:text-[#e7e1d8]"
              }`}
            >
              Personajes & Arquetipos
            </button>
          </div>
        </div>

        <div className="mt-12">
          <p className="body-copy max-w-[800px] text-lg text-[#c5bfb6]">
            {BELENTANI_MASTER_DOSSIER.overview}
          </p>
        </div>

        {activeTab === "dossier" ? (
          <div className="mt-16 space-y-20">
            {BELENTANI_MASTER_DOSSIER.chapters.map(ch => (
              <div
                key={ch.number}
                className="border-t border-[var(--border)] pt-12 grid grid-cols-1 lg:grid-cols-[0.4fr_1.6fr] gap-8"
              >
                <div>
                  <span className="font-mono text-xs text-[#d8473f] tracking-[0.15em]">
                    CAPÍTULO {ch.number}
                  </span>
                  <h2 className="mt-3 text-2xl font-medium tracking-[-0.04em] text-[#e7e1d8]">
                    {ch.title}
                  </h2>
                  <p className="mt-2 font-mono text-xs text-[#96918a]">
                    {ch.subtitle}
                  </p>
                </div>
                <div className="space-y-6">
                  {ch.text.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-base leading-relaxed text-[#c5bfb6]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.6fr]">
            <div className="space-y-4">
              {BELENTANI_MASTER_DOSSIER.characters.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedChar(c)}
                  className={`w-full border p-6 text-left transition-all ${
                    selectedChar.id === c.id
                      ? "border-[#d8473f] bg-[#141212]"
                      : "border-[var(--border)] bg-[#0d0d0d] hover:border-[#5f5b56]"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs text-[#96918a]">
                    <span>{c.role}</span>
                    <span className="text-[#d8473f]">●</span>
                  </div>
                  <h2 className="mt-3 text-xl font-medium tracking-[-0.04em] text-[#e7e1d8]">
                    {c.name}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-[#d8473f]">
                    {c.alias}
                  </p>
                </button>
              ))}
            </div>

            <div className="border border-[var(--border)] bg-[#101010] p-8 sm:p-12">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 font-mono text-xs text-[#96918a]">
                <span>Status: {selectedChar.status}</span>
                <div className="flex gap-1.5">
                  {selectedChar.traits.map(t => (
                    <span
                      key={t}
                      className="border border-[var(--border)] px-2 py-0.5 text-[10px] text-[#96918a]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="mt-8 text-3xl font-medium tracking-[-0.05em] text-[#e7e1d8] sm:text-4xl">
                {selectedChar.name}
              </h2>
              <p className="mt-2 font-mono text-sm text-[#d8473f]">
                {selectedChar.alias} — {selectedChar.role}
              </p>

              <div className="mt-8 space-y-6">
                {selectedChar.biography.map((bio, idx) => (
                  <p
                    key={idx}
                    className="text-base leading-relaxed text-[#c5bfb6]"
                  >
                    {bio}
                  </p>
                ))}
              </div>

              <div className="mt-12 border-t border-[var(--border)] pt-6 flex items-center justify-between font-mono text-xs text-[#96918a]">
                <span>Verified Canon Entry</span>
                <span className="text-[#d8473f]">Belentani Archive</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
