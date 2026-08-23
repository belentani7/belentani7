/* Belentani — definitive portrait-led homepage: the artist is the entrance, the archive is the depth. */
import SiteShell from "@/components/SiteShell";
import { Link } from "wouter";

const signals = [
  { label: "Universe", value: "Belentani / full canon", href: "/universe" },
  { label: "Sound", value: "Next transmission", href: "/music" },
  { label: "Archive", value: "Lore codex / open", href: "/lore" },
];

export default function Home() {
  return (
    <SiteShell
      section="Belentani / Full Universe"
      eyebrow="Belentani / Master Archive"
    >
      <section className="hero-stage page-frame">
        <div className="hero-rail" aria-hidden="true">
          <span>BE / 001</span>
          <span>THE ARTIST</span>
          <span>2026</span>
        </div>

        <div className="hero-copy">
          <div className="eyebrow">Belentani / official universe</div>
          <p className="hero-kicker">
            A living archive of sound, symbol and identity.
          </p>
          <h1 className="hero-title">
            <span>Belentani</span>
            <em>is the signal.</em>
          </h1>
          <p className="hero-description">
            Un proyecto musical y narrativo donde la persona, la máscara y la
            máquina comparten una misma frecuencia. El archivo crece por capas:
            canciones, personajes, rituales y decisiones que no caben en una
            sola página.
          </p>
          <div className="hero-actions">
            <Link href="/universe" className="editorial-button">
              Enter the universe
            </Link>
            <Link href="/artist" className="editorial-button ghost">
              Meet Belentani
            </Link>
          </div>
          <div className="hero-signal-line">
            <span className="signal-dot" />
            <span>ENTITY / ACTIVE</span>
            <span className="signal-rule" />
            <span>THE ARCHIVE IS OPEN</span>
          </div>
        </div>

        <div className="portrait-stage">
          <div className="portrait-topline">
            <span>PORTRAIT / 01</span>
            <span>CANON IMAGE</span>
          </div>
          <div className="portrait-frame">
            <img
              src="/manus-storage/belentani-portrait_c0ab5f2c.webp"
              alt="Retrato oficial de Belentani, archivo de identidad"
              className="portrait-image"
            />
            <div className="portrait-wash" aria-hidden="true" />
            <div className="portrait-caption">
              <span className="portrait-caption-index">B—01</span>
              <span>Belentani / human signal</span>
            </div>
          </div>
          <div className="portrait-note">
            The face is not a mask. The mask is the part that survives.
          </div>
        </div>
      </section>

      <section
        className="signal-grid page-frame"
        aria-label="Belentani archive signals"
      >
        <div className="signal-intro">
          <span className="archive-label">Three points of entry</span>
          <h2>La historia no termina en la portada.</h2>
        </div>
        <div className="signal-links">
          {signals.map((signal, index) => (
            <Link key={signal.href} href={signal.href} className="signal-card">
              <span className="index-number">0{index + 1}</span>
              <span className="signal-card-label">{signal.label}</span>
              <strong>{signal.value}</strong>
              <span className="signal-arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="manifesto-strip page-frame">
        <span className="archive-label">Belentani / proposition</span>
        <p>
          “No se trata de inventar otro personaje. Se trata de construir un
          universo capaz de sostenerlo.”
        </p>
        <Link href="/lore" className="editorial-link">
          Read the full dossier
        </Link>
      </section>
    </SiteShell>
  );
}
