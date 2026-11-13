#!/usr/bin/env node
/**
 * BELENTANI // BIO-MACHINE v4 — "THE BELENTANI EXPERIENCE"
 * glassmorphism + neón rojo + alive machine, data-driven.
 *
 * Genera:
 *   assets/bio-banner.svg        (hero 1200x660)
 *   assets/bio-banner-inline.txt (idéntico, para copiar/pegar)
 *   assets/vercel-deck.svg       (grid de 24 botones glass clickeables)
 *   assets/vercel-deck-inline.txt
 *   README.md                    (inyecta ambos SVG entre marcadores)
 *
 * Solo XML válido + SMIL: GitHub sanitiza <script>, <style> y style="".
 * Los ids van prefijados (h* hero, d* deck) para no colisionar al ir inline.
 * Uso: node scripts/banner-gen.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

/* ============ PALETA ============ */
const C = {
  W: 1200, H: 660,
  BG: "#05050a",
  RED: "#ff073a",
  RED_D: "#7a031c",
  PLASMA: "#ff5078",
  CYAN: "#00ffff",
  ICE: "#b4dcff",
  NEON: "#00ffc8",
  INK: "#eeedf2",
  MUT: "rgba(238,237,242,.56)",
  F1: "'Segoe UI','Space Grotesk',system-ui,sans-serif",
  F2: "'Consolas','JetBrains Mono',monospace",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ============ DATA ============ */
const META = {
  brand: ["THE BELENTANI", "EXPERIENCE"],
  status: "ALIVE MACHINE // RENDERING",
  lab: "NEURAL CORE · CONSCIOUSNESS ENGINE",
  role: "Neural Architect · Voice AI · Zero-Token Routing",
  geo: "L'Hospitalet, Barcelona — n. São Paulo",
  quant: "114 repos · 8 languages · ∞ archetypes",
  quote: "Fazer visível o que importa.",
};

const STREAMS = ["TYPE", "VOICE", "SHADER", "OS", "NET", "SONG", "LEARN", "BUILD", "SIGNAL", "GLITCH", "CORE", "LOOP"];

const LANGS = [
  "TypeScript", "Python", "Java", "Go", "JavaScript", "HTML", "CSS", "PowerShell",
  "React 19", "Next.js", "Astro", "Vite", "tRPC", "Node", "Express", "Drizzle", "MySQL",
  "Redis", "Three.js", "R3F", "GSAP", "Lenis", "RVC", "Applio", "Whisper", "Demucs",
  "Tone.js", "Claude Code", "Qwen Code", "OpenCode",
];

/* chips del hero (ecosistemas, URLs verificadas 2026-09-10) */
const ECOS = [
  ["NOIACORE", "https://belentani.vercel.app"],
  ["EXPERIENCE", "https://belentani-experience.vercel.app"],
  ["JUDAS", "https://judas-experience.vercel.app"],
  ["OMEGA", "https://belentani.vercel.app"],
  ["DUCK", "https://belentani7.github.io/heyduck/"],
  ["secure-t", "https://secure-t.vercel.app"],
  ["ManosAbiertas", "https://manosabiertas-seven.vercel.app"],
  ["CARQUIDEC", "http://www.belentani.es/"],
];

/* misiones del hero (cards clickeables) */
const MISSIONS = [
  ["NOIACORE LAB", "React 19 · tRPC · LLM", "LIVE", "https://noiacore-lab.vercel.app"],
  ["THE EXPERIENCE", "WebGL · Bloom · Cinematic", "3D", "https://belentani-experience.vercel.app"],
  ["nexus-os", "Neon Glass OS · 38+ apps", "ZERO DEPS", "https://belentani-experience.vercel.app"],
  ["meta-skill", "Zero-token routing", "16 archetypes", "https://belentani.vercel.app"],
  ["DUCK Ecosystem", "Astro · studio apps", "6 MODULES", "https://belentani7.github.io/heyduck/"],
  ["secure-t", "Cyber + AI Academy", "LIVE", "https://secure-t.vercel.app"],
];

/* red de partículas del hero */
const P1 = [[180, 120], [240, 180], [300, 320], [880, 330], [950, 130], [1010, 200], [520, 90], [700, 60], [110, 280], [1080, 290]];
const EDGES = [[0, 1], [0, 2], [1, 2], [4, 5], [4, 7], [5, 6], [6, 7], [3, 5], [3, 4], [0, 6], [8, 0], [9, 4]];

/* ============ DECK: 24 nodos verificados en producción ============ */
const TONES = { red: "#ff073a", green: "#00ffc8", cyan: "#00ffff" };

const NODES = [
  { name: "BELENTANI", desc: "Main hub · creative + education", host: "belentani.vercel.app", url: "https://belentani.vercel.app", tone: "red" },
  { name: "THE EXPERIENCE", desc: "WebGL · Bloom · Cinematic", host: "belentani-experience.vercel.app", url: "https://belentani-experience.vercel.app", tone: "red" },
  { name: "JUDAS", desc: "Bleeding-crystal storyboard", host: "judas-experience.vercel.app", url: "https://judas-experience.vercel.app", tone: "red" },
  { name: "JUDAS ACCESS", desc: "Ritual entry gate", host: "judas-access.vercel.app", url: "https://judas-access.vercel.app", tone: "red" },
  { name: "JUDAS WEB", desc: "Narrative web · chapters", host: "belentani-judas-web.vercel.app", url: "https://belentani-judas-web.vercel.app", tone: "red" },
  { name: "NOIACORE LAB", desc: "React 19 · tRPC · LLM", host: "noiacore-lab.vercel.app", url: "https://noiacore-lab.vercel.app", tone: "red" },
  { name: "BELENTANI V2", desc: "Next-gen shell", host: "belentani-v2.vercel.app", url: "https://belentani-v2.vercel.app", tone: "red" },
  { name: "PROFILE SHELL", desc: "Vite app · portfolio core", host: "belentani7-profile.vercel.app", url: "https://belentani7-profile.vercel.app", tone: "red" },
  { name: "SECURE-T", desc: "Cyber + AI academy", host: "secure-t.vercel.app", url: "https://secure-t.vercel.app", tone: "green" },
  { name: "SECURE-T UNIV", desc: "University portal", host: "secure-t-university.vercel.app", url: "https://secure-t-university.vercel.app", tone: "green" },
  { name: "OPEN SCHOOL", desc: "Open learning platform", host: "open-school · vercel.app", url: "https://open-school-belentani7pedro-6758s-projects.vercel.app", tone: "green" },
  { name: "UX ACADEMY", desc: "Professional UX track", host: "ux-academy · vercel.app", url: "https://ux-academy-professional-belentani7pedro-6758s-projects.vercel.app", tone: "green" },
  { name: "WILLIAM SCHOOL", desc: "School platform", host: "williamschool-livid.vercel.app", url: "https://williamschool-livid.vercel.app", tone: "green" },
  { name: "LINGUAFORGE", desc: "Language forge lab", host: "linguaforge-rouge.vercel.app", url: "https://linguaforge-rouge.vercel.app", tone: "green" },
  { name: "LINGUA ABERTA", desc: "Open language lab", host: "lingua-aberta · vercel.app", url: "https://lingua-aberta-belentani7pedro-6758s-projects.vercel.app", tone: "green" },
  { name: "MANOS ABIERTAS", desc: "Education + migration", host: "manosabiertas-seven.vercel.app", url: "https://manosabiertas-seven.vercel.app", tone: "green" },
  { name: "MANOS PSI", desc: "Care + support node", host: "manos-abiertas-psi.vercel.app", url: "https://manos-abiertas-psi.vercel.app", tone: "green" },
  { name: "SAAS PLASMA", desc: "Starter plasma kit", host: "saas-plasma · vercel.app", url: "https://saas-plasma-belentani7pedro-6758s-projects.vercel.app", tone: "cyan" },
  { name: "KEYROTOR", desc: "Key rotation engine", host: "keyrotor.vercel.app", url: "https://keyrotor.vercel.app", tone: "cyan" },
  { name: "NEXUS OPS", desc: "Machine ops console", host: "nexus-machine-ops · vercel.app", url: "https://nexus-machine-ops-belentani7pedro-6758s-projects.vercel.app", tone: "cyan" },
  { name: "DUCK HUB", desc: "Studio apps · music", host: "belentani7.github.io/heyduck", url: "https://belentani7.github.io/heyduck/", tone: "cyan" },
  { name: "SECURE-T PAGES", desc: "Cyber course · static", host: "belentani7.github.io/secure-t", url: "https://belentani7.github.io/secure-t/", tone: "cyan" },
  { name: "BELENTANI HUB", desc: "GitHub pages hub", host: "belentani7.github.io", url: "https://belentani7.github.io/", tone: "cyan" },
  { name: "JUDAS BUILD", desc: "BuildAI space deploy", host: "judas-experience-13898.buildaispace.app", url: "https://judas-experience-13898.buildaispace.app/", tone: "red" },
];

/* ============ HERO: DEFS ============ */
const heroDefs = `
  <linearGradient id="hGlass" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".085"/>
    <stop offset=".5" stop-color="#ffffff" stop-opacity=".028"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity=".012"/>
  </linearGradient>
  <linearGradient id="hGlassStroke" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".18"/>
    <stop offset=".45" stop-color="#ffffff" stop-opacity=".05"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity=".12"/>
  </linearGradient>
  <linearGradient id="hEdge" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset=".5" stop-color="#ffffff" stop-opacity=".38"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="hTube" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.RED}" stop-opacity="0"/>
    <stop offset=".5" stop-color="${C.RED}" stop-opacity=".9"/>
    <stop offset="1" stop-color="${C.RED}" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="hCore" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="${C.RED}" stop-opacity=".85"/>
    <stop offset=".55" stop-color="${C.RED}" stop-opacity=".16"/>
    <stop offset="1" stop-color="${C.RED}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="hNova" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".9"/>
    <stop offset=".35" stop-color="${C.RED}" stop-opacity=".45"/>
    <stop offset=".7" stop-color="${C.RED}" stop-opacity=".1"/>
    <stop offset="1" stop-color="${C.RED}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="hScanY" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.RED}" stop-opacity="0"/>
    <stop offset=".5" stop-color="${C.RED}" stop-opacity=".7"/>
    <stop offset="1" stop-color="${C.RED}" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="hShim" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.ICE}" stop-opacity="0"/>
    <stop offset=".5" stop-color="${C.ICE}" stop-opacity=".12"/>
    <stop offset="1" stop-color="${C.ICE}" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="hMem" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${C.RED}"/>
    <stop offset=".55" stop-color="${C.PLASMA}"/>
    <stop offset="1" stop-color="${C.CYAN}"/>
  </linearGradient>
  <filter id="hGlow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="hSoft" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="hBig" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="hGrain"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 6 -2"/></filter>
  <pattern id="hGrid" width="50" height="50" patternUnits="userSpaceOnUse">
    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="${C.RED}" stroke-opacity=".12" stroke-width="1"/>
  </pattern>`;

/* ============ HERO: FX (todo pointer-events="none" para no comerse los clicks) ============ */
const GLITCH_Y = [40, 96, 150, 208, 260, 330, 400, 470, 530, 590];
const glitchBands = GLITCH_Y.map((y, i) => `
  <g transform="translate(0,${y})" pointer-events="none">
    <rect width="1200" height="${i % 2 ? 3 : 5}" fill="${i % 3 === 0 ? C.CYAN : (i % 3 === 1 ? C.RED : C.PLASMA)}" opacity="0">
      <animate attributeName="opacity" values="0;0;0.5;0;0;0.9;0;0;0;0" keyTimes="0;0.015;0.02;0.03;0.31;0.315;0.32;0.33;0.92;1" dur="${6 + (i % 4)}s" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="translate" values="0 0;-22 0;14 0;0 0;0 0" keyTimes="0;0.02;0.025;0.03;1" dur="${6 + (i % 4)}s" repeatCount="indefinite"/>
    </rect>
  </g>`).join("");

const scanbar = `<g pointer-events="none"><rect x="0" y="0" width="1200" height="90" fill="url(#hScanY)">
  <animateTransform attributeName="transform" type="translate" from="0 -200" to="0 660" dur="4.5s" repeatCount="indefinite"/>
</rect></g>`;

const supernova = `<g transform="translate(600,300)">
  <circle r="0" fill="url(#hNova)">
    <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.955;0.965;1" dur="9s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale" values="0.5;0.5;1.5;2.4" keyTimes="0;0.955;0.97;1" dur="9s" repeatCount="indefinite"/>
  </circle>
  <circle r="0" fill="none" stroke="${C.ICE}" stroke-width="3" opacity="0">
    <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.955;0.98;1" dur="9s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale" values="0.4;0.4;1.2;3" keyTimes="0;0.955;0.99;1" dur="9s" repeatCount="indefinite"/>
  </circle>
</g>`;

const grain = `<rect width="1200" height="660" fill="#ffffff" filter="url(#hGrain)" opacity=".05" pointer-events="none">
  <animateTransform attributeName="transform" type="translate" values="0 0;-10 -14;14 9;-9 12;12 -8;-6 5" dur=".9s" repeatCount="indefinite"/>
</rect>`;

const ping = [0, 1.2, 2.4].map((d, i) => `<g transform="translate(600,300)" pointer-events="none">
  <circle r="0" fill="none" stroke="${i % 2 ? C.NEON : C.RED}" stroke-width="1.5" opacity="0">
    <animate attributeName="r" values="20;190" dur="3.6s" repeatCount="indefinite" begin="${d}s"/>
    <animate attributeName="opacity" values=".8;0" dur="3.6s" repeatCount="indefinite" begin="${d}s"/>
  </circle></g>`).join("");

const shimmer = `<g pointer-events="none">
  <polygon points="-300,-200 900,-200 1500,1400 300,1400" fill="url(#hShim)" opacity="0">
    <animate attributeName="opacity" values="0;0;.5;0;0" keyTimes="0;0.545;0.57;0.62;1" dur="5.5s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="translate" values="-1500 0;500 0" dur="5.5s" repeatCount="indefinite"/>
  </polygon></g>`;

/* ============ HERO: MÁQUINA ============ */
const halo = `<circle cx="600" cy="300" r="170" fill="url(#hCore)">
  <animate attributeName="r" values="150;186;150" dur="3s" repeatCount="indefinite"/></circle>`;

const rings = `<g transform="translate(600,300)" pointer-events="none">
  <circle r="196" fill="none" stroke="${C.RED}" stroke-opacity=".14" stroke-width="1" stroke-dasharray="4 14">
    <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="46s" repeatCount="indefinite"/>
  </circle>
  <circle r="166" fill="none" stroke="${C.CYAN}" stroke-opacity=".10" stroke-width="1" stroke-dasharray="2 10">
    <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="34s" repeatCount="indefinite"/>
  </circle>
  <circle r="136" fill="none" stroke="${C.RED}" stroke-opacity=".07" stroke-width="8" stroke-dasharray="60 240">
    <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="22s" repeatCount="indefinite"/>
  </circle>
</g>`;

const particles = P1.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 2 : 3}" fill="${C.RED}" opacity=".8">
  <animate attributeName="opacity" values=".8;.15;.8" dur="${1.5 + (i % 4) * .6}s" repeatCount="indefinite"/>
  <animate attributeName="cx" values="${x};${x + (i % 2 ? 14 : -14)};${x}" dur="${3 + i}s" repeatCount="indefinite"/>
  <animate attributeName="cy" values="${y};${y + ((i % 3) - 1) * 12};${y}" dur="${4 + i % 3}s" repeatCount="indefinite"/></circle>`).join("");

const edges = EDGES.map(([a, b], i) => `<line x1="${P1[a][0]}" y1="${P1[a][1]}" x2="${P1[b][0]}" y2="${P1[b][1]}" stroke="${C.RED}" stroke-width="1" stroke-opacity=".25">
  <animate attributeName="stroke-opacity" values="0;.35;0" dur="${2 + i % 3}s" repeatCount="indefinite"/></line>`).join("");

const glassPanel = `<g>
  <rect x="56" y="72" width="1088" height="472" rx="28" fill="${C.RED}" fill-opacity=".08" filter="url(#hBig)"/>
  <rect x="48" y="64" width="1104" height="488" rx="24" fill="url(#hGlass)" stroke="url(#hGlassStroke)" stroke-width="1.2"/>
  <line x1="76" y1="65" x2="1124" y2="65" stroke="url(#hEdge)" stroke-width="1.4"/>
  <path d="M 78 64 L 48 64 L 48 94" fill="none" stroke="${C.RED}" stroke-width="1.6" stroke-opacity=".7" filter="url(#hSoft)">
    <animate attributeName="stroke-opacity" values=".25;.8;.25" dur="3s" repeatCount="indefinite"/></path>
  <path d="M 1122 64 L 1152 64 L 1152 94" fill="none" stroke="${C.RED}" stroke-width="1.6" stroke-opacity=".7" filter="url(#hSoft)">
    <animate attributeName="stroke-opacity" values=".8;.25;.8" dur="3.4s" repeatCount="indefinite"/></path>
  <path d="M 48 522 L 48 552 L 78 552" fill="none" stroke="${C.RED}" stroke-width="1.6" stroke-opacity=".7" filter="url(#hSoft)">
    <animate attributeName="stroke-opacity" values=".6;.2;.6" dur="3.8s" repeatCount="indefinite"/></path>
  <path d="M 1152 522 L 1152 552 L 1122 552" fill="none" stroke="${C.RED}" stroke-width="1.6" stroke-opacity=".7" filter="url(#hSoft)">
    <animate attributeName="stroke-opacity" values=".2;.7;.2" dur="4.2s" repeatCount="indefinite"/></path>
  <g transform="translate(48,64)" pointer-events="none">
    <rect x="1.5" y="60" width="3" height="52" rx="1.5" fill="url(#hTube)" opacity=".5" filter="url(#hSoft)">
      <animate attributeName="y" values="40;424;40" dur="9s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".15;.6;.15" dur="9s" repeatCount="indefinite"/>
    </rect>
    <rect x="1102.5" y="400" width="3" height="40" rx="1.5" fill="url(#hTube)" opacity=".35" filter="url(#hSoft)">
      <animate attributeName="y" values="420;60;420" dur="11s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".1;.5;.1" dur="11s" repeatCount="indefinite"/>
    </rect>
  </g>
