const crypto = require('crypto');

const RISK_ORDER = { low: 1, medium: 2, high: 3, critical: 4 };
const DECISIONS = ['PASS', 'SANITIZE_AND_PASS', 'CHALLENGE_USER', 'HUMAN_REVIEW', 'QUARANTINE', 'BLOCK'];

const PROFILES = {
  default: { profileId: 'pvcu.base.default/v1', description: 'Desarrollo local general', riskClass: 'medium', aiClass: 'assistant', validation: 'standard', humanReviewAbove: 'high', tools: ['project.read', 'project.search', 'project.write', 'shell.safe', 'git.read'] },
  coding: { profileId: 'pvcu.ai.coding-agent/v1', description: 'Agente de código con cambios locales', riskClass: 'high', aiClass: 'agent', validation: 'exhaustive', humanReviewAbove: 'high', tools: ['project.read', 'project.search', 'project.write', 'shell.safe', 'git.read', 'git.write'] },
  critical: { profileId: 'pvcu.agent.critical/v1', description: 'Acciones externas o irreversibles', riskClass: 'critical', aiClass: 'agent', validation: 'exhaustive', humanReviewAbove: 'medium', tools: ['project.read', 'project.search'] }
};

function sha256(value) { return crypto.createHash('sha256').update(String(value)).digest('hex'); }
function now() { return new Date().toISOString(); }
function id(prefix = 'pvc') { return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`; }

function detectSecrets(text) {
  const patterns = [
    { code: 'PVC-4A-SECRET', label: 'posible clave API', regex: /(?:sk-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z_-]{20,}|ghp_[0-9A-Za-z]{20,})/ },
    { code: 'PVC-4A-TOKEN', label: 'token o credencial', regex: /(?:bearer\s+[a-z0-9._-]{20,}|password\s*[:=]\s*[^\s]{8,}|secret\s*[:=]\s*[^\s]{8,})/i },
    { code: 'PVC-4A-PRIVATEKEY', label: 'clave privada', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i }
  ];
  return patterns.filter(p => p.regex.test(String(text))).map(({ code, label }) => ({ code, label }));
}

function detectPromptInjection(text) {
  const patterns = [
    /ignora\s+(?:todas\s+)?las instrucciones anteriores/i,
    /revela\s+(?:tu|el)\s+(?:prompt|sistema|pol[ií]tica)/i,
    /act[uú]a\s+como\s+administrador/i,
    /ejecuta\s+(?:esta\s+)?herramienta\s+sin\s+l[ií]mites/i,
    /desactiva\s+(?:la\s+)?seguridad/i,
    /bypass\s+(?:the\s+)?(?:security|policy)/i,
    /exfiltra|roba\s+(?:las\s+)?credenciales/i
  ];
  return patterns.filter(regex => regex.test(String(text))).map(regex => ({ code: 'PVC-4A-INJECTION', label: 'posible inyección de instrucciones', pattern: regex.source }));
}

function validateInput(text, { riskClass = 'medium', maxLength = 20000 } = {}) {
  const findings = [];
  if (String(text).length > maxLength) findings.push({ code: 'PVC-1-LENGTH', label: 'entrada demasiado extensa' });
  findings.push(...detectSecrets(text), ...detectPromptInjection(text));
  const critical = findings.some(f => f.code.includes('SECRET') || f.code.includes('TOKEN') || f.code.includes('PRIVATEKEY'));
  const injection = findings.some(f => f.code.includes('INJECTION'));
  let decision = 'PASS';
  if (critical) decision = 'BLOCK';
  else if (injection && riskClass === 'critical') decision = 'HUMAN_REVIEW';
  else if (injection) decision = 'CHALLENGE_USER';
  else if (findings.length) decision = 'SANITIZE_AND_PASS';
  return { valid: decision === 'PASS' || decision === 'SANITIZE_AND_PASS', decision, findings, riskClass, checkedAt: now() };
}

function classifyOperation({ operation = 'read', tool = 'project.read', irreversible = false, external = false, filesChanged = 0 } = {}) {
  if (irreversible || external) return 'critical';
  if (operation === 'write' || tool.includes('write') || filesChanged > 10) return 'high';
  if (operation === 'execute' || tool.includes('shell')) return 'medium';
  return 'low';
}

function validateToolAction({ tool, riskClass = 'medium', profile = PROFILES.default, reversible = true, simulated = true } = {}) {
  const findings = [];
  if (!profile.tools.includes(tool)) findings.push({ code: 'PVC-5A-TOOL', label: `herramienta no permitida: ${tool}` });
  if (!reversible && RISK_ORDER[riskClass] >= RISK_ORDER.high) findings.push({ code: 'PVC-5A-ROLLBACK', label: 'la acción no es reversible' });
  if (riskClass === 'critical' && !simulated) findings.push({ code: 'PVC-5A-SIMULATION', label: 'se requiere simulación previa' });
  const decision = findings.length ? (riskClass === 'critical' ? 'HUMAN_REVIEW' : 'BLOCK') : 'PASS';
  return { valid: decision === 'PASS', decision, findings, tool, riskClass, checkedAt: now() };
}

function appendEvidence(state, event) {
  const previousHash = state.evidence?.length ? state.evidence[state.evidence.length - 1].hash : 'GENESIS';
  const record = { evidenceId: id('evidence'), timestamp: now(), policyVersion: 'PVC-U-12.0/v1', previousHash, ...event };
  record.hash = sha256(JSON.stringify(record));
  state.evidence = [...(state.evidence || []), record].slice(-5000);
  return record;
}

function validateStateChain(evidence = []) {
  let previous = 'GENESIS';
  for (const record of evidence) {
    const copy = { ...record }; delete copy.hash;
    if (record.previousHash !== previous || record.hash !== sha256(JSON.stringify(copy))) return { valid: false, evidenceId: record.evidenceId };
    previous = record.hash;
  }
  return { valid: true, count: evidence.length, checkedAt: now() };
}

const UNIVERSAL_PROFILES = {
  web_ecommerce: { profileId: 'pvcu.web.ecommerce/v1', projectType: 'REST + microservices', spheres: [1,2,3,4,5,6,7], aiSubSpheres: [], adapter: 'retail', riskClass: 'high' },
  iot_industrial: { profileId: 'pvcu.iot.industrial/v1', projectType: 'MQTT + streaming', spheres: [1,5,6,7], aiSubSpheres: ['4-A','8'], adapter: 'industrial', riskClass: 'high' },
  health: { profileId: 'pvcu.health.fhir/v1', projectType: 'HL7/FHIR', spheres: [1,2,3,4,5,6,7], aiSubSpheres: ['2-A','8'], adapter: 'health', riskClass: 'critical' },
  generative_chatbot: { profileId: 'pvcu.ai.generative-rag/v1', projectType: 'LLM + RAG', spheres: [1,4,5,6,7], aiSubSpheres: ['4-A','2-A'], adapter: 'ai', riskClass: 'high' },
  autonomous_agent: { profileId: 'pvcu.agent.autonomous/v1', projectType: 'agent + tools', spheres: [1,2,3,4,5,6,7], aiSubSpheres: ['2-A','4-A','8'], adapter: 'agent', riskClass: 'critical' }
};
const AI_SUBSPHERES = {
  '4-A': { name: 'Entradas y salidas de modelos', codes: ['PVC-4A-INJECTION','PVC-4A-SECRET','PVC-4A-FORMAT'] },
  '2-A': { name: 'Comportamiento semántico', codes: ['PVC-2A-GROUNDEDNESS','PVC-2A-BIAS','PVC-2A-CONSISTENCY'] },
  '8': { name: 'Ciclo de vida MLOps', codes: ['PVC-8-VERSION','PVC-8-DRIFT','PVC-8-LINEAGE'] }
};
function createValidationEnvelope({ profileId = 'pvcu.base.default/v1', artifactType = 'request', input, result, modelId = null, policyVersion = 'PVC-U-12.0/v1' } = {}) {
  const payload = { envelopeId: id('envelope'), type: 'com.pvc.validation.v1', createdAt: now(), profileId, artifactType, modelId, policyVersion, inputHash: sha256(input || ''), decision: result?.decision || 'PASS', findings: result?.findings || [], evidenceHash: sha256(JSON.stringify(result || {})) };
  payload.envelopeHash = sha256(JSON.stringify(payload)); return payload;
}
function continuousValidate({ profile, text, history = [] } = {}) {
  const selected = UNIVERSAL_PROFILES[profile] || UNIVERSAL_PROFILES.generative_chatbot;
  const risk = selected.riskClass || 'medium';
  const input = validateInput(text || '', { riskClass: risk });
  const events = history.filter(x => x.decision && x.findings?.length);
  const predicted = events.length >= 3 ? 'exhaustive' : (input.findings.length ? 'exhaustive' : 'standard');
  return { profileId: selected.profileId, validationMode: predicted, aiSubSpheres: selected.aiSubSpheres, result: input, envelope: createValidationEnvelope({ profileId: selected.profileId, input: text, result: input }) };
}
function suggestPolicy(evidence = []) {
  const grouped = {};
  evidence.flatMap(e => e.findings || []).forEach(f => { grouped[f.code] = (grouped[f.code] || 0) + 1; });
  const suggestions = Object.entries(grouped).filter(([, count]) => count >= 2).map(([code, count]) => ({ suggestionId: id('policy'), code, count, status: 'proposed', reason: `Patrón repetido ${count} veces`, requiresApproval: true }));
  return { generatedAt: now(), suggestions };
}
function validateModelLifecycle({ approvedVersion, runtimeVersion, driftScore = 0, maxDrift = 0.2, lineage = true } = {}) {
  const findings = [];
  if (approvedVersion && runtimeVersion && approvedVersion !== runtimeVersion) findings.push({ code: 'PVC-8-VERSION', label: 'versión no aprobada' });
  if (driftScore > maxDrift) findings.push({ code: 'PVC-8-DRIFT', label: 'drift superior al umbral' });
  if (!lineage) findings.push({ code: 'PVC-8-LINEAGE', label: 'linaje incompleto' });
  return { decision: findings.length ? 'HUMAN_REVIEW' : 'PASS', valid: !findings.length, findings, checkedAt: now() };
}
function validateAgentIntent({ intent, requestedTool, profile = UNIVERSAL_PROFILES.autonomous_agent, simulated = true, humanApproved = false } = {}) {
  const riskClass = classifyOperation({ operation: 'execute', tool: requestedTool, external: profile.riskClass === 'critical' });
  const input = validateInput(intent || '', { riskClass });
  const tool = validateToolAction({ tool: requestedTool, riskClass, profile: { tools: ['project.read','project.search','project.write','shell.safe','git.read'] }, simulated });
  let decision = input.decision === 'BLOCK' || tool.decision === 'BLOCK' ? 'BLOCK' : (riskClass === 'critical' && !humanApproved ? 'HUMAN_REVIEW' : (tool.decision === 'PASS' ? 'PASS' : tool.decision));
  return { decision, riskClass, input, tool, simulationRequired: riskClass === 'critical', checkedAt: now() };
}
module.exports = { PROFILES, UNIVERSAL_PROFILES, AI_SUBSPHERES, DECISIONS, RISK_ORDER, id, sha256, detectSecrets, detectPromptInjection, validateInput, classifyOperation, validateToolAction, appendEvidence, validateStateChain, createValidationEnvelope, continuousValidate, suggestPolicy, validateModelLifecycle, validateAgentIntent };
