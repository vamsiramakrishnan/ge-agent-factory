import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";

export const QUALITY_SCHEMA_VERSION = "okf-quality.v1";
export const STATUSES = ["L0", "L1", "L2", "L3", "L4", "L5"];
const GENERIC_PROMPTS = [/run the .* workflow/i, /run .* for the current period/i, /execute the standard workflow/i, /analyze the data and provide recommendations/i];
const HIGH_RE = /\b(hr|finance|banking|insurance|healthcare|legal|security|procurement|payroll|compensation|identity|access|pii|production|regulatory|compliance|policy|legal)\b/i;
const REG_RE = /\b(regulatory|payroll|compensation|banking|healthcare|legal|aml|fraud|claims|loan|covenant|tax|sar|filing)\b/i;
const ADV_RE = /\b(refus|den(y|ied|ial)|escalat|adversarial|prompt injection|exfiltrat|sensitive|pii|forbidden|unsafe|policy)\b/i;
const MULTI_RE = /\b(multi[- ]turn|messages:|changed facts|clarification|impatient|correction|user_simulator)\b/i;
const STATE_RE = /\b(expected_state_delta|expected_no_mutation|no mutation|state mutation|side effect|idempotenc)\b/i;
const HITL_RE = /\b(approval|human|confirmation|checkpoint|gate)\b/i;

function parseMatter(raw) {
  if (!raw.startsWith("---\n")) return { data: {}, content: raw };
  const end = raw.indexOf("\n---", 4);
  if (end < 0) return { data: {}, content: raw };
  const yaml = raw.slice(4, end).trim();
  const data = {};
  let current = null;
  for (const line of yaml.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) { current = m[1]; let v = m[2].trim(); if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1,-1); if (v.startsWith("[") && v.endsWith("]")) v = v.slice(1,-1).split(",").map(x=>x.trim()).filter(Boolean); data[current] = v; continue; }
    const li = line.match(/^\s*-\s*(.+)$/);
    if (li && current) { if (!Array.isArray(data[current])) data[current] = data[current] ? [data[current]] : []; data[current].push(li[1].trim()); }
  }
  return { data, content: raw.slice(end + 5) };
}
function sha256(s) { return `sha256:${createHash("sha256").update(s).digest("hex")}`; }
function slugPath(p) { return basename(p); }
function rel(p) { return relative(process.cwd(), p).replaceAll("\\", "/"); }
function isActionTool(c) { return c.type === "Agent Tool" && (/\bkind:\*\*\s*action/i.test(c.body) || /\baction[_-]/i.test(c.title || c.id || c.path) || /\bside effects\b/i.test(c.body)); }
function conceptIdFromHref(href) { return basename(href || "").replace(/\.md$/, "").replaceAll("-", "_"); }
function refIds(body, sectionTitle) {
  const section = body.match(new RegExp(`## ${sectionTitle}\\n([\\s\\S]*?)(?:\\n## |$)`, "i"))?.[1] || "";
  return [...section.matchAll(/\]\(([^)]+)\)/g)].map((m) => conceptIdFromHref(m[1]));
}

