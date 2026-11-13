/* Belentani / Judas — skills page: practical registry treated as a clean studio index. */
import SiteShell from "@/components/SiteShell";

const skills = [
  [
    "01",
    "Planning with files",
    "Persistencia de planes, decisiones y contexto entre sesiones.",
    "Core / memory",
  ],
  [
    "02",
    "Context compression",
    "Resúmenes estructurados para proteger la señal y reducir ruido.",
    "Core / tokens",
  ],
  [
    "03",
    "Agent browser",
    "Exploración y verificación de interfaces con un flujo reproducible.",
    "Web / QA",
  ],
  [
    "04",
    "System architect",
    "Convierte una idea ambigua en módulos, contratos y entregables.",
    "Product / build",
  ],
  [
    "05",
    "Research desk",
    "Búsqueda, contraste y síntesis antes de tomar decisiones.",
    "Research / source",
  ],
  [
    "06",
    "Music workflow",
    "Ideas, MIDI, arreglos y producción como cadena de trabajo.",
    "Sound / studio",
  ],
  [
    "07",
    "Video workflow",
    "Preproducción, shot list, generación, edición y revisión.",
    "Image / motion",
  ],
  [
    "08",
    "Verification before completion",
    "No declarar terminado algo que no se ha probado.",
    "Quality / guardrail",
  ],
];

export default function Skills() {
  return (
    <SiteShell section="Archive 008 / Skills">
      <section
        className="page-frame"
        style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}
      >
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div className="fade-up">
            <div className="eyebrow">Archive 008 / Skills</div>
            <h1 className="section-title mt-7 max-w-[490px]">
              The studio is a system.
            </h1>
          </div>
          <div className="fade-up delay-1">
            <p className="body-copy">
              Este índice no vende una fantasía de autonomía. Ordena las
              capacidades que hacen que un proyecto creativo llegue a una
              entrega real: pensar, construir, verificar y dejar memoria.
            </p>
            <p className="mono-copy mt-6 max-w-[440px]">
              Registry mode / curated. A skill is useful when it makes a
              decision, a test or an output more reliable.
            </p>
          </div>
        </div>

        <div className="mt-24 border-t border-[var(--border)]">
          {skills.map(([id, title, description, category]) => (
            <article
              key={id}
              className="grid grid-cols-[55px_1fr] gap-4 border-b border-[var(--border)] py-6 sm:grid-cols-[80px_0.8fr_1.2fr_auto] sm:items-start sm:gap-8"
            >
              <span className="index-number">{id}</span>
              <h2 className="text-2xl font-medium tracking-[-0.05em] text-[#e7e1d8]">
                {title}
              </h2>
              <p className="col-start-2 max-w-[520px] text-sm leading-7 text-[#96918a] sm:col-start-auto">
                {description}
              </p>
              <span className="archive-label col-start-2 sm:col-start-auto">
                {category}
              </span>
            </article>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="archive-card">
            <span className="index-number">A / 01</span>
            <h2 className="mt-12 text-2xl font-medium tracking-[-0.04em] text-[#e7e1d8]">
              Plan before prompting.
            </h2>
            <p>
              Un objetivo pequeño y verificable ahorra más tokens que una
              conversación infinita.
            </p>
          </div>
          <div className="archive-card">
            <span className="index-number">A / 02</span>
            <h2 className="mt-12 text-2xl font-medium tracking-[-0.04em] text-[#e7e1d8]">
              Persist the decision.
            </h2>
            <p>
              El contexto importante vive en archivos de proyecto, no solo en la
              memoria de una sesión.
            </p>
          </div>
          <div className="archive-card">
            <span className="index-number">A / 03</span>
            <h2 className="mt-12 text-2xl font-medium tracking-[-0.04em] text-[#e7e1d8]">
              Verify the artifact.
            </h2>
            <p>
              Un build, una prueba y una revisión visual son parte del trabajo,
              no una formalidad.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
