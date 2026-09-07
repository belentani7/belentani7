#!/usr/bin/env node
/**
 * BELENTANI // BIO-BANNER v3 — generador compacto, data-driven.
 * FX portados del NOIACORE enhanced.html a SVG nativo + SMIL:
 * glitch-screen (RGB bands), scan, supernova, film grain, ping, shimmer, decode.
 * SMIL CORRE DENTRO DE <img> en GitHub. Cero <div>/JS — solo XML válido.
 * Edita VARIABLES -> `node scripts/banner-gen.js`
 */

const C = {
  W: 1200, H: 640,
  BG: "#040406",
  RED: "#ff073a",
  RED_D: "#7a031c",
  CYAN: "#00ffff",
  PLASMA: "#ff5078",
  ICE: "#b4dcff",
  NEON: "#00ffc8",
  INK: "#eeedf2",
  MUT: "rgba(238,237,242,.56)",
  F1: "'Segoe UI','Space Grotesk',system-ui,sans-serif",
  F2: "'Consolas','JetBrains Mono',monospace",
};

/* ============ DATA (variables) ============ */
const META = {
  status: "OMEGA_CLEAN // RENDERING",
  name: "BELENTANI",
  role: "Neural Architect · Voice AI · Zero-Token Routing",
  geo: "L'Hospitalet, Barcelona — n. São Paulo",
  quant: "109 repos · 8 languages · ∞ archetypes",
  quote: "Fazer visível o que importa.",
  lab: "NEURAL CORE · CONSCIOUSNESS ENGINE",
};

const STREAMS = ["TYPE","VOICE","SHADER","OS","NET","SONG","LEARN","BUILD","SIGNAL","GLITCH","CORE","LOOP"];

const LANGS = [
  "TypeScript","Python","Java","Go","JavaScript","HTML","CSS","PowerShell",
  "React 19","Next.js","Astro","Vite","tRPC","Node","Express","Drizzle","MySQL",
  "Redis","Three.js","R3F","GSAP","Lenis","RVC","Applio","Whisper","Demucs",
  "Tone.js","Claude Code","Qwen Code","OpenCode",
];

const MISSIONS = [
  ["NOIACORE LAB", "React 19 · tRPC · LLM", "LIVE"],
  ["meta-skill", "Zero-token routing", "16 archetypes"],
  ["nexus-os", "Neon Glass OS · 38+ apps", "ZERO DEPS"],
  ["secure-t", "Cyber + AI Academy", "LIVE"],
  ["DUCK Ecosystem", "Astro · studio apps", "6 MODULES"],
  ["Voice Clone", "RVC · Applio · Kaggle GPU", "47 stems"],
];

const ECOS = ["NOIACORE","DUCK","JUDAS","OMEGA","secure-t","ManosAbiertas","CARQUIDEC","proofmesh"];

const P1 = [[180,120],[240,180],[300,320],[880,330],[950,130],[1010,200],[520,90],[700,60],[110,280],[1080,290]];
const EDGES = [[0,1],[0,2],[1,2],[4,5],[4,7],[5,6],[6,7],[3,5],[3,4],[0,6],[8,0],[9,4]];

const esc = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

/* ============ NOIACORE FX -> SVG+SMIL ============ */
/* 01 GLITCH: bandas horizontales RGB rasgadas (keys semialeatorios) */
const GLITCH_Y = [40, 96, 150, 208, 260, 330, 400, 470, 530, 590];
const glitchBands = GLITCH_Y.map((y,i)=>`
  <g transform="translate(0,${y})">
    <rect width="1200" height="${i%2?3:5}" fill="${i%3===0?C.CYAN:(i%3===1?C.RED:C.PLASMA)}" opacity="0">
      <animate attributeName="opacity" values="0;0;0.5;0;0;0.9;0;0;0;0" keyTimes="0;0.015;0.02;0.03;0.31;0.315;0.32;0.33;0.92;1" dur="${6+(i%4)}s" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="translate" values="0 0;-22 0;14 0;0 0" keyTimes="0;0.02;0.025;0.03" dur="${6+(i%4)}s" repeatCount="indefinite"/>
    </rect>
  </g>`).join("");