async function walk(dir, acc = []) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".git") continue;
    const p = join(dir, ent.name);
    if (ent.isDirectory()) await walk(p, acc); else if (ent.isFile() && ent.name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

export async function discoverOkfBundles({ root = "okf", spec } = {}) {
  const base = resolve(root);
  if (spec) {
    const direct = resolve(spec);
    if (existsSync(join(direct, "index.md"))) return [direct];
    const under = resolve(root, spec);
    if (existsSync(join(under, "index.md"))) return [under];
    throw new Error(`OKF spec not found: ${spec}`);
  }
  const entries = await readdir(base, { withFileTypes: true });
  const dirs = [];
  for (const e of entries) if (e.isDirectory() && existsSync(join(base, e.name, "index.md"))) dirs.push(join(base, e.name));
  return dirs.sort();
}

export async function readBundle(dir) {
  const files = await walk(dir);
  const concepts = [];
  let all = "";
  for (const file of files) {
    const raw = await readFile(file, "utf8"); all += raw;
    const parsed = parseMatter(raw);
    const data = parsed.data || {};
    const path = rel(file);
    concepts.push({ path, absPath: file, relInBundle: relative(dir, file).replaceAll("\\", "/"), type: data.type || "", title: data.title || basename(file, ".md"), id: (data.source_id || basename(file, ".md")).replaceAll("-", "_"), tags: data.tags || [], body: parsed.content || raw, raw });
  }
  return { dir, sourcePath: rel(dir), hash: sha256(all), concepts };
}

function inv(bundle) {
  const by = (re) => bundle.concepts.filter((c) => re.test(c.type) || re.test(c.relInBundle));
  const evals = by(/Eval|tests\//i); const tools = by(/Tool|tools\//i); const workflows = by(/Workflow|workflow\//i);
  return { tools: tools.length, actionTools: tools.filter(isActionTool).length, sourceSystems: by(/System|systems\//i).length, entities: by(/Table|Entity|tables\//i).length, workflowSteps: workflows.length, evals: evals.length, fixtures: by(/fixtures\//i).length, multiTurnEvals: evals.filter((c)=>MULTI_RE.test(c.raw)).length, stateAssertions: evals.filter((c)=>STATE_RE.test(c.raw)).length, adversarialEvals: evals.filter((c)=>ADV_RE.test(c.raw)).length, hitlGates: bundle.concepts.filter((c)=>HITL_RE.test(c.raw) && !/Eval/i.test(c.type)).length };
}
function risk(bundle, inventory) {
  const text = bundle.concepts.map((c)=>`${c.title} ${c.type} ${c.tags?.join(" ")} ${c.body}`).join("\n");
  const reasons=[]; if (inventory.actionTools) reasons.push(`${inventory.actionTools} action/write tool(s)`); if (inventory.hitlGates) reasons.push(`${inventory.hitlGates} human approval/confirmation reference(s)`); if (REG_RE.test(text)) reasons.push("regulated-domain keyword"); if (HIGH_RE.test(text)) reasons.push("high-risk keyword");
  const tier = REG_RE.test(text) ? "regulated" : (inventory.actionTools || inventory.hitlGates || HIGH_RE.test(text)) ? "high" : /\b(recommend|planning|analytics|internal)\b/i.test(text) ? "medium" : "low";
  return { tier, reasons: reasons.length ? reasons : ["read-only/non-sensitive signals only"] };
}
function fail(code,severity,message,evidencePath,suggestedRepair){return {code,severity,message,evidencePath,suggestedRepair};}
export function lintBundle(bundle, inventory) {
  const failures=[]; const evals=bundle.concepts.filter(c=>/Eval/i.test(c.type)||c.relInBundle.startsWith("tests/")); const tools=bundle.concepts.filter(c=>/Tool/i.test(c.type)||c.relInBundle.startsWith("tools/")); const toolIds=new Set(tools.map(t=>t.id));
  if (evals.length <= 1) failures.push(fail("OKF-EVAL-001","high",`Spec has ${evals.length} eval(s).`,`${bundle.sourcePath}/tests`,"Generate coverage obligations for happy path, negative path, HITL, state, and adversarial tests."));
  for (const e of evals) if (GENERIC_PROMPTS.some(re=>re.test(e.title)||re.test(e.body))) failures.push(fail("OKF-EVAL-002","medium","Eval prompt is generic workflow prose.",e.path,"Replace generic workflow prompt with fixture-backed deterministic assertions."));
  if (evals.length && !evals.some(e=>ADV_RE.test(e.raw))) failures.push(fail("OKF-EVAL-003","high","No negative/refusal/escalation/adversarial eval found.",`${bundle.sourcePath}/tests`,"Add negative, refusal, escalation, and adversarial coverage."));
  if (evals.length && !evals.some(e=>MULTI_RE.test(e.raw))) failures.push(fail("OKF-EVAL-004","medium","No multi-turn eval messages or simulator behavior found.",`${bundle.sourcePath}/tests`,"Add clarification, changed-facts, and impatient-user multi-turn scenarios."));
  for (const e of evals) { const refs=refIds(e.body,"Mechanisms to call"); if (refs.length && !/\b(args|arguments|inputs?)\b/i.test(e.body)) failures.push(fail("OKF-EVAL-005","high","Expected tools are listed without expected tool arguments.",e.path,"Add expected_tool_calls with deterministic args.")); for(const r of refs) if(!toolIds.has(r)) failures.push(fail("OKF-REF-001","critical",`Eval references unknown tool: ${r}.`,e.path,"Reference only tools defined in the OKF contract.")); if(!/deterministic_assertions|assert/i.test(e.body)) failures.push(fail("OKF-ASSERT-001","medium","Eval has expected outcome prose but no deterministic assertions.",e.path,"Add deterministic_assertions.")); }
  if (inventory.actionTools && inventory.stateAssertions === 0) failures.push(fail("OKF-STATE-001","critical","Action tools exist but no expected state delta or no-mutation assertion exists.",`${bundle.sourcePath}/tests`,"Add state mutation and no-mutation eval coverage for action tools."));
  if (inventory.hitlGates && !evals.some(e=>/approval|approved|denied|timeout|confirmation/i.test(e.raw))) failures.push(fail("OKF-HITL-001","high","Human approval/confirmation gate exists but no approval eval exists.",`${bundle.sourcePath}/tests`,"Add approval-required, approval-denied, and approval-timeout evals."));
  if (evals.length && !evals.some(e=>/prompt injection|exfiltrat|sensitive|pii|forbidden|unsafe/i.test(e.raw))) failures.push(fail("OKF-SEC-001","high","No prompt-injection, data-exfiltration, excessive-agency, or insecure-output eval found.",`${bundle.sourcePath}/tests`,"Add adversarial security evals."));
  failures.push(fail("OKF-PROOF-001","medium","No hash-bound proof pack was found for OKF, evals, fixtures, and generator version.",`${bundle.sourcePath}/proof`,"Run proof after enrichment and bind proof to OKF/eval/fixture/generator hashes."));
  return failures;
}
function score(inventory, failures) {
  const counts = { evalDiversity: Math.min(100, inventory.evals*12), trajectoryAssertions: failures.some(f=>f.code==="OKF-EVAL-005")?20:80, toolParameterAssertions: failures.some(f=>f.code==="OKF-EVAL-005")?0:80, stateAssertions: inventory.actionTools ? Math.min(100, inventory.stateAssertions*25) : 100, multiTurnSimulation: Math.min(100, inventory.multiTurnEvals*25), domainInvariants: 40, adversarialSecurity: Math.min(100, inventory.adversarialEvals*25), fixtureRealism: failures.some(f=>f.code==="OKF-DATA-001")?30:60, proofFreshness: 0 };
  counts.total = Math.round(Object.values(counts).reduce((a,b)=>a+b,0)/Object.keys(counts).length);
  return counts;
}
export function computeStatus(report) { if (!report.contractValid) return "L0"; if (report.inventory.evals === 0) return "L1"; if (report.score.total < 60) return "L2"; if (report.score.total < 75) return "L3"; if (!report.allowedToClaimProven) return "L4"; return "L5"; }
export async function auditSpec(dir) {
  const bundle=await readBundle(dir); const inventory=inv(bundle); const failures=lintBundle(bundle, inventory); const sc=score(inventory, failures); const rk=risk(bundle, inventory); const root=bundle.concepts.find(c=>c.relInBundle==="index.md") || bundle.concepts[0];
  const report={ id: slugPath(dir), slug: slugPath(dir), title: root?.title || slugPath(dir), vertical: root?.tags?.find(t=>!['okf','brd'].includes(t)), domain: undefined, sourcePath: bundle.sourcePath, hashes:{ okfHash: bundle.hash }, risk: rk, contractValid: true, currentStatus: "L0", targetStatus: rk.tier === "low" ? "L3" : "L4", score: sc, inventory, failedRules: failures, gaps: failures.map(f=>({ code:f.code, severity:f.severity, message:f.message, suggestedRepair:f.suggestedRepair })), recommendedDomainPacks: [], allowedToClaimProven: false };
  report.currentStatus = computeStatus(report); return report;
}
export async function auditQuality({ all=false, spec, root="okf", changed=false } = {}) {
  let dirs = await discoverOkfBundles({ root, spec });
  if (changed) { const { execa } = await import("execa"); const out = await execa("git", ["diff", "--name-only", "HEAD"], { reject:false }); const changedFiles = new Set(out.stdout.split(/\r?\n/).filter(Boolean)); dirs = dirs.filter(d => [...changedFiles].some(f => f.startsWith(rel(d)+"/"))); }
  const specs=[]; for (const d of dirs) specs.push(await auditSpec(d));
  const summary={ total: specs.length, byStatus:Object.fromEntries(STATUSES.map(s=>[s,specs.filter(r=>r.currentStatus===s).length])), byRisk:Object.fromEntries(["low","medium","high","regulated"].map(r=>[r,specs.filter(s=>s.risk.tier===r).length])), averageScore: specs.length ? Math.round(specs.reduce((a,s)=>a+s.score.total,0)/specs.length) : 0, failedRules: specs.reduce((a,s)=>a+s.failedRules.length,0) };
  return { schemaVersion: QUALITY_SCHEMA_VERSION, generatedAt: new Date().toISOString(), libraryHash: sha256(specs.map(s=>s.hashes.okfHash).join("\n")), summary, specs };
}
export function renderQualityMarkdown(report) { return [`# OKF Quality Audit`, ``, `Generated: ${report.generatedAt}`, ``, `## Summary`, ``, `- Total blueprints: ${report.summary.total}`, `- Average score: ${report.summary.averageScore}`, `- Failed rules: ${report.summary.failedRules}`, ``, `## Status`, ...Object.entries(report.summary.byStatus).map(([k,v])=>`- ${k}: ${v}`), ``, `## Specs`, ...report.specs.map(s=>`- ${s.slug}: ${s.currentStatus} · ${s.risk.tier} · score ${s.score.total} · ${s.failedRules.length} gap(s)`) , ``].join("\n"); }
