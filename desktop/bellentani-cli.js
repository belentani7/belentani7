#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const workspace = require('./src/workspace');
const pvc = require('./src/pvcu');
const root = path.resolve(process.argv[3] || process.cwd());
const command = process.argv[2] || 'doctor';
function out(value) { process.stdout.write(`${JSON.stringify(value, null, 2)}\n`); }
try {
  if (command === 'doctor') out({ product: 'Bellentani', root, node: process.version, pvc: 'PVC-U-12.0/v1', checks: { workspace: fs.existsSync(root), package: fs.existsSync(path.join(root, 'package.json')), source: fs.existsSync(path.join(__dirname, 'src')) } });
  else if (command === 'audit') out({ product: 'Bellentani', pvc: pvc.validateStateChain([]), profiles: Object.keys(pvc.PROFILES), universalProfiles: Object.keys(pvc.UNIVERSAL_PROFILES) });
  else if (command === 'snapshot') out(workspace.snapshot(root));
  else if (command === 'rollback') out(workspace.rollback(root, process.argv[3]));
  else if (command === 'diff') { const file = process.argv[4]; const proposed = fs.readFileSync(process.argv[5], 'utf8'); out(workspace.diff(root, file, proposed)); }
  else if (command === 'context') out(workspace.collectFiles(root).slice(0, 20));
  else { console.error('Uso: bellentani <doctor|audit|snapshot|rollback|diff|context> [ruta]'); process.exitCode = 2; }
} catch (error) { console.error(error.message); process.exitCode = 1; }
