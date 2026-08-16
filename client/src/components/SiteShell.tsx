/* Belentani / Judas — shared black-box editorial shell. Keep navigation quiet, typographic and archival. */
import { useState } from "react"
import type { ReactNode } from "react"
import { Link, useLocation } from "wouter"

const navigation = [
  { href: "/artist", label: "Artist" },
  { href: "/music", label: "Music" },
  { href: "/studio", label: "Studio" },
  { href: "/judas", label: "Judas" },
  { href: "/portal", label: "Portal" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/skills", label: "Skills" },
]

interface SiteShellProps {
  children: ReactNode
  section?: string
  eyebrow?: string
}

export default function SiteShell({ children, section = "Archive 001", eyebrow = "Belentani / Judas" }: SiteShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [location] = useLocation()

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="brand-mark" onClick={() => setMenuOpen(false)}>
            <span className="brand-symbol" aria-hidden="true">B</span>
            <span className="brand-wordmark">BELENTANI</span>
          </Link>

          <div className="header-meta" aria-label="Project metadata">
            <span>{eyebrow}</span>
            <strong>{section}</strong>
          </div>

          <button
            type="button"
            className="mobile-menu-button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>

          <nav id="site-navigation" className="site-nav" data-open={menuOpen} aria-label="Primary navigation">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={location === item.href ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <span className="archive-label">BELENTANI — The Judas Era</span>
          <span className="archive-label">Human / Agent / Archive</span>
        </div>
      </footer>
    </div>
  )
}
