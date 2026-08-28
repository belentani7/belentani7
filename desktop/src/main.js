const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const { safeStorage } = require('electron');
const pvcu = require('./pvcu');
const workspace = require('./workspace');
const mcp = require('./mcp');

let mainWindow;
const stateFile = path.join(app.getPath('userData'), 'belentani-state.json');
const secretFile = path.join(app.getPath('userData'), 'belentani-provider.secret');
function saveProviderSecret(value) { if (!value) return false; if (!safeStorage.isEncryptionAvailable()) return false; fs.mkdirSync(path.dirname(secretFile), { recursive: true }); fs.writeFileSync(secretFile, safeStorage.encryptString(value)); return true; }
function loadProviderSecret() { try { if (!safeStorage.isEncryptionAvailable()) return ''; return safeStorage.decryptString(fs.readFileSync(secretFile)); } catch { return ''; } }

function readState() {
  try { return JSON.parse(fs.readFileSync(stateFile, 'utf8')); }
  catch { return { recentProjects: [], notes: '', sessions: [] }; }
}

function writeState(state) {
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  const persisted = JSON.parse(JSON.stringify(state || {}));
  if (persisted.provider?.apiKey) { saveProviderSecret(persisted.provider.apiKey); delete persisted.provider.apiKey; }
  fs.writeFileSync(stateFile, JSON.stringify(persisted, null, 2), 'utf8');
  return persisted;
}

function safePath(root, relativePath = '') {
  const base = path.resolve(root);
  const target = path.resolve(base, relativePath);
  if (target !== base && !target.startsWith(`${base}${path.sep}`)) throw new Error('Ruta fuera del proyecto');
  return target;
}