</g>`;

const topBar = `<g>
  <line x1="0" y1="54" x2="1200" y2="54" stroke="${C.RED}" stroke-opacity=".14"/>
  <text x="30" y="34" fill="${C.INK}" font-size="11" letter-spacing="3">BELENTANI@NOIACORE</text>
  <text x="264" y="34" fill="${C.PLASMA}" font-size="11" letter-spacing="2">${esc(META.status)}</text>
  <g font-size="10" letter-spacing="2" fill="${C.MUT}">
    ${STREAMS.map((s, i) => `<text x="${430 + i * 62}" y="34" opacity="0"><animate attributeName="opacity" values="0;1;0" begin="${i * 1.4}s" dur="${STREAMS.length * 1.4}s" repeatCount="indefinite"/><tspan fill="${i % 2 ? C.CYAN : C.PLASMA}">${s}</tspan>//</text>`).join("")}
  </g>
  <text x="1170" y="34" text-anchor="end" fill="${C.NEON}" font-size="11" letter-spacing="2">
    <tspan fill="${C.NEON}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>●</tspan> LIVE</text>
</g>`;

const heroTitle = `<g text-anchor="middle" font-family="${C.F1}">
  <g transform="translate(600,168)">
    <text x="-3" font-size="52" letter-spacing="10" fill="${C.CYAN}" opacity="0">${esc(META.brand[0])}
      <animate attributeName="opacity" values="0;0;.5;0;0;.55;0;0" keyTimes="0;.40;.42;.44;.70;.72;.74;1" dur="8s" repeatCount="indefinite"/></text>
    <text x="3" font-size="52" letter-spacing="10" fill="${C.RED}" opacity="0">${esc(META.brand[0])}
      <animate attributeName="opacity" values="0;0;0;.5;0;0;.55;0" keyTimes="0;.41;.43;.45;.71;.73;.75;1" dur="8s" repeatCount="indefinite"/></text>
    <text font-size="52" letter-spacing="10" fill="${C.INK}" filter="url(#hGlow)">${esc(META.brand[0])}
      <animate attributeName="fill-opacity" values="1;.82;1" dur="1.8s" repeatCount="indefinite"/></text>
  </g>
  <g transform="translate(600,236)">
    <text x="-3" font-size="52" letter-spacing="22" fill="${C.CYAN}" opacity="0">${esc(META.brand[1])}
      <animate attributeName="opacity" values="0;0;.45;0;0;.5;0;0" keyTimes="0;.20;.22;.24;.60;.62;.64;1" dur="9s" repeatCount="indefinite"/></text>
    <text x="3" font-size="52" letter-spacing="22" fill="${C.RED}" opacity="0">${esc(META.brand[1])}
      <animate attributeName="opacity" values="0;0;0;.45;0;0;.5;0" keyTimes="0;.21;.23;.25;.61;.63;.65;1" dur="9s" repeatCount="indefinite"/></text>
    <text font-size="52" letter-spacing="22" fill="${C.RED}" filter="url(#hGlow)">${esc(META.brand[1])}
      <animate attributeName="fill-opacity" values="1;.74;1" dur="1.5s" repeatCount="indefinite"/></text>
  </g>