/* 02 SCAN bar: línea vertical viajera */
const scanbar = `<g><rect x="0" y="0" width="1200" height="90" fill="url(#scanG)">
  <animateTransform attributeName="transform" type="translate" from="0 -200" to="0 640" dur="4.5s" repeatCount="indefinite"/>
</rect></g>`;

/* 03 SUPERNOVA: reventón radial cada 9s */
const supernova = `<g transform="translate(600,270)">
  <circle r="0" fill="url(#novaG)">
    <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.955;0.965;1" dur="9s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale" values="0.5;0.5;1.5;2.4" keyTimes="0;0.955;0.97;1" dur="9s" repeatCount="indefinite"/>
  </circle>
  <circle r="0" fill="none" stroke="${C.ICE}" stroke-width="3" opacity="0">
    <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.955;0.98;1" dur="9s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale" values="0.4;0.4;1.2;3" keyTimes="0;0.955;0.99;1" dur="9s" repeatCount="indefinite"/>
  </circle>
</g>`;

const novaG = `<radialGradient id="novaG" cx=".5" cy=".5" r=".5">
  <stop offset="0" stop-color="#fff" stop-opacity=".9"/>
  <stop offset=".35" stop-color="${C.RED}" stop-opacity=".45"/>
  <stop offset=".7" stop-color="${C.RED}" stop-opacity=".1"/>
  <stop offset="1" stop-color="${C.RED}" stop-opacity="0"/></radialGradient>`;

/* 04 FILM GRAIN: turbulencia que se sacude */
const grain = `<rect width="1200" height="640" fill="#fff" filter="url(#grainF)" opacity=".05" mix-blend-mode="overlay">
  <animateTransform attributeName="transform" type="translate" values="0 0;-10 -14;14 9;-9 12;12 -8;-6 5" dur=".9s" repeatCount="indefinite"/>
</rect>`;

/* 05 PING: anillos radar */
const ping = [0,1.2,2.4].map((d,i)=>`<g transform="translate(600,270)">
  <circle r="0" fill="none" stroke="${i%2?C.NEON:C.RED}" stroke-width="1.5" opacity="0">
    <animate attributeName="r" values="20;170" dur="3.6s" repeatCount="indefinite" begin="${d}s"/>
    <animate attributeName="opacity" values=".8;0" dur="3.6s" repeatCount="indefinite" begin="${d}s"/>
  </circle></g>`).join("");

/* 06 SHIMMER: barrido diagonal cada 5.5s */
const shimmer = `<g>
  <polygon points="-300,-200 900,-200 1500,1400 300,1400" fill="url(#shimG)" opacity="0">
    <animate attributeName="opacity" values="0;0;.5;0" keyTimes="0;0.545;0.57;0.62" dur="5.5s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="translate" values="-1500 0;500 0" dur="5.5s" repeatCount="indefinite"/>
  </polygon></g>`;

const shimG = `<linearGradient id="shimG" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="${C.ICE}" stop-opacity="0"/>
  <stop offset=".5" stop-color="${C.ICE}" stop-opacity=".12"/>
  <stop offset="1" stop-color="${C.ICE}" stop-opacity="0"/></linearGradient>`;

/* 07 DECODE: línea escáner sobre el lab */
const decodeLine = `<g transform="translate(0,287)">
  <rect x="-420" y="0" width="200" height="2" fill="url(#scanG)">
    <animateTransform attributeName="transform" type="translate" values="-360 0;420 0" dur="3s" repeatCount="indefinite"/>
  </rect></g>`;

const scanG = `<linearGradient id="scanG" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${C.RED}" stop-opacity="0"/>
  <stop offset=".5" stop-color="${C.RED}" stop-opacity=".7"/>
  <stop offset="1" stop-color="${C.RED}" stop-opacity="0"/></linearGradient>`;

