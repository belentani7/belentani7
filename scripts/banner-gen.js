#!/usr/bin/env node
/**
 * BELENTANI // NEURAL ARCHITECT — Bio banner generator
 * Compacto (variables + arrays) -> emite bio-banner.svg animado (SMIL, sin JS).
 * GitHub renderiza CSS/SMIL dentro de SVG referenciado como imagen.
 */

const C = {
  NEON: "#ff073a",
  RED_DARK: "#7a031c",
  BG: "#050505",
  TEXT: "#e6e6e6",
  MUT: "#888888",
  CYAN: "#00ffff",
  W: 1200,
  H: 640,
};

/* ============ DATA (variables — edita aqui) ============ */
const META = {
  status: "OMEGA_CLEAN // RENDERING",
  name: "BELENTANI",
  role: "Neural Architect · Voice AI · Zero-Token Routing",
  geo: "São Paulo ⇄ L'Hospitalet, Barcelona",
  quant: "109 repos · 8 languages · ∞ archetypes",
  quote: "Fazer visível o que importa.",
};

const LANGS = [
  "TypeScript", "Python", "Java", "Go", "JavaScript", "HTML", "CSS", "PowerShell",
  "React 19", "Next.js", "Astro", "Vite", "tRPC", "Node", "Express", "Drizzle",
  "MySQL", "Redis", "Three.js", "R3F", "GSAP", "Lenis", "RVC", "Applio",
  "Whisper", "Demucs", "Tone.js", "Claude Code", "Qwen Code", "OpenCode",
];

const MISSIONS = [
  ["NOIACORE LAB", "React 19 · tRPC · LLM", "LIVE"],
  ["meta-skill", "Zero-token routing", "16 archetypes"],
  ["nexus-os", "Neon Glass OS · 38+ apps", "ZERO DEPS"],
  ["secure-t", "Cyber + AI Academy", "LIVE"],
  ["DUCK Ecosystem", "Astro · studio apps", "6 MODULES"],
  ["Voice Clone", "RVC · Applio · Kaggle GPU", "47 stems"],
];

const PARTNERS = ["NOIACORE", "DUCK", "JUDAS", "OMEGA", "secure-t", "ManosAbiertas", "CARQUIDEC", "proofmesh"];

const P1 = [[180,120],[240,180],[300,320],[880,330],[950,130],[1010,200],[520,90],[700,60],[110,280],[1080,290]];
const EDGES = [[0,1],[0,2],[1,2],[4,5],[4,7],[5,6],[6,7],[3,5],[3,4],[0,6],[8,0],[9,4]];

/* ============ HELPERS ============ */
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const gradDefs = `
  <linearGradient id="neonG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.NEON}"/><stop offset="1" stop-color="${C.RED_DARK}"/>
  </linearGradient>
  <radialGradient id="coreG" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${C.NEON}" stop-opacity="0.9"/>
    <stop offset="0.6" stop-color="${C.NEON}" stop-opacity="0.15"/>
    <stop offset="1" stop-color="${C.NEON}" stop-opacity="0"/>
  </radialGradient>
  <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <pattern id="gridP" width="50" height="50" patternUnits="userSpaceOnUse">
    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="${C.NEON}" stroke-opacity="0.12" stroke-width="1"/>
  </pattern>`;

/* grid synthwave que se mueve */
const grid = `
  <g transform="translate(0,${C.H - 190})">
    <rect x="-200" y="0" width="1600" height="190" fill="url(#gridP)" opacity="0.9"/>
    <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -50" dur="1.6s" repeatCount="indefinite"/>
  </g>`;

/* halo central pulsante */
const halo = `
  <circle cx="${C.W / 2}" cy="250" r="170" fill="url(#coreG)">
    <animate attributeName="r" values="150;180;150" dur="3s" repeatCount="indefinite"/>
  </circle>`;

/* particulas + conexiones con fade de red */
const particles = P1.map(([x, y], i) => `
  <circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 3 : 2}" fill="${C.NEON}" opacity="0.8">
    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="${1.5 + (i % 4) * 0.6}s" repeatCount="indefinite"/>
    <animate attributeName="cx" values="${x};${x + (i % 2 ? 14 : -14)};${x}" dur="${3 + i}s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="${y};${y + ((i % 3) - 1) * 12};${y}" dur="${4 + i % 3}s" repeatCount="indefinite"/>
  </circle>`).join("");

const edges = EDGES.map(([a, b], i) => `
  <line x1="${P1[a][0]}" y1="${P1[a][1]}" x2="${P1[b][0]}" y2="${P1[b][1]}" stroke="${C.NEON}" stroke-width="1" stroke-opacity="0.25">
    <animate attributeName="stroke-opacity" values="0;0.35;0" dur="${2 + i % 3}s" repeatCount="indefinite"/>
  </line>`).join("");

/* badge estado con pulso */
const badge = `
  <g transform="translate(${C.W / 2},58)">
    <rect x="-160" y="-22" width="320" height="44" rx="4" fill="${C.BG}" stroke="${C.NEON}" stroke-opacity="0.5">
      <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
    </rect>
    <text x="0" y="5" text-anchor="middle" fill="${C.NEON}" font-size="14" letter-spacing="4">${esc(META.status)}</text>
  </g>`;

