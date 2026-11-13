/* Belentani — Awwwards 2,000 Criteria Protocol View */
import SiteShell from "@/components/SiteShell";
import { AWWWARDS_COMPETITION_PROTOCOL } from "@/data/awwwardsCriteria";

export default function AwwwardsProtocolView() {
  return (
    <SiteShell section="Archive 012 / Awwwards Protocol">
      <section
        className="page-frame"
        style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}
      >
        <div className="flex flex-col justify-between gap-10 border-b border-[var(--border)] pb-8 md:flex-row md:items-end">
          <div className="fade-up">
            <div className="eyebrow">Archive 012 / Competition Strategy</div>
            <h1 className="section-title mt-7 max-w-[640px]">
              {AWWWARDS_COMPETITION_PROTOCOL.title}
            </h1>
            <p className="mono-copy mt-4 max-w-[500px] text-[#96918a]">
              {AWWWARDS_COMPETITION_PROTOCOL.subtitle}
            </p>
          </div>
          <div className="text-right">
            <span className="archive-label">Project Target Score</span>
            <p className="mt-2 text-4xl font-medium tracking-[-0.05em] text-[#d8473f]">
              {AWWWARDS_COMPETITION_PROTOCOL.targetScore}
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {AWWWARDS_COMPETITION_PROTOCOL.dimensions.map(dim => (
            <div
              key={dim.id}
              className="border border-[var(--border)] bg-[#101010] p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-[#96918a]">
                  <span>Weight: {dim.weight} pts</span>
                  <span className="text-[#d8473f]">
                    {dim.subcriteriaCount} Sub-criteria
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#e7e1d8]">
                  {dim.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#96918a]">
                  {dim.description}
                </p>
              </div>
              <div className="mt-8 border-t border-[var(--border)] pt-4 flex flex-wrap gap-2">
                {dim.keyFocus.map(focus => (
                  <span
                    key={focus}
                    className="border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-[#c5bfb6]"
                  >
                    ✓ {focus}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
