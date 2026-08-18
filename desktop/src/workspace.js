const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const IGNORED = new Set(['node_modules', '.git', 'dist', 'build', '.bellentani']);
function safePath(root, relative = '') {
  const base = path.resolve(root);
  const target = path.resolve(base, relative);
  if (target !== base && !target.startsWith(`${base}${path.sep}`)) throw new Error('Ruta fuera del proyecto');
  return target;
}
function id() { return `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`; }
function snapshot(root, files = []) {
  const snapshotId = id();
  const dir = safePath(root, path.join('.bellentani', 'snapshots', snapshotId));
  fs.mkdirSync(dir, { recursive: true });
  const selected = files.length ? files : collectFiles(root);
  const manifest = [];
  for (const file of selected.slice(0, 200)) {
    const source = safePath(root, file);
    if (!fs.existsSync(source) || !fs.statSync(source).isFile()) continue;
    const target = path.join(dir, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    manifest.push(file);
  }
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ snapshotId, createdAt: new Date().toISOString(), files: manifest }, null, 2));
  return { snapshotId, files: manifest };
}
function collectFiles(root, relative = '', result = []) {
  if (result.length >= 200) return result;
  const folder = safePath(root, relative);
  if (!fs.existsSync(folder)) return result;
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    if (IGNORED.has(entry.name)) continue;
    const rel = path.join(relative, entry.name);
    if (entry.isDirectory()) collectFiles(root, rel, result);
    else result.push(rel);
  }
  return result;
}
function applyFiles(root, files) {
  const selected = files.slice(0, 100);
  const before = snapshot(root, selected.map(x => x.file));
  for (const item of selected) {
    if (!item || typeof item.file !== 'string' || typeof item.content !== 'string') throw new Error('Cambio inválido');
    const target = safePath(root, item.file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, item.content, 'utf8');
  }
  return { snapshotId: before.snapshotId, changed: selected.map(x => x.file) };
}
function rollback(root, snapshotId) {
  const dir = safePath(root, path.join('.bellentani', 'snapshots', snapshotId));
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
  for (const file of manifest.files) {
    const source = path.join(dir, file);
    const target = safePath(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }
  return { snapshotId, restored: manifest.files };
}
function diff(root, file, proposedContent) {
  const target = safePath(root, file);
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  const a = current.split(/\r?\n/), b = String(proposedContent || '').split(/\r?\n/);
  const lines = [], max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (a[i] === b[i]) lines.push(`  ${String(i + 1).padStart(4)} ${a[i] || ''}`);
    else { if (a[i] !== undefined) lines.push(`- ${String(i + 1).padStart(4)} ${a[i]}`); if (b[i] !== undefined) lines.push(`+ ${String(i + 1).padStart(4)} ${b[i]}`); }
  }
  return { file, changed: current !== proposedContent, diff: lines.join('\n') };
}
module.exports = { safePath, snapshot, applyFiles, rollback, diff, collectFiles };