</g>`;

const labLine = `<g transform="translate(600,270)">
  <rect x="-330" y="10" width="660" height="22" fill="${C.RED}" fill-opacity=".05"/>
  <text y="26" text-anchor="middle" font-family="${C.F2}" font-size="12" letter-spacing="5" fill="${C.PLASMA}">${esc(META.lab)}</text>
  <rect x="-420" y="21" width="200" height="2" fill="url(#hScanY)" pointer-events="none">
    <animateTransform attributeName="transform" type="translate" values="-360 0;420 0" dur="3s" repeatCount="indefinite"/>
  </rect>
</g>`;

const heroSub = `<g transform="translate(600,322)" text-anchor="middle">
  <text font-size="18" letter-spacing="4" fill="${C.RED}" filter="url(#hSoft)">${esc(META.role)}</text>
  <text y="26" font-size="12.5" letter-spacing="3" fill="${C.MUT}">${esc(META.geo)} · ${esc(META.quant)}</text>
</g>`;

const ecosPanel = `<g transform="translate(64,150)">
  <text x="0" y="0" font-size="12" letter-spacing="3" fill="${C.MUT}">ACTIVE ECOSYSTEMS</text>
  ${ECOS.map(([p, url], i) => `<a xlink:href="${url}" target="_blank">
  <g transform="translate(0,${12 + i * 40})">
    <animate attributeName="opacity" values=".35;1;.35" dur="${2 + i % 3 * 1.2}s" repeatCount="indefinite"/>
    <rect width="150" height="30" rx="8" fill="url(#hGlass)" stroke="url(#hGlassStroke)"/>
    <rect x="7" y="12" width="6" height="6" rx="3" fill="${C.RED}"><animate attributeName="opacity" values="1;.2;1" dur="${1.4 + i % 4 * .3}s" repeatCount="indefinite"/></rect>
    <text x="20" y="20" font-size="12" letter-spacing="2" font-family="${C.F1}" fill="${C.INK}">${esc(p)}</text></g></a>`).join("")}
