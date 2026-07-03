#!/usr/bin/env bun
/**
 * gen-catalog.mjs — build the docs "periodic table of agents" data payload.
 *
 * Run via bun (it imports the presentation `agents.ts` constant directly).
 * Emits `apps/docs/src/data/agent-catalog.json`, the single source the docs
 * `PeriodicTable.astro` grid and the per-agent detail pages render from.
 *
 * Sources of truth (nothing here is authored — it is derived):
 *   grid + legend ── apps/presentation/src/constants/agents.ts   (AGENTS, TRIGGER_CONFIG)
 *                    apps/presentation/src/constants/domains.ts   (domain titles)
 *                    packages/design/src/design-tokens.ts         (DOMAIN_COLORS, LAYER_STYLES, TRIGGER_STYLES)
 *                    apps/presentation/src/departments/*.ts        (department ranges + titles)
 *   uc → spec join ─ apps/presentation/src/config/slides.tsx      (uc-id → use-case component)
 *   per-agent spec ─ apps/factory/src/use-case-source-map.generated.json  (systems + integration sources)
 *                    apps/factory/src/agent-spec-registry.generated.json  (family id, quality, buildability)
 *                    agents-batch.json                            (target stage, row policy, goal code)
 *
 * The presentation constants pull `lucide-react` (and its `react` peer) which
 * does not resolve from a standalone script, so only the dependency-free
 * `agents.ts` is imported; the rest is parsed with targeted regexes. The
 * generated JSON is gitignored — it is rebuilt on every docs sync/build.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { marked } from "marked";
import { buildBundle, stableTimestamp } from "../../factory/scripts/spec-to-okf.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HERE, "..");
const REPO = resolve(APP, "..", "..");
const p = (...s) => resolve(REPO, ...s);

const read = (rel) => readFileSync(p(rel), "utf8");

// ── Tailwind class → hex ─────────────────────────────────────────────────────
// The docs site has no Tailwind, so the layer/trigger colors the deck expresses
// as utility classes are resolved to concrete hex here. Only the tokens the
// periodic table actually uses are mapped (Tailwind v3 palette).
const TW = {
  "emerald-500": "#10b981", "emerald-600": "#059669",
  "blue-500": "#3b82f6", "blue-600": "#2563eb",
  "amber-500": "#f59e0b", "amber-600": "#d97706", "amber-700": "#b45309",
  "slate-500": "#64748b", "slate-600": "#475569",
  "rose-400": "#fb7185", "rose-500": "#f43f5e", "rose-600": "#e11d48",
};
const twHex = (cls) => {
  const token = String(cls).replace(/^(bg|text|border)-/, "");
  return TW[token] ?? "#5f6368";
};

// ── 1. Grid rows (imported — agents.ts has no imports) ───────────────────────
const agentsMod = await import(pathToFileURL(p("apps/presentation/src/constants/agents.ts")).href);
const AGENTS = agentsMod.AGENTS;
const TRIGGER_CONFIG = agentsMod.TRIGGER_CONFIG;

// ── 2. Domain titles ─────────────────────────────────────────────────────────
const domainsSrc = read("apps/presentation/src/constants/domains.ts");
const domainTitle = new Map(); // num → title
for (const m of domainsSrc.matchAll(/id:\s*"domain-(\d+)",\s*title:\s*"([^"]+)"/g)) {
  domainTitle.set(Number(m[1]), m[2]);
}

// ── 3. Design tokens (colors + layer/trigger legend) ─────────────────────────
const tokensSrc = read("packages/design/src/design-tokens.ts");

const DOMAIN_COLORS = new Map(); // num → hex
const dcBlock = tokensSrc.match(/DOMAIN_COLORS[^{]*\{([\s\S]*?)\n\};/);
for (const m of (dcBlock?.[1] ?? "").matchAll(/(\d+):\s*"(#[0-9a-fA-F]{3,8})"/g)) {
  DOMAIN_COLORS.set(Number(m[1]), m[2]);
}

const LAYERS = {}; // 1..4 → { label, desc, color }
for (const m of tokensSrc.matchAll(
  /(\d):\s*\{\s*label:\s*"([^"]+)",\s*desc:\s*"([^"]+)",\s*dot:\s*"([^"]+)",\s*color:\s*"([^"]+)"/g,
)) {
  LAYERS[m[1]] = { label: m[2], desc: m[3], color: twHex(m[4]) };
}

const TRIGGERS = {}; // event/chat/scheduled → { label, color }
const tsBlock = tokensSrc.match(/TRIGGER_STYLES[^{]*\{([\s\S]*?)\n\}/);
for (const m of (tsBlock?.[1] ?? "").matchAll(
  /(event|chat|scheduled):\s*\{\s*color:\s*"([^"]+)",[^}]*label:\s*"([^"]+)"/g,
)) {
  TRIGGERS[m[1]] = { label: m[3], color: twHex(m[2]) };
}

// ── 4. Departments (registry order = story order) ────────────────────────────
const deptFiles = ["hr", "procurement", "finance", "it", "marketing"];
const departments = deptFiles.map((file) => {
  const src = read(`apps/presentation/src/departments/${file}.ts`);
  const field = (name) => src.match(new RegExp(`${name}:\\s*"([^"]*)"`))?.[1] ?? "";
  const range = src.match(/domainRange:\s*\[(\d+),\s*(\d+)\]/);
  return {
    key: field("key") || file,
    label: field("label"),
    shortLabel: field("shortLabel"),
    accentColor: field("accentColor"),
    domainRange: [Number(range?.[1]), Number(range?.[2])],
    title: field("periodicTableTitle"),
    subtitle: field("periodicTableSubtitle"),
  };
});
const deptOfDomain = (num) =>
  departments.find((d) => num >= d.domainRange[0] && num <= d.domainRange[1])?.key ?? null;

// ── 5. uc-id → use-case component → source-file basename ──────────────────────
const slidesSrc = read("apps/presentation/src/config/slides.tsx");
const importPath = new Map(); // ComponentName → import path
for (const m of slidesSrc.matchAll(/const\s+(\w+)\s*=\s*React\.lazy\(\(\)\s*=>\s*import\("([^"]+)"\)/g)) {
  importPath.set(m[1], m[2]);
}
const ucBasename = new Map(); // uc-id → PascalCase file basename
for (const m of slidesSrc.matchAll(
  /id:\s*"(uc-\d+)"[\s\S]*?fallback=\{<LazyFallback\s*\/>\}>\s*<(\w+)\s*\/>/g,
)) {
  const path = importPath.get(m[2]);
  if (path) ucBasename.set(m[1], path.split("/").pop());
}

// ── 6. Per-agent spec projections (already generated + drift-gated) ──────────
const sourceMap = JSON.parse(read("apps/factory/src/use-case-source-map.generated.json"));
const smByBasename = new Map(sourceMap.useCases.map((u) => [u.id, u]));

const registry = JSON.parse(read("apps/factory/src/agent-spec-registry.generated.json"));
const regByTitle = new Map(registry.entries.map((e) => [e.title, e]));

const batch = JSON.parse(read("agents-batch.json"));
const batchById = new Map(batch.map((b) => [b.useCaseId, b]));

// ── Assemble ─────────────────────────────────────────────────────────────────
const misses = [];
const agents = AGENTS.map((a) => {
  const num = Number(a.agentId.replace("A-", ""));
  const basename = ucBasename.get(a.id);
  const sm = basename ? smByBasename.get(basename) : null;
  const reg = sm ? regByTitle.get(sm.title) : null;
  const slug = reg?.id ?? null;
  const b = slug ? batchById.get(slug) : null;
  if (!sm || !slug) misses.push({ id: a.id, shortName: a.shortName, basename, hasSm: !!sm, hasReg: !!reg });

  const layer = LAYERS[a.layer] ?? { label: `L${a.layer}`, desc: "", color: "#5f6368" };
  const trig = TRIGGERS[a.triggerType] ?? { label: a.triggerType, color: "#5f6368" };

  return {
    ucId: a.id,
    agentId: a.agentId,
    num,
    slug,
    shortName: a.shortName,
    title: sm?.title ?? a.shortName,
    domain: a.domain,
    domainTitle: domainTitle.get(a.domain) ?? `Domain ${a.domain}`,
    domainColor: DOMAIN_COLORS.get(a.domain) ?? "#5f6368",
    department: deptOfDomain(a.domain),
    layer: a.layer,
    layerLabel: layer.label,
    layerDesc: layer.desc,
    layerColor: layer.color,
    triggerType: a.triggerType,
    triggerLabel: trig.label,
    triggerColor: trig.color,
    hitl: !!a.hitl,
    hitlActor: a.hitlActor ?? null,
    hitlAction: a.hitlAction ?? null,
    // ── detail (per-agent page) ──
    detail: {
      systems: sm?.systems ?? b?.systems ?? [],
      sources: sm?.sources ?? [],
      goal: b?.goal ?? null,
      targetStage: b?.targetStage ?? null,
      rows: b?.rows ?? null,
      buildable: reg?.registry?.build?.enabled ?? null,
      buildReason: reg?.registry?.build?.reason ?? null,
      maturity: reg?.registry?.quality?.maturity ?? null,
      hasBehaviorContract: reg?.hasBehaviorContract ?? false,
      sourcePath: sm?.path ?? null,
    },
  };
});

// Domains carrying live agent counts + department linkage
const domains = [...domainTitle.keys()]
  .sort((x, y) => x - y)
  .map((num) => ({
    id: `domain-${num}`,
    num,
    title: domainTitle.get(num),
    color: DOMAIN_COLORS.get(num) ?? "#5f6368",
    department: deptOfDomain(num),
    agentCount: agents.filter((a) => a.domain === num).length,
  }));

// Department agent counts
for (const d of departments) {
  d.agentCount = agents.filter((a) => a.department === d.key).length;
}

const legend = {
  layers: Object.entries(LAYERS).map(([key, v]) => ({ key: Number(key), ...v })),
  triggers: Object.entries(TRIGGERS).map(([key, v]) => ({ key, ...v })),
};

const payload = {
  generatedBy: "apps/docs/scripts/gen-catalog.mjs",
  meta: {
    totalAgents: agents.length,
    totalDomains: domains.length,
    totalDepartments: departments.length,
    hitlCount: agents.filter((a) => a.hitl).length,
  },
  departments,
  domains,
  legend,
  agents,
};

// ── Report + fail loud on unresolved joins ───────────────────────────────────
console.log(
  `catalog: ${agents.length} agents · ${domains.length} domains · ${departments.length} departments · ${payload.meta.hitlCount} HITL`,
);
if (misses.length) {
  console.error(`✖ ${misses.length} agents did not resolve to a spec (join drift):`);
  for (const m of misses.slice(0, 20)) console.error(`   ${m.id} "${m.shortName}" basename=${m.basename} sm=${m.hasSm} reg=${m.hasReg}`);
  process.exit(1);
}

const OUT = resolve(APP, "src/data/agent-catalog.json");
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n");
console.log(`→ ${OUT.replace(REPO + "/", "")}`);

// ── OKF: the canonical spec bundle per agent ─────────────────────────────────
// Each agent's full spec (behaviorContract + generationSpec) is converted into
// its Open Knowledge Format bundle by the factory's own `buildBundle` — the
// same deterministic, LLM-free converter behind `spec-to-okf.mjs`. We render
// each concept's markdown body to HTML at build time so the docs per-agent page
// can present the real OKF, not a re-derivation. Written to its own file so the
// (large) bodies never load on the periodic-table page.
const UC_PATH = p("apps/factory/generated/use-cases.generated.json");
if (!existsSync(UC_PATH)) {
  console.log("catalog: materializing use-cases.generated.json (bun run catalog)…");
  execFileSync("bun", [p("apps/factory/scripts/sync-use-cases-from-slides.mjs")], { stdio: "inherit" });
}
const specById = new Map(JSON.parse(readFileSync(UC_PATH, "utf8")).map((s) => [s.id, s]));

// Sections in reading order; each pulls the leaf concepts under its bundle dir
// (the `<dir>/index` link-lists and the root index/log are skipped).
const OKF_SECTIONS = [
  { key: "playbook", label: "Playbook", match: (r) => r === "playbook" },
  { key: "workflow", label: "Workflow stages", match: (r) => r.startsWith("workflow/") && r !== "workflow/index" },
  { key: "tools", label: "Agent tools", match: (r) => r.startsWith("tools/") && r !== "tools/index" },
  { key: "systems", label: "Source systems", match: (r) => r.startsWith("systems/") && r !== "systems/index" },
  { key: "tables", label: "Data entities", match: (r) => r.startsWith("tables/") && r !== "tables/index" },
  { key: "queries", label: "Answerable queries", match: (r) => r.startsWith("queries/") && r !== "queries/index" },
  { key: "tests", label: "Eval scenarios", match: (r) => r.startsWith("tests/") && r !== "tests/index" },
  { key: "documents", label: "Source documents", match: (r) => r.startsWith("documents/") && r !== "documents/index" },
  { key: "kpis", label: "KPIs", match: (r) => r === "kpis" },
  { key: "evals", label: "Golden evals", match: (r) => r === "evals" },
];

const renderBody = (md) => {
  const stripped = String(md || "").replace(/^#\s.*\n+/, ""); // drop the leading H1 (dup of title)
  const html = marked.parse(stripped, { async: false });
  // Neutralize bundle-absolute cross-links (/tools/foo.md) — there is no
  // per-concept route in the docs; keep the link text as a plain reference.
  return html.replace(/<a href="\/[^"]*">([\s\S]*?)<\/a>/g, '<span class="okf-xref">$1</span>');
};

const okfMisses = [];
const okfBySlug = {};
for (const a of agents) {
  const spec = specById.get(a.slug);
  if (!spec) {
    okfMisses.push(a.slug);
    continue;
  }
  const bundle = buildBundle(spec, { timestamp: stableTimestamp(spec) });
  const sections = OKF_SECTIONS.map((sec) => ({
    key: sec.key,
    label: sec.label,
    concepts: bundle
      .filter((c) => sec.match(c.relPath))
      .map((c) => ({
        title: c.fields?.title || sec.label,
        type: c.fields?.type || "",
        html: renderBody(c.body),
      })),
  })).filter((sec) => sec.concepts.length);
  okfBySlug[a.slug] = {
    conceptCount: bundle.filter((c) => !["index", "log"].includes(c.relPath) && !c.relPath.endsWith("/index")).length,
    sections,
  };
}

const OKF_OUT = resolve(APP, "src/data/agent-okf.json");
writeFileSync(OKF_OUT, JSON.stringify(okfBySlug) + "\n");
console.log(
  `okf: ${Object.keys(okfBySlug).length} bundles${okfMisses.length ? ` · ${okfMisses.length} without a spec` : ""} → ${OKF_OUT.replace(REPO + "/", "")}`,
);
if (okfMisses.length > 10) {
  console.error(`✖ ${okfMisses.length} agents have no spec in the catalog:`, okfMisses.slice(0, 10));
  process.exit(1);
}
