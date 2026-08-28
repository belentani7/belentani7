const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
function loadConfig(root) {
  const file = path.resolve(root, '.bellentani', 'mcp.json');
  if (!fs.existsSync(file)) return { servers: [] };
  const config = JSON.parse(fs.readFileSync(file, 'utf8'));
  const servers = Array.isArray(config.servers) ? config.servers.slice(0, 20) : [];
  return { servers: servers.filter(s => s && /^[a-zA-Z0-9._-]{1,80}$/.test(s.name) && typeof s.command === 'string' && s.command.length < 300).map(s => ({ name: s.name, command: s.command, args: Array.isArray(s.args) ? s.args.slice(0, 20).map(String) : [], approved: s.approved === true })) };
}
function list(root) { return loadConfig(root).servers.map(({ name, command, args, approved }) => ({ name, command, args, approved })); }
function call(root, name, method, params = {}) {
  const server = loadConfig(root).servers.find(s => s.name === name);
  if (!server) return Promise.resolve({ ok: false, error: 'Servidor MCP no encontrado' });
  if (!server.approved) return Promise.resolve({ ok: false, decision: 'HUMAN_REVIEW', error: 'Servidor MCP requiere aprobación explícita en .bellentani/mcp.json' });
  if (!/^[a-zA-Z][a-zA-Z0-9._/-]{0,100}$/.test(method)) return Promise.resolve({ ok: false, error: 'Método MCP inválido' });
  return new Promise(resolve => {
    const child = spawn(server.command, server.args, { cwd: path.resolve(root), env: { PATH: process.env.PATH }, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
    const request = JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method, params }); child.stdin.write(`${request}\n`);
    let out = '', err = ''; const timer = setTimeout(() => { child.kill(); resolve({ ok: false, error: 'MCP timeout' }); }, 30000);
    child.stdout.on('data', data => { out += data.toString(); }); child.stderr.on('data', data => { err += data.toString(); });
    child.on('close', code => { clearTimeout(timer); try { const line = out.trim().split(/\r?\n/).find(Boolean); resolve({ ok: code === 0, code, response: line ? JSON.parse(line) : null, stderr: err }); } catch (error) { resolve({ ok: false, code, error: error.message, raw: out, stderr: err }); } });
    child.on('error', error => { clearTimeout(timer); resolve({ ok: false, error: error.message }); });
  });
}
module.exports = { loadConfig, list, call };