</g>`;

const missionsPanel = `<g transform="translate(880,150)">
  ${MISSIONS.map(([n, s, st, url], i) => `<a xlink:href="${url}" target="_blank">
  <g transform="translate(0,${12 + i * 56})" opacity="0">
    <animate attributeName="opacity" values="0;1;1;0" begin="${i * 2.2}s" dur="13.2s" repeatCount="indefinite"/>
    <g>
      <animateTransform attributeName="transform" type="scale" values="1;1.015;1" dur="2.4s" repeatCount="indefinite"/>
      <rect width="264" height="52" rx="10" fill="url(#hGlass)" stroke="url(#hGlassStroke)"/>
      <rect width="264" height="52" rx="10" fill="none" stroke="${C.RED}" stroke-opacity=".22">
        <animate attributeName="stroke-opacity" values=".22;.7;.22" dur="2.4s" repeatCount="indefinite"/>
      </rect>
    </g>
    <circle cx="18" cy="26" r="5" fill="${C.RED}"><animate attributeName="opacity" values="1;.2;1" dur="1.2s" repeatCount="indefinite"/></circle>
    <text x="34" y="18" font-size="14" font-weight="bold" font-family="${C.F1}" fill="${C.INK}">${esc(n)}</text>
    <text x="34" y="38" font-size="11" font-family="${C.F2}" fill="${C.MUT}">${esc(s)} · <tspan fill="${C.RED}">${esc(st)}</tspan></text>
  </g></a>`).join("")}
