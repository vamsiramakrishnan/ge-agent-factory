// factory-catalog-search — catalog/use-case/agent-spec search (`ge usecases`,
// `ge specs`, catalog id resolution). Verbatim extraction from factory-core.mjs
// (see AGENTS.md / REFACTOR-HANDOFF.md §9 methodology: verbatim move, dependency
// injection where needed, re-export from factory-core.mjs to preserve its public
// API contract).

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseList } from "@ge/std/list";
import { readJson } from "@ge/std/json-io";
import { loadInterviewSpecEntries } from "./factory-catalog.mjs";
import { DEPARTMENTS } from "./state-paths.mjs";

// Same-directory leaf constant, computed independently (matches state-paths.mjs's
// own pattern) rather than importing REPO_ROOT back from factory-core.mjs, which
// would create an import cycle.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CATALOG_PATH = join(REPO_ROOT, "apps/factory/generated/use-cases.generated.json");
const AGENT_SPEC_REGISTRY_PATH = join(REPO_ROOT, "apps/factory/src/agent-spec-registry.generated.json");
const GEN_DIR = join(REPO_ROOT, "apps/factory");

// ── catalog ───────────────────────────────────────────────────────────────────
export async function loadCatalog() {
  if (!existsSync(CATALOG_PATH)) {
    throw new Error(`catalog not found: ${CATALOG_PATH} (generated artifact — run \`npm run use-cases:sync\`)`);
  }
  // Read the JSON artifact fresh each call so a regenerated catalog is picked up
  // without restarting a long-running daemon.
  const generated = JSON.parse(readFileSync(CATALOG_PATH, "utf8"));
  let interviewEntries = [];
  try {
    interviewEntries = await loadInterviewSpecEntries({ repoRoot: GEN_DIR });
  } catch {
    interviewEntries = [];
  }
  const byId = new Map(generated.map((entry) => [entry.id, entry]));
  for (const entry of interviewEntries) byId.set(entry.id, entry);
  return [...byId.values()];
}

/**
 * Resolve ANY agent id form (catalog slug, uc-NNNN, A-NNNN, numeric) to the catalog id.
 * Uses @ge/agent-resolver to normalize ids and match against catalog entries.
 * Returns the catalog id on match, or null if no match.
 */
export async function resolveCatalogId(anyId) {
  if (!anyId) return null;
  try {
    const { candidateKeys, normalizeAgentId } = await import("@ge/agent-resolver");
    const catalog = await loadCatalog();
    const keys = candidateKeys(anyId);
    const normalized = normalizeAgentId(anyId);

    // Try exact match on id/slug first
    for (const key of keys) {
      const entry = catalog.find((c) => c.id === key);
      if (entry) return entry.id;
    }

    // Try matching subtitle prefix if we have an A-<num> form
    if (normalized.agentId) {
      const agentIdPrefix = `${normalized.agentId} `;
      const entry = catalog.find((c) => c.subtitle?.startsWith(agentIdPrefix));
      if (entry) return entry.id;
    }

    return null;
  } catch {
    return null;
  }
}
export async function listUsecases({ department, search, limit } = {}) {
  let cases = await loadCatalog();
  if (department) cases = cases.filter((u) => u.department === department);
  if (search) { const q = search.toLowerCase(); cases = cases.filter((u) => `${u.id} ${u.title}`.toLowerCase().includes(q)); }
  const byDept = {};
  for (const u of cases) byDept[u.department] = (byDept[u.department] || 0) + 1;
  return { total: cases.length, byDepartment: byDept, useCases: cases.slice(0, limit || cases.length).map((u) => ({ id: u.id, title: u.title, department: u.department })) };
}

function specSearchText(spec) {
  return [
    spec.id,
    spec.title,
    spec.department,
    spec.domainId,
    spec.persona,
    spec.subtitle,
    spec.description,
    spec.familyId,
    spec.variantId,
    spec.variantLabel,
    ...(spec.systems || []),
  ].filter(Boolean).join(" ").toLowerCase();
}

function matchesSpecSearch(spec, search) {
  const terms = String(search || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const text = specSearchText(spec);
  return terms.every((term) => text.includes(term));
}

function splitCsvLike(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return parseList(String(value || ""));
}

function summarizeSpec(usecase, registryEntry) {
  const registry = registryEntry?.registry || {};
  const variant = registry.variant || {};
  return {
    id: usecase.id,
    title: usecase.title,
    department: usecase.department || registryEntry?.department || null,
    domainId: usecase.domainId || registryEntry?.domainId || null,
    persona: usecase.persona || null,
    subtitle: usecase.subtitle || null,
    systems: usecase.systems || registryEntry?.systems || [],
    source: registry.sourceKind || "slide",
    sourcePath: usecase.sourcePath || registry.sourcePath || null,
    familyId: variant.familyId || registry.familyId || usecase.id,
    variantId: variant.variantId || usecase.id,
    variantLabel: variant.label || "Canonical",
    buildable: registryEntry?.buildable !== false,
    hasBehaviorContract: registryEntry?.hasBehaviorContract === true,
    description: (usecase.statusQuo?.[0] || usecase.agentification?.[0] || usecase.subtitle || "").trim(),
  };
}

export async function listSpecs({ department, search, limit = 100, ids = [] } = {}) {
  const catalog = await loadCatalog();
  const registry = readJson(AGENT_SPEC_REGISTRY_PATH, { entries: [], summary: {} });
  const registryById = new Map((registry.entries || []).map((entry) => [entry.id, entry]));
  const idSet = new Set(splitCsvLike(ids));
  const q = String(search || "").trim().toLowerCase();
  const interviewEntries = await loadInterviewSpecEntries({ repoRoot: GEN_DIR });
  const byId = new Map();
  for (const usecase of catalog) byId.set(usecase.id, summarizeSpec(usecase, registryById.get(usecase.id)));
  for (const entry of interviewEntries) byId.set(entry.id, summarizeSpec(entry, entry));
  let specs = [...byId.values()];
  if (department) specs = specs.filter((spec) => spec.department === department);
  if (idSet.size) specs = specs.filter((spec) => idSet.has(spec.id));
  if (q) specs = specs.filter((spec) => matchesSpecSearch(spec, q));
  specs.sort((a, b) => `${a.department || ""}/${a.title}`.localeCompare(`${b.department || ""}/${b.title}`));
  const byDepartment = {};
  for (const spec of specs) byDepartment[spec.department || "unknown"] = (byDepartment[spec.department || "unknown"] || 0) + 1;
  const capped = Math.max(1, Math.min(Number(limit) || 100, 1000));
  return {
    kind: "ge.agent_spec.catalog",
    version: 1,
    total: specs.length,
    returned: Math.min(specs.length, capped),
    byDepartment,
    departments: DEPARTMENTS,
    summary: registry.summary || {},
    specs: specs.slice(0, capped),
  };
}