const BLOCKED_COMMANDS = [/Remove-Item\s+(-Recurse|-Force)/i, /format\s+[a-z]:/i, /del\s+\/s/i, /shutdown/i, /reg\s+delete/i, /Invoke-WebRequest.*\|.*iex/i, /curl.*\|.*bash/i, /rm\s+-rf\s+\//i, /Invoke-Expression/i, /powershell.*-enc/i, /Set-ExecutionPolicy\s+Unrestricted/i];
function commandGuard(command) { const text = String(command || ''); if (!text || text.length > 8000) return { allowed: false, reason: 'Comando vacío o demasiado largo' }; const match = BLOCKED_COMMANDS.find(pattern => pattern.test(text)); return match ? { allowed: false, reason: 'PVC-U bloqueó un patrón potencialmente destructivo' } : { allowed: true }; }
function processCommand(command, cwd, options = {}) {
  const guard = commandGuard(command); if (!guard.allowed) return Promise.resolve({ code: 126, stdout: '', stderr: guard.reason, blocked: true });
  const directory = cwd ? path.resolve(cwd) : os.homedir(); if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) return Promise.resolve({ code: 127, stdout: '', stderr: 'Directorio de trabajo inválido', blocked: true });
  return new Promise(resolve => {
    const isWindows = process.platform === 'win32'; const child = spawn(isWindows ? 'powershell.exe' : 'bash', isWindows ? ['-NoLogo','-NoProfile','-ExecutionPolicy','Bypass','-Command',command] : ['-lc',command], { cwd: directory, env: process.env, windowsHide: true });
    let stdout = '', stderr = '', settled = false; const finish = result => { if (!settled) { settled = true; clearTimeout(timer); resolve(result); } }; const cap = data => data.length > 2000000 ? data.slice(0, 2000000) + '\\n[output truncated]' : data;
    child.stdout.on('data', d => { stdout = cap(stdout + d.toString()); }); child.stderr.on('data', d => { stderr = cap(stderr + d.toString()); }); const timer = setTimeout(() => { child.kill(); finish({ code: 124, stdout, stderr: stderr + '\\nProcess timeout', timedOut: true }); }, options.timeout || 120000);
    child.on('close', code => finish({ code, stdout, stderr, blocked: false, simulated: !isWindows })); child.on('error', error => finish({ code: -1, stdout, stderr: error.message, blocked: false }));
  });
}
function listTree(root, relative = '', depth = 0) {
  if (depth > 6) return [];
  const folder = safePath(root, relative);
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder, { withFileTypes: true })
    .filter(entry => !['node_modules', '.git', 'dist', 'build'].includes(entry.name))
    .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name))
    .map(entry => {
      const rel = path.join(relative, entry.name);
      return { name: entry.name, path: rel, type: entry.isDirectory() ? 'directory' : 'file', children: entry.isDirectory() ? listTree(root, rel, depth + 1) : undefined };
    });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: '#0b1020',
    title: 'Belentani',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory', 'createDirectory'] });
  return result.canceled ? null : result.filePaths[0];
});
ipcMain.handle('tree', (_, root) => listTree(root));
ipcMain.handle('read-file', (_, { root, file }) => fs.readFileSync(safePath(root, file), 'utf8'));
ipcMain.handle('write-file', (_, { root, file, content }) => { const target = safePath(root, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, content, 'utf8'); return true; });
ipcMain.handle('state-read', () => readState());
ipcMain.handle('state-write', (_, state) => writeState(state));
ipcMain.handle('provider-status', () => ({ configured: !!loadProviderSecret(), encrypted: safeStorage.isEncryptionAvailable() }));
ipcMain.handle('system-info', () => ({ platform: process.platform, arch: process.arch, home: os.homedir(), shell: process.platform === 'win32' ? 'PowerShell' : 'PowerShell simulado' }));
ipcMain.handle('search-project', (_, { root, query }) => {
  const results = [];
  const needle = String(query || '').toLowerCase();
  function walk(relative = '') {
    if (results.length >= 200) return;
    const folder = safePath(root, relative);
    if (!fs.existsSync(folder)) return;
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      if (['node_modules', '.git', 'dist', 'build'].includes(entry.name)) continue;
      const rel = path.join(relative, entry.name);
      if (entry.isDirectory()) walk(rel);
      else if (entry.name.toLowerCase().includes(needle)) results.push({ file: rel, line: 1, preview: entry.name });
      else if (needle) {
        try { const lines = fs.readFileSync(safePath(root, rel), 'utf8').split(/\\r?\\n/); lines.forEach((line, index) => { if (line.toLowerCase().includes(needle) && results.length < 200) results.push({ file: rel, line: index + 1, preview: line.trim().slice(0, 180) }); }); } catch {}
      }
    }
  }
  walk(); return results;
});
ipcMain.handle('git-action', (_, { root, action }) => {
  const commands = { status: 'git status --short --branch', diff: 'git diff --stat', log: 'git log --oneline -8', init: 'git init' };
  return new Promise(resolve => {
    if (!commands[action]) return resolve({ code: 1, stdout: '', stderr: 'Operación Git no permitida' });
    const child = spawn(process.platform === 'win32' ? 'powershell.exe' : 'bash', process.platform === 'win32' ? ['-NoLogo','-NoProfile','-Command',commands[action]] : ['-lc',commands[action]], { cwd: root || os.homedir(), env: process.env });
    let stdout = '', stderr = ''; child.stdout.on('data', d => stdout += d); child.stderr.on('data', d => stderr += d); child.on('close', code => resolve({ code, stdout, stderr })); child.on('error', e => resolve({ code: -1, stdout, stderr: e.message }));
  });
});
ipcMain.handle('pvcu-profiles', () => Object.values(pvcu.PROFILES));
ipcMain.handle('pvcu-universal-profiles', () => pvcu.UNIVERSAL_PROFILES);
ipcMain.handle('pvcu-ai-subpheres', () => pvcu.AI_SUBSPHERES);
ipcMain.handle('pvcu-continuous', (_, payload) => pvcu.continuousValidate(payload));
ipcMain.handle('pvcu-policy-suggestions', () => pvcu.suggestPolicy(readState().evidence || []));
ipcMain.handle('pvcu-model-lifecycle', (_, payload) => pvcu.validateModelLifecycle(payload));
ipcMain.handle('pvcu-agent-intent', (_, payload) => pvcu.validateAgentIntent(payload));
ipcMain.handle('diagnose-file', (_, { root, file }) => {
  try { const target = workspace.safePath(root, file); if (!fs.existsSync(target)) return { ok: false, diagnostics: [{ message: 'Archivo no encontrado', severity: 'error' }] }; const ext = path.extname(target).toLowerCase(); if (ext === '.json') { JSON.parse(fs.readFileSync(target, 'utf8')); return { ok: true, diagnostics: [] }; } if (['.js', '.mjs', '.cjs'].includes(ext)) return new Promise(resolve => { const child = spawn(process.platform === 'win32' ? 'node.exe' : 'node', ['--check', target], { cwd: path.dirname(target), env: process.env, windowsHide: true }); let stderr = ''; child.stderr.on('data', d => stderr += d.toString()); child.on('close', code => resolve({ ok: code === 0, diagnostics: code === 0 ? [] : [{ message: stderr.trim() || 'JavaScript syntax error', severity: 'error' }] })); child.on('error', e => resolve({ ok: false, diagnostics: [{ message: e.message, severity: 'error' }] })); }); return { ok: true, diagnostics: [] }; } catch (error) { return { ok: false, diagnostics: [{ message: error.message, severity: 'error' }] }; }
});
ipcMain.handle('project-context', (_, { root, files = [] }) => {
  const selected = files.length ? files.slice(0, 12) : listTree(root).flatMap(n => n.type === 'file' ? [n.path] : []).slice(0, 8);
  return selected.map(file => { try { return { file, content: fs.readFileSync(safePath(root, file), 'utf8').slice(0, 12000) }; } catch { return { file, content: '' }; } });
});
function extractProposedChanges(content) { const files = []; const pattern = /---FILE\\s+([^\\n]+)\\n([\\s\\S]*?)\\n---END FILE/g; let match; while ((match = pattern.exec(content || '')) && files.length < 50) files.push({ file: match[1].trim(), content: match[2] }); return files; }
ipcMain.handle('llm-chat', async (_, { provider, messages, projectContext = [] }) => {
  const cfg = provider || {};
  const apiKey = cfg.apiKey || loadProviderSecret();
  if (!cfg.endpoint || !cfg.model || !apiKey) return { ok: false, error: 'Configura endpoint, modelo y API key en Ajustes IA.' };
  const url = cfg.endpoint.replace(/\/$/, '').endsWith('/chat/completions') ? cfg.endpoint : `${cfg.endpoint.replace(/\/$/, '')}/chat/completions`;
  const system = `Eres el agente de código Bellentani. Trabajas de forma segura y auditable. Responde en español. Devuelve PLAN, ARCHIVOS, CAMBIOS y PRUEBAS. Si propones editar archivos, añade bloques exactos con el formato ---FILE ruta/relativa.ext\ncontenido completo\n---END FILE. Nunca incluyas rutas absolutas ni secretos. Contexto del proyecto:\\n${projectContext.map(x => `--- ${x.file} ---\\n${x.content}`).join('\\n')}`;
  try {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model: cfg.model, temperature: 0.15, messages: [{ role: 'system', content: system }, ...(messages || [])] }) });
    const data = await response.json();
    if (!response.ok) return { ok: false, error: data.error?.message || `HTTP ${response.status}` };
    const content = data.choices?.[0]?.message?.content || JSON.stringify(data); return { ok: true, content, proposedChanges: extractProposedChanges(content), model: cfg.model };
  } catch (error) { return { ok: false, error: error.message }; }
});
ipcMain.handle('pvcu-validate-input', (_, payload) => pvcu.validateInput(payload.text, payload.options));
ipcMain.handle('pvcu-classify', (_, payload) => pvcu.classifyOperation(payload));
ipcMain.handle('pvcu-tool-check', (_, payload) => pvcu.validateToolAction(payload));
ipcMain.handle('pvcu-evidence', (_, { event }) => { const state = readState(); const record = pvcu.appendEvidence(state, event); writeState(state); return record; });
ipcMain.handle('pvcu-audit', () => pvcu.validateStateChain(readState().evidence || []));
ipcMain.handle('mcp-list', (_, { root }) => mcp.list(root));
ipcMain.handle('mcp-call', async (_, { root, name, method, params }) => { const state = readState(); const record = pvcu.appendEvidence(state, { type: 'mcp.call', name, method, decision: 'HUMAN_REVIEW' }); writeState(state); const result = await mcp.call(root, name, method, params); return { ...result, evidenceId: record.evidenceId }; });
ipcMain.handle('extensions-list', (_, { root } = {}) => {
  const builtIns = [
    { id: 'belentani.pvcu', name: 'PVC-U Governance', version: '1.0.0', status: 'built-in' },
    { id: 'belentani.git', name: 'Git Workspace', version: '1.0.0', status: 'built-in' },
    { id: 'belentani.powershell', name: 'PowerShell Tasks', version: '1.0.0', status: 'built-in' },
    { id: 'belentani.ai-agent', name: 'Belentani Agent', version: '1.0.0', status: 'built-in' }
  ];
  if (!root) return builtIns;
  try {
    const dir = workspace.safePath(root, '.bellentani/extensions'); fs.mkdirSync(dir, { recursive: true });
    const local = fs.readdirSync(dir).filter(x => x.endsWith('.json')).flatMap(file => { try { const m = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')); return [{ ...m, status: 'workspace' }]; } catch { return []; } });
    return [...builtIns, ...local];
  } catch { return builtIns; }
});
ipcMain.handle('safe-run', (_, { command, cwd }) => processCommand(command, cwd, { timeout: 120000 }));
ipcMain.handle('project-tasks', (_, { root }) => {
  try { const pkg = JSON.parse(fs.readFileSync(safePath(root, 'package.json'), 'utf8')); return Object.keys(pkg.scripts || {}).map(name => ({ name, command: `npm run ${name}` })); } catch { return []; }
});
ipcMain.handle('extensions-install', (_, { extension }) => { const state = readState(); state.extensions = [...new Set([...(state.extensions || []), extension])]; writeState(state); return state.extensions; });
ipcMain.handle('workspace-snapshot', (_, { root, files = [] }) => workspace.snapshot(root, files));
ipcMain.handle('workspace-diff', (_, { root, file, content }) => workspace.diff(root, file, content));
ipcMain.handle('workspace-apply', (_, { root, files = [] }) => {
  const risk = pvcu.classifyOperation({ operation: 'write', tool: 'project.write', filesChanged: files.length });
  const check = pvcu.validateToolAction({ tool: 'project.write', riskClass: risk, profile: pvcu.PROFILES.coding, reversible: true, simulated: true });
  if (check.decision !== 'PASS') return { ok: false, decision: check.decision, findings: check.findings };
  const result = workspace.applyFiles(root, files);
  const state = readState(); const record = pvcu.appendEvidence(state, { type: 'workspace.apply', decision: 'PASS', riskClass: risk, files: result.changed, snapshotId: result.snapshotId }); writeState(state);
  return { ok: true, ...result, evidenceId: record.evidenceId };
});
ipcMain.handle('workspace-rollback', (_, { root, snapshotId }) => workspace.rollback(root, snapshotId));
ipcMain.handle('debug-run', (_, { command, cwd }) => {
  try {
    const relative = String(command || ''); const target = workspace.safePath(cwd || os.homedir(), relative);
    if (!/\.(c|m)?js$/i.test(target) || !fs.existsSync(target)) return Promise.resolve({ code: 2, stdout: '', stderr: 'La depuración requiere un archivo JS existente dentro del workspace', blocked: true });
    return new Promise(resolve => {
      const child = spawn(process.platform === 'win32' ? 'node.exe' : 'node', ['--inspect=0', target], { cwd: path.dirname(target), env: process.env, windowsHide: true });
      let stdout = '', stderr = ''; child.stdout.on('data', d => stdout += d); child.stderr.on('data', d => stderr += d); const timer = setTimeout(() => { child.kill(); resolve({ code: 124, stdout, stderr: `${stderr}\nDebug timeout`, debug: true }); }, 120000); child.on('close', code => { clearTimeout(timer); resolve({ code, stdout, stderr, debug: true }); }); child.on('error', e => { clearTimeout(timer); resolve({ code: -1, stdout, stderr: e.message, debug: true }); });
    });
  } catch (error) { return Promise.resolve({ code: 2, stdout: '', stderr: error.message, blocked: true }); }
});
ipcMain.handle('run-shell', (_, { command, cwd }) => processCommand(command, cwd, { timeout: 120000 }));

app.whenReady().then(() => { createWindow(); app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); }); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