</g>`;

const vitals = `<g transform="translate(396,392)">
  <text x="0" y="0" font-size="10" letter-spacing="3" fill="${C.MUT}">MACHINE VITALS</text>
  <g transform="translate(34,56)">
    <circle r="26" fill="none" stroke="#ffffff" stroke-opacity=".08" stroke-width="4.5"/>
    <path d="M 11.5 69 A 26 26 0 1 1 56.5 69" transform="translate(-34,-56)" fill="none" stroke="${C.RED}" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="109" filter="url(#hSoft)">
      <animate attributeName="stroke-dashoffset" values="109;34;76;109" dur="4.6s" repeatCount="indefinite"/>
    </path>
    <text x="0" y="4" text-anchor="middle" font-size="10" font-family="${C.F2}" fill="${C.INK}">CPU</text>
  </g>
  <g transform="translate(86,56)">
    ${[0, 1, 2, 3, 4].map(i => {
      const hs = [10 + i, 24 - i, 14 + i, 28 - i, 10 + i];
      const ys = hs.map(h => 30 - h);
      return `<rect x="${i * 11}" y="${ys[0]}" width="7" height="${hs[0]}" rx="1.5" fill="${C.NEON}" fill-opacity=".75">
      <animate attributeName="height" values="${hs.join(";")}" dur="${2.2 + i * .4}s" repeatCount="indefinite"/>
      <animate attributeName="y" values="${ys.join(";")}" dur="${2.2 + i * .4}s" repeatCount="indefinite"/>
    </rect>`;
    }).join("")}
    <line x1="0" y1="30" x2="55" y2="30" stroke="#ffffff" stroke-opacity=".12"/>
    <text x="27" y="44" text-anchor="middle" font-size="9" letter-spacing="1" fill="${C.MUT}">SIGNAL</text>
  </g>
  <g transform="translate(168,42)">
    <text x="0" y="0" font-size="9" letter-spacing="1" fill="${C.MUT}">MEM</text>
    <rect x="0" y="8" width="170" height="9" rx="3" fill="#ffffff" fill-opacity=".06" stroke="#ffffff" stroke-opacity=".08"/>
    <rect x="0" y="8" height="9" rx="3" fill="url(#hMem)" filter="url(#hSoft)">
      <animate attributeName="width" values="46;148;92;164;46" dur="6.4s" repeatCount="indefinite"/>
    </rect>
    <text x="0" y="34" font-size="9" font-family="${C.F2}" fill="${C.MUT}">VOICE · GPU · EDGE</text>
  </g>
  <g transform="translate(360,42)">
    <text x="0" y="0" font-size="9" letter-spacing="1" fill="${C.MUT}">TEMP</text>
    <text x="0" y="26" font-size="16" font-family="${C.F2}" fill="${C.CYAN}" opacity="0">42°<animate attributeName="opacity" values="1;1;0;0;0;0" keyTimes="0;.30;.34;.66;.72;1" dur="6s" repeatCount="indefinite"/></text>
    <text x="0" y="26" font-size="16" font-family="${C.F2}" fill="${C.CYAN}" opacity="0">44°<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.31;.35;.63;.67;1" dur="6s" repeatCount="indefinite"/></text>
    <text x="0" y="26" font-size="16" font-family="${C.F2}" fill="${C.CYAN}" opacity="0">41°<animate attributeName="opacity" values="0;0;0;0;1;1" keyTimes="0;.64;.68;.94;.98;1" dur="6s" repeatCount="indefinite"/></text>
  </g>
  <g transform="translate(420,42)">
    <text x="0" y="0" font-size="9" letter-spacing="1" fill="${C.MUT}">BPM</text>
    <text x="0" y="26" font-size="16" font-family="${C.F2}" fill="${C.RED}" filter="url(#hSoft)">128<animate attributeName="fill-opacity" values="1;.35;1" dur=".92s" repeatCount="indefinite"/></text>
  </g>