/* ============ COMPONENTES ============ */
const defs = `
  <linearGradient id="neonG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.RED}"/><stop offset="1" stop-color="${C.RED_D}"/>
  </linearGradient>
  <radialGradient id="coreG" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="${C.RED}" stop-opacity=".9"/>
    <stop offset=".55" stop-color="${C.RED}" stop-opacity=".18"/>
    <stop offset="1" stop-color="${C.RED}" stop-opacity="0"/>
  </radialGradient>
  <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="grainF"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 6 -2"/></filter>
  <pattern id="gridP" width="50" height="50" patternUnits="userSpaceOnUse">
    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="${C.RED}" stroke-opacity=".12" stroke-width="1"/>
  </pattern>
  ${novaG}${scanG}${shimG}`;

const grid = `<g transform="translate(0,${C.H-190})">
  <rect x="-200" y="0" width="1600" height="190" fill="url(#gridP)" opacity=".9"/>
  <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -50" dur="1.6s" repeatCount="indefinite"/>
</g>`;

const halo = `<circle cx="600" cy="270" r="180" fill="url(#coreG)">
  <animate attributeName="r" values="150;185;150" dur="3s" repeatCount="indefinite"/></circle>`;

const particles = P1.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%3?2:3}" fill="${C.RED}" opacity=".8">
  <animate attributeName="opacity" values=".8;.15;.8" dur="${1.5+(i%4)*.6}s" repeatCount="indefinite"/>
  <animate attributeName="cx" values="${x};${x+(i%2?14:-14)};${x}" dur="${3+i}s" repeatCount="indefinite"/>
  <animate attributeName="cy" values="${y};${y+((i%3)-1)*12};${y}" dur="${4+i%3}s" repeatCount="indefinite"/></circle>`).join("");

const edges = EDGES.map(([a,b],i)=>`<line x1="${P1[a][0]}" y1="${P1[a][1]}" x2="${P1[b][0]}" y2="${P1[b][1]}" stroke="${C.RED}" stroke-width="1" stroke-opacity=".25">
  <animate attributeName="stroke-opacity" values="0;.35;0" dur="${2+i%3}s" repeatCount="indefinite"/></line>`).join("");

const topBar = `<g>
  <line x1="0" y1="54" x2="1200" y2="54" stroke="rgba(255,7,58,.14)"/>
  <text x="30" y="34" fill="${C.INK}" font-size="11" letter-spacing="3">BELENTANI@NOIACORE</text>
  <text x="264" y="34" fill="${C.PLASMA}" font-size="11" letter-spacing="2">${esc(META.status)}</text>
  <g font-size="10" letter-spacing="2" fill="${C.MUT}">
    ${STREAMS.map((s,i)=>`<text x="${430+i*62}" y="34" opacity="0"><animate attributeName="opacity" values="0;1;0" begin="${i*1.4}s" dur="${STREAMS.length*1.4}s" repeatCount="indefinite"/><tspan fill="${i%2?C.CYAN:C.PLASMA}">${s}</tspan>//</text>`).join("")}
  </g>
  <text x="1170" y="34" text-anchor="end" fill="${C.NEON}" font-size="11" letter-spacing="2">
    <tspan fill="${C.NEON}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>●</tspan> LIVE</text>
</g>`;

const title = `<g transform="translate(600,230)">
  <text class="ghost-c" x="-2" y="0" text-anchor="middle" font-size="92" letter-spacing="10">${esc(META.name)}</text>
  <text class="ghost-r" x="2" y="0" text-anchor="middle" font-size="92" letter-spacing="10">${esc(META.name)}</text>
  <text x="0" y="0" text-anchor="middle" font-size="92" letter-spacing="10" font-family="${C.F1}" fill="${C.INK}" filter="url(#glow)">
    <animate attributeName="fill-opacity" values="1;.78;1" dur="1.5s" repeatCount="indefinite"/>${esc(META.name)}</text>
</g>`;

const labLine = `<g transform="translate(600,262)">
  <rect x="-320" y="12" width="640" height="24" fill="rgba(255,7,58,.05)"/>
  <text y="29" text-anchor="middle" font-family="${C.F2}" font-size="12" letter-spacing="5" fill="${C.PLASMA}">${esc(META.lab)}</text>