/* titulo glitch RGB */
const title = `
  <g transform="translate(${C.W / 2},225)" font-family="Arial Black, sans-serif">
    <text x="3" y="0" text-anchor="middle" font-size="92" letter-spacing="10" fill="${C.CYAN}" opacity="0.7">${esc(META.name)}
      <animate attributeName="opacity" values="0;0.7;0;0;0.7;0" dur="2.2s" repeatCount="indefinite"/>
    </text>
    <text x="-3" y="0" text-anchor="middle" font-size="92" letter-spacing="10" fill="${C.NEON}" opacity="0.8">${esc(META.name)}
      <animate attributeName="opacity" values="0;0;0.8;0;0.8;0" dur="3.1s" repeatCount="indefinite"/>
    </text>
    <text x="0" y="0" text-anchor="middle" font-size="92" letter-spacing="10" fill="${C.NEON}" filter="url(#glow)">${esc(META.name)}
      <animate attributeName="fill-opacity" values="1;0.75;1" dur="1.5s" repeatCount="indefinite"/>
    </text>
  </g>`;

/* subtitle + geo */
const subtitle = `
  <g transform="translate(${C.W / 2},282)">
    <text x="0" y="0" text-anchor="middle" fill="${C.NEON}" font-size="20" letter-spacing="5" filter="url(#soft)">${esc(META.role)}</text>
    <text x="0" y="30" text-anchor="middle" fill="${C.MUT}" font-size="14" letter-spacing="3">${esc(META.geo)} · ${esc(META.quant)}</text>
  </g>`;

/* marquee de lenguajes/scrolling */
const marquee = `
  <g transform="translate(0,${C.H - 52})">
    <rect x="0" y="-20" width="${C.W}" height="52" fill="${C.BG}" opacity="0.96"/>
    <g>
      <animateTransform attributeName="transform" type="translate" from="0 0" to="-${LANGS.join(" · ").length * 11} 0" dur="28s" repeatCount="indefinite"/>
      <text x="0" y="14" font-size="15" letter-spacing="3" fill="${C.NEON}" filter="url(#soft)">${LANGS.map(esc).join("  ·  ")}  ·  ${LANGS.map(esc).join("  ·  ")}</text>
    </g>
  </g>`;

/* carousel de misiones — panel derecho */
const missionsPanel = `
  <g transform="translate(890,150)">
    ${MISSIONS.map(([n, s, st], i) => `
      <g transform="translate(0,${i * 58})" opacity="0">
        <animate attributeName="opacity" values="0;1;1;0" begin="${i * 2.2}s" dur="13.2s" repeatCount="indefinite"/>
        <rect x="10" y="-16" width="270" height="52" rx="6" fill="#0a0a0a" stroke="${C.NEON}" stroke-opacity="0.22"/>
        <circle cx="24" cy="10" r="5" fill="${C.NEON}"><animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite"/></circle>
        <text x="40" y="0" fill="${C.TEXT}" font-size="16" font-weight="bold">${esc(n)}</text>
        <text x="40" y="20" fill="${C.MUT}" font-size="12">${esc(s)} · <tspan fill="${C.NEON}">${esc(st)}</tspan></text>
      </g>`).join("")}
  </g>`;

/* panel izquierdo: ecosystems */
const partnersPanel = `
  <g transform="translate(90,150)">
    <text x="0" y="0" fill="${C.MUT}" font-size="12" letter-spacing="3">ACTIVE ECOSYSTEMS</text>
    ${PARTNERS.map((p, i) => `
      <rect x="0" y="${12 + i * 40}" width="150" height="30" rx="4" fill="#0a0a0a" stroke="${C.NEON}" stroke-opacity="0.2">
        <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="${2.4 + i}s" repeatCount="indefinite"/>
      </rect>
      <text x="10" y="${32 + i * 40}" fill="#e6e6e6" font-size="13" letter-spacing="2">${esc(p)}</text>`).join("")}
  </g>`;

/* cinta de scanlines */
const scanlines = `
  <g opacity="0.12">
    <rect x="0" y="0" width="${C.W}" height="4" fill="#000"/>
    <rect x="0" y="8" width="${C.W}" height="2" fill="#000"/>
    <rect x="0" y="16" width="${C.W}" height="4" fill="#000"/>
    <rect x="0" y="24" width="${C.W}" height="2" fill="#000"/>
    <rect x="0" y="32" width="${C.W}" height="4" fill="#000"/>
  </g>`;

/* quote con cursor */
const quote = `
  <g transform="translate(${C.W / 2},${C.H - 92})">
    <text x="0" y="0" text-anchor="middle" fill="${C.TEXT}" font-size="17" font-style="italic" filter="url(#soft)">"${esc(META.quote)}"</text>
    <text x="${META.quote.length * 8 + 40}" y="0" fill="${C.NEON}" font-size="17">_
      <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite"/>
    </text>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${C.W} ${C.H}" width="${C.W}" height="${C.H}" font-family="Courier New, monospace">
<defs>${gradDefs}</defs>
<rect width="${C.W}" height="${C.H}" fill="${C.BG}"/>
${grid}${halo}${edges}${particles}${badge}${title}${subtitle}${partnersPanel}${missionsPanel}${marquee}${scanlines}${quote}
</svg>`;

require("fs").writeFileSync("assets/bio-banner.svg", svg);
console.log(`OK bio-banner.svg — ${(svg.length / 1024).toFixed(1)} KB, ${MISSIONS.length} missions, ${LANGS.length} langs, ${PARTNERS.length} ecosystems`);