</g>`;

const ecg = `<g transform="translate(396,504)" pointer-events="none">
  <polyline points="0,0 34,0 42,-10 46,14 51,-24 56,26 61,0 100,0 134,0 142,-10 146,14 151,-24 156,26 161,0 200,0 234,0 242,-10 246,14 251,-24 256,26 261,0 300,0 334,0 342,-10 346,14 351,-24 356,26 361,0 398,0" fill="none" stroke="${C.RED}" stroke-width="1.5" stroke-linejoin="round" filter="url(#hSoft)" stroke-dasharray="760" stroke-dashoffset="760">
    <animate attributeName="stroke-dashoffset" values="760;0;0" keyTimes="0;.72;1" dur="5.6s" repeatCount="indefinite"/>
  </polyline>
</g>`;

const quoteW = META.quote.length * 7.2;
const quote = `<g transform="translate(600,540)" text-anchor="middle">
  <text font-size="16" font-style="italic" fill="${C.INK}" filter="url(#hSoft)">"${esc(META.quote)}"</text>
  <text x="${(quoteW / 2 + 6).toFixed(0)}" font-size="16" fill="${C.RED}">_<animate attributeName="opacity" values="1;0;1" dur=".8s" repeatCount="indefinite"/></text>
</g>`;

const marquee = `<g transform="translate(0,608)">
  <rect x="0" y="-20" width="1200" height="52" fill="${C.BG}" opacity=".97"/>
  <g><animateTransform attributeName="transform" type="translate" from="0 0" to="-${LANGS.join(" · ").length * 11} 0" dur="28s" repeatCount="indefinite"/>
   <text x="0" y="14" font-size="15" letter-spacing="3" fill="${C.NEON}" opacity=".85" filter="url(#hSoft)">${LANGS.map(esc).join("  ·  ")}  ·  ${LANGS.map(esc).join("  ·  ")}</text></g>
</g>`;

const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 660" width="1200" height="660" role="img" aria-label="The Belentani Experience — alive machine">
<defs>${heroDefs}</defs>
<rect width="1200" height="660" fill="${C.BG}"/>
<rect width="1200" height="660" fill="url(#hGrid)" opacity=".3" pointer-events="none"/>
<g transform="translate(0,470)" pointer-events="none">
  <g>
    <rect x="-200" y="0" width="1600" height="190" fill="url(#hGrid)" opacity=".9"/>
    <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -50" dur="1.6s" repeatCount="indefinite"/>
  </g>
</g>
${halo}${rings}${edges}${particles}
${supernova}${ping}${shimmer}${glitchBands}${scanbar}${grain}
${glassPanel}
${heroTitle}${labLine}${heroSub}
${ecosPanel}${missionsPanel}
${vitals}${ecg}${quote}
${marquee}
${topBar}
</svg>`;

/* ============ DECK: DEFS ============ */
const deckDefs = `
  <pattern id="dGrid" width="44" height="44" patternUnits="userSpaceOnUse">
    <path d="M 44 0 L 0 0 0 44" fill="none" stroke="${C.RED}" stroke-opacity=".07" stroke-width="1"/>
  </pattern>
  <linearGradient id="dGlass" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".075"/>
    <stop offset=".5" stop-color="#ffffff" stop-opacity=".025"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity=".01"/>
  </linearGradient>
  <linearGradient id="dGlassStroke" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".16"/>
    <stop offset=".5" stop-color="#ffffff" stop-opacity=".04"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity=".1"/>
  </linearGradient>
  <linearGradient id="dEdge" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset=".5" stop-color="#ffffff" stop-opacity=".3"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="dScanX" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${C.RED}" stop-opacity="0"/>
    <stop offset=".5" stop-color="${C.RED}" stop-opacity=".9"/>
    <stop offset="1" stop-color="${C.RED}" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="dScanY" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.RED}" stop-opacity="0"/>
    <stop offset=".5" stop-color="${C.RED}" stop-opacity=".5"/>
    <stop offset="1" stop-color="${C.RED}" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="dHalo" cx=".5" cy="0" r=".8">
    <stop offset="0" stop-color="${C.RED}" stop-opacity=".14"/>
    <stop offset="1" stop-color="${C.RED}" stop-opacity="0"/>
  </radialGradient>
  <filter id="dGlow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="dSoft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>`;

/* ============ DECK: BOTONES ============ */
const nodeBtn = (n, i) => {
  const col = i % 3, row = (i / 3) | 0;
  const x = 24 + col * 388, y = 108 + row * 88;
  const t = TONES[n.tone];
  const d = (i * 0.37).toFixed(2);
  return `<a xlink:href="${n.url}" target="_blank">
  <g transform="translate(${x},${y})">
    <rect x="-6" y="-6" width="388" height="88" rx="18" fill="${t}" fill-opacity=".045" filter="url(#dSoft)"/>
    <rect width="376" height="76" rx="14" fill="url(#dGlass)" stroke="url(#dGlassStroke)" stroke-width="1"/>
    <rect width="376" height="76" rx="14" fill="none" stroke="${t}" stroke-opacity=".12">
      <animate attributeName="stroke-opacity" values=".07;.34;.07" dur="${(3.4 + (i % 5) * .5).toFixed(1)}s" begin="${d}s" repeatCount="indefinite"/>
    </rect>
    <line x1="14" y1="1" x2="362" y2="1" stroke="url(#dEdge)" stroke-width="1"/>
    <circle cx="22" cy="24" r="4" fill="${t}">
      <animate attributeName="opacity" values="1;.2;1" dur="${(1.6 + (i % 4) * .25).toFixed(2)}s" begin="${d}s" repeatCount="indefinite"/>
    </circle>
    <circle cx="22" cy="24" r="4" fill="none" stroke="${t}" stroke-opacity=".5">
      <animate attributeName="r" values="5;13" dur="2.4s" begin="${d}s" repeatCount="indefinite"/>
      <animate attributeName="stroke-opacity" values=".5;0" dur="2.4s" begin="${d}s" repeatCount="indefinite"/>
    </circle>
    <text x="40" y="27" font-size="15" font-weight="bold" font-family="${C.F1}" fill="${C.INK}">${esc(n.name)}</text>
    <text x="40" y="47" font-size="11" font-family="${C.F2}" fill="${C.MUT}">${esc(n.desc)}</text>
    <text x="40" y="64" font-size="9.5" font-family="${C.F2}" fill="${t}" fill-opacity=".72">${esc(n.host)}</text>
    <text x="356" y="43" font-size="16" text-anchor="end" fill="${t}" fill-opacity=".75">→
      <animate attributeName="fill-opacity" values=".3;.9;.3" dur="2.8s" begin="${d}s" repeatCount="indefinite"/>
    </text>
  </g></a>`;
};