</g>`;

const subtitle = `<g transform="translate(600,336)">
  <text x="0" y="0" text-anchor="middle" font-size="19" letter-spacing="5" fill="${C.RED}" filter="url(#soft)">${esc(META.role)}</text>
  <text x="0" y="28" text-anchor="middle" font-size="13" letter-spacing="3" fill="${C.MUT}">${esc(META.geo)} · ${esc(META.quant)}</text>
</g>`;

const marquee = `<g transform="translate(0,${C.H-52})">
  <rect x="0" y="-20" width="1200" height="52" fill="${C.BG}" opacity=".97"/>
  <g><animateTransform attributeName="transform" type="translate" from="0 0" to="-${LANGS.join(" · ").length*11} 0" dur="28s" repeatCount="indefinite"/>
   <text x="0" y="14" font-size="15" letter-spacing="3" fill="${C.NEON}" opacity=".85" filter="url(#soft)">${LANGS.map(esc).join("  ·  ")}  ·  ${LANGS.map(esc).join("  ·  ")}</text></g>
</g>`;

const missionsPanel = `<g transform="translate(880,180)">
  ${MISSIONS.map(([n,s,st],i)=>`<g transform="translate(0,${i*56})" opacity="0">
    <animate attributeName="opacity" values="0;1;1;0" begin="${i*2.2}s" dur="13.2s" repeatCount="indefinite"/>
    <g>
      <animateTransform attributeName="transform" type="scale" values="1;1.015;1" dur="2.4s" repeatCount="indefinite"/>
      <rect x="10" y="-16" width="280" height="52" rx="6" fill="#0a0a0f" stroke="${C.RED}" stroke-opacity=".22"/>
    </g>
    <circle cx="26" cy="10" r="5" fill="${C.RED}"><animate attributeName="opacity" values="1;.2;1" dur="1.2s" repeatCount="indefinite"/></circle>
    <text x="42" y="0" font-size="16" font-weight="bold" font-family="${C.F1}" fill="${C.INK}">${esc(n)}</text>
    <text x="42" y="20" font-size="12" font-family="${C.F2}" fill="${C.MUT}">${esc(s)} · <tspan fill="${C.RED}">${esc(st)}</tspan></text>
  </g>`).join("")}
</g>`;

const ecosPanel = `<g transform="translate(70,180)">
  <text x="0" y="0" font-size="12" letter-spacing="3" fill="${C.MUT}">ACTIVE ECOSYSTEMS</text>
  ${ECOS.map((p,i)=>`<g transform="translate(0,${12+i*40})">
    <animate attributeName="opacity" values=".35;1;.35" dur="${2+i%3*1.2}s" repeatCount="indefinite"/>
    <rect width="150" height="30" rx="4" fill="#0a0a0f" stroke="${C.RED}" stroke-opacity=".2"/>
    <text x="10" y="20" font-size="13" letter-spacing="2" font-family="${C.F1}" fill="${C.INK}">${esc(p)}</text></g>`).join("")}
</g>`;

const quote = `<g transform="translate(600,${C.H-96})">
  <text x="0" y="0" text-anchor="middle" font-size="17" font-style="italic" fill="${C.INK}" filter="url(#soft)">"${esc(META.quote)}"</text>
  <text x="${META.quote.length*8+40}" y="0" font-size="17" fill="${C.RED}">_<animate attributeName="opacity" values="1;0;1" dur=".8s" repeatCount="indefinite"/></text>
</g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${C.W} ${C.H}" width="${C.W}" height="${C.H}">
<defs>${defs}</defs>
<rect width="${C.W}" height="${C.H}" fill="${C.BG}"/>
${grid}${halo}${edges}${particles}
${topBar}${title}${labLine}${decodeLine}${subtitle}
${ecosPanel}${missionsPanel}${marquee}
${glitchBands}${scanbar}${supernova}${grain}${ping}${shimmer}
${quote}
</svg>`;

require("fs").writeFileSync("assets/bio-banner.svg", svg);
console.log(`OK bio-banner.svg — ${(svg.length/1024).toFixed(1)} KB · ${STREAMS.length} streams · ${LANGS.length} langs · ${ECOS.length} ecos · FX: glitch/scan/nova/grain/ping/shimmer`);