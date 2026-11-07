/* Belentani — Synthetic QA Panel View (50 verified profiles) */
import SiteShell from "@/components/SiteShell";
import { SYNTHETIC_PROFILES } from "@/data/syntheticQaPanel";

export default function SyntheticQaView() {
  const averageScore =
    SYNTHETIC_PROFILES.reduce((acc, p) => acc + p.score, 0) /
    SYNTHETIC_PROFILES.length;

  return (
    <SiteShell section="Archive 010 / Synthetic QA Panel">
      <section
        className="page-frame"
        style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}
      >
        <div className="flex flex-col justify-between gap-10 border-b border-[var(--border)] pb-8 md:flex-row md:items-end">
          <div className="fade-up">
            <div className="eyebrow">Archive 010 / QA Protocol</div>
            <h1 className="section-title mt-7 max-w-[620px]">
              Synthetic evaluation panel (50 profiles).
            </h1>
          </div>
          <div className="text-right">
            <span className="archive-label">Consensus score</span>
            <p className="mt-2 text-4xl font-medium tracking-[-0.05em] text-[#d8473f]">
              {averageScore.toFixed(1)} / 10
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SYNTHETIC_PROFILES.map(profile => (
            <div
              key={profile.id}
              className="border border-[var(--border)] bg-[#0f0f0f] p-6"
            >
              <div className="flex items-center justify-between font-mono text-xs text-[#96918a]">
                <span>
                  ID: #{profile.id} / {profile.age} yrs
                </span>
                <span className="text-[#d8473f] font-bold">
                  {profile.score}.0 / 10
                </span>
              </div>
              <h2 className="mt-3 text-lg font-medium tracking-[-0.03em] text-[#e7e1d8]">
                {profile.name}
              </h2>
              <p className="mt-1 font-mono text-xs text-[#d8473f]">
                {profile.niche} · {profile.device}
              </p>
              <p className="mt-4 text-xs leading-relaxed text-[#96918a]">
                {profile.feedback}
              </p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