const deckH = 108 + Math.ceil(NODES.length / 3) * 88 + 52;
const deckSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 ${deckH}" width="1200" height="${deckH}" role="img" aria-label="Vercel deployment grid — 24 live nodes">
<defs>${deckDefs}</defs>
<rect width="1200" height="${deckH}" fill="${C.BG}"/>
<rect width="1200" height="${deckH}" fill="url(#dGrid)" opacity=".5" pointer-events="none"/>
<rect width="1200" height="300" fill="url(#dHalo)" pointer-events="none"/>
<g>
  <text x="32" y="46" font-size="24" font-weight="bold" font-family="${C.F1}" fill="${C.INK}" filter="url(#dGlow)">VERCEL // DEPLOYMENT GRID</text>
  <text x="32" y="68" font-size="11" font-family="${C.F2}" fill="${C.MUT}">${NODES.length} live nodes · 1 operator · THE BELENTANI EXPERIENCE</text>
  <circle cx="1080" cy="40" r="4" fill="${C.NEON}"><animate attributeName="opacity" values="1;.2;1" dur="1.4s" repeatCount="indefinite"/></circle>
  <text x="1168" y="45" text-anchor="end" font-size="14" letter-spacing="2" font-family="${C.F2}" fill="${C.NEON}">${NODES.length}/${NODES.length} ONLINE</text>
  <line x1="24" y1="86" x2="1176" y2="86" stroke="${C.RED}" stroke-opacity=".18"/>
</g>
<rect x="-160" y="85" width="160" height="2" fill="url(#dScanX)" opacity=".8" pointer-events="none">
  <animateTransform attributeName="transform" type="translate" values="0 0;1400 0" dur="5s" repeatCount="indefinite"/>
</rect>
<rect x="0" y="-140" width="1200" height="140" fill="url(#dScanY)" opacity=".4" pointer-events="none">
  <animateTransform attributeName="transform" type="translate" values="0 0;0 ${deckH + 140}" dur="7s" repeatCount="indefinite"/>
</rect>
${NODES.map(nodeBtn).join("")}
<line x1="24" y1="${deckH - 48}" x2="1176" y2="${deckH - 48}" stroke="${C.RED}" stroke-opacity=".16"/>
<text x="600" y="${deckH - 22}" text-anchor="middle" font-size="11" letter-spacing="3" font-family="${C.F2}" fill="${C.MUT}">ALL SYSTEMS NOMINAL · LAST SYNC 2026-09-10 · NOIACORE // BELENTANI</text>
</svg>`;

/* ============ BOTONES INDIVIDUALES (clickeables vía <a><img>) ============ */
const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const buttonSvg = (n, i) => {
  const t = TONES[n.tone];
  const d = ((i % 7) * 0.31).toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 376 76" width="376" height="76" role="img" aria-label="${esc(n.name)} — ${esc(n.desc)}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".075"/>
    <stop offset=".5" stop-color="#ffffff" stop-opacity=".025"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity=".01"/>
  </linearGradient>
  <linearGradient id="st" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".16"/>
    <stop offset=".5" stop-color="#ffffff" stop-opacity=".04"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity=".1"/>
  </linearGradient>
  <linearGradient id="ed" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset=".5" stop-color="#ffffff" stop-opacity=".3"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
  <filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2"/></filter>
</defs>
<rect width="376" height="76" rx="16" fill="#05050a"/>
<rect x="2" y="2" width="372" height="72" rx="14" fill="${t}" fill-opacity=".05" filter="url(#soft)"/>
<rect x="3" y="3" width="370" height="70" rx="13" fill="url(#bg)" stroke="url(#st)" stroke-width="1"/>
<rect x="3" y="3" width="370" height="70" rx="13" fill="none" stroke="${t}" stroke-opacity=".12">
  <animate attributeName="stroke-opacity" values=".08;.38;.08" dur="3.6s" begin="${d}s" repeatCount="indefinite"/>
</rect>
<line x1="18" y1="4" x2="358" y2="4" stroke="url(#ed)" stroke-width="1"/>
<circle cx="26" cy="25" r="4" fill="${t}">
  <animate attributeName="opacity" values="1;.2;1" dur="1.7s" begin="${d}s" repeatCount="indefinite"/>
</circle>
<circle cx="26" cy="25" r="4" fill="none" stroke="${t}" stroke-opacity=".5">
  <animate attributeName="r" values="5;13" dur="2.4s" begin="${d}s" repeatCount="indefinite"/>
  <animate attributeName="stroke-opacity" values=".5;0" dur="2.4s" begin="${d}s" repeatCount="indefinite"/>
</circle>
<text x="44" y="27" font-size="15" font-weight="bold" font-family="'Segoe UI',system-ui,sans-serif" fill="#eeedf2">${esc(n.name)}</text>
<text x="44" y="46" font-size="11" font-family="Consolas,'JetBrains Mono',monospace" fill="rgba(238,237,242,.56)">${esc(n.desc)}</text>
<text x="44" y="62" font-size="9.5" font-family="Consolas,'JetBrains Mono',monospace" fill="${t}" fill-opacity=".75">${esc(n.host)}</text>
<text x="360" y="41" font-size="16" text-anchor="end" fill="${t}" fill-opacity=".75">→
  <animate attributeName="fill-opacity" values=".3;.9;.3" dur="2.8s" begin="${d}s" repeatCount="indefinite"/>
</text>
</svg>`;
};

const deckHeaderSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 96" width="1200" height="96" role="img" aria-label="Vercel deployment grid">
<defs>
  <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
    <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#ff073a" stroke-opacity=".08" stroke-width="1"/>
  </pattern>
  <linearGradient id="scanx" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ff073a" stop-opacity="0"/>
    <stop offset=".5" stop-color="#ff073a" stop-opacity=".9"/>
    <stop offset="1" stop-color="#ff073a" stop-opacity="0"/>
  </linearGradient>
  <filter id="hglow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<rect width="1200" height="96" fill="#05050a"/>
<rect width="1200" height="96" fill="url(#grid)" opacity=".5"/>
<text x="28" y="46" font-size="24" font-weight="bold" font-family="'Segoe UI',system-ui,sans-serif" fill="#eeedf2" filter="url(#hglow)">VERCEL // DEPLOYMENT GRID</text>
<text x="28" y="70" font-size="11" font-family="Consolas,'JetBrains Mono',monospace" fill="rgba(238,237,242,.56)">${NODES.length} live nodes · 1 operator · THE BELENTANI EXPERIENCE</text>
<circle cx="1076" cy="40" r="4" fill="#00ffc8"><animate attributeName="opacity" values="1;.2;1" dur="1.4s" repeatCount="indefinite"/></circle>
<text x="1172" y="45" text-anchor="end" font-size="14" letter-spacing="2" font-family="Consolas,'JetBrains Mono',monospace" fill="#00ffc8">${NODES.length}/${NODES.length} ONLINE</text>
<line x1="24" y1="88" x2="1176" y2="88" stroke="#ff073a" stroke-opacity=".18"/>
<rect x="-160" y="87" width="160" height="2" fill="url(#scanx)" opacity=".8">
  <animateTransform attributeName="transform" type="translate" values="0 0;1400 0" dur="5s" repeatCount="indefinite"/>
</rect>
</svg>`;

/* ============ README: bloques (GitHub pela el SVG inline — se sirve como <img>) ============ */
const RAW = "https://raw.githubusercontent.com/belentani7/belentani7/main/assets";
const V = "?v=4";

const heroBlock = `<img src="${RAW}/bio-banner.svg${V}" alt="The Belentani Experience — alive machine" width="1200" />`;

const deckRows = [];
for (let r = 0; r < Math.ceil(NODES.length / 3); r++) {
  const cells = NODES.slice(r * 3, r * 3 + 3).map((n) =>
    `<td align="center"><a href="${n.url}"><img src="${RAW}/deck/${slugify(n.name)}.svg${V}" width="300" alt="${esc(n.name)} — ${esc(n.desc)}" /></a></td>`).join("\n");
  deckRows.push(`<tr>\n${cells}\n</tr>`);
}

const deckBlock = `<img src="${RAW}/deck-header.svg${V}" alt="Vercel deployment grid" width="1200" />

<table>
${deckRows.join("\n")}
</table>`;

/* ============ OUTPUT ============ */
function inject(file, start, end, payload) {
  const p = path.join(ROOT, file);
  const src = fs.readFileSync(p, "utf8");
  const s = src.indexOf(start);
  const e = src.indexOf(end);
  if (s === -1 || e === -1 || e < s) throw new Error(`marcadores ${start} .. ${end} no encontrados en ${file}`);
  const out = src.slice(0, s + start.length) + "\n" + payload + "\n" + src.slice(e);
  fs.writeFileSync(p, out);
}

const outDir = path.join(ROOT, "assets");
fs.writeFileSync(path.join(outDir, "bio-banner.svg"), heroSvg);
fs.writeFileSync(path.join(outDir, "bio-banner-inline.txt"), heroSvg);
fs.writeFileSync(path.join(outDir, "vercel-deck.svg"), deckSvg);
fs.writeFileSync(path.join(outDir, "vercel-deck-inline.txt"), deckSvg);
fs.writeFileSync(path.join(outDir, "deck-header.svg"), deckHeaderSvg);
const deckDir = path.join(outDir, "deck");
fs.mkdirSync(deckDir, { recursive: true });
NODES.forEach((n, i) => fs.writeFileSync(path.join(deckDir, `${slugify(n.name)}.svg`), buttonSvg(n, i)));

inject("README.md", "<!-- BELENTANI-HERO:START -->", "<!-- BELENTANI-HERO:END -->", heroBlock);
inject("README.md", "<!-- BELENTANI-DECK:START -->", "<!-- BELENTANI-DECK:END -->", deckBlock);

console.log(`OK hero   assets/bio-banner.svg — ${(heroSvg.length / 1024).toFixed(1)} KB (SMIL, servido como <img>) · ${STREAMS.length} streams · ${LANGS.length} langs · ${ECOS.length} ecos · ${MISSIONS.length} misiones`);
console.log(`OK deck   assets/deck-header.svg + ${NODES.length} botones en assets/deck/ (${NODES.filter(n => n.tone === "red").length} core · ${NODES.filter(n => n.tone === "green").length} edu · ${NODES.filter(n => n.tone === "cyan").length} labs)`);
console.log("OK README.md — hero <img> + grid clickeable inyectados entre marcadores");
