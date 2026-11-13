/* Belentani / Judas — central concept page: tension through typography and space, not spectacle. */
import SiteShell from "@/components/SiteShell";

const fragments = [
  [
    "01",
    "The pact",
    "Judas is not the villain. Judas is the moment a system asks you to betray the version of yourself it can understand.",
  ],
  [
    "02",
    "The artifact",
    "Something is always carried across the threshold: a voice, a name, a file, a promise.",
  ],
  [
    "03",
    "The release",
    "The next sound arrives as evidence. Not as an answer.",
  ],
];

export default function Judas() {
  return (
    <SiteShell section="Archive 004 / Judas">
      <section
        className="page-frame"
        style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}
      >
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.25fr_0.75fr] lg:gap-24">
          <div className="fade-up">
            <div className="eyebrow">Archive 004 / Judas</div>
            <h1 className="display-title">
              The first
              <br />
              <em>betrayal.</em>
            </h1>
          </div>
          <div className="fade-up delay-1 lg:pt-20">
            <p className="body-copy">
              La traición es un acto de edición. Algo se corta, algo permanece y
              el relato cambia de dueño.
            </p>
            <div className="mt-10 border-t border-[var(--border)] pt-4">
              <span className="archive-label">Judas threshold</span>
              <div className="mt-5 h-1 bg-[#24211f]">
                <div className="h-1 w-[76%] bg-[#d8473f]" />
              </div>
              <div className="mt-3 flex justify-between font-mono text-xs text-[#96918a]">
                <span>0.00</span>
                <span>0.76 / active</span>
                <span>1.00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-28 border-t border-[var(--border)]">
          {fragments.map(([id, title, text]) => (
            <article
              key={id}
              className="grid grid-cols-[58px_1fr] gap-5 border-b border-[var(--border)] py-8 sm:grid-cols-[90px_0.7fr_1.3fr] sm:gap-10"
            >
              <span className="index-number">{id}</span>
              <h2 className="text-2xl font-medium tracking-[-0.05em] text-[#e7e1d8] sm:text-4xl">
                {title}
              </h2>
              <p className="col-start-2 max-w-[560px] text-base leading-7 text-[#96918a] sm:col-start-auto">
                {text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div className="archive-card">
            <span className="index-number">J / 001</span>
            <h2 className="mt-16 max-w-[320px] text-4xl font-medium leading-[0.95] tracking-[-0.06em] text-[#e7e1d8]">
              Welcome to the world of Judas.
            </h2>
          </div>
          <div className="manifesto-block">
            <p>
              “No estás entrando en un personaje. Estás entrando en el mecanismo
              que lo fabrica.”
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
