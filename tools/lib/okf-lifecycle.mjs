// tools/lib/okf-lifecycle.mjs — the agent lifecycle over OKF bundles:
// customize (scaffold a variant bundle from a base) → register (flip
// provenance draft→registered + refresh the catalog) → track (report one
// agent's lifecycle state and variant lineage).
//
// Library-code contract (AGENTS.md): every function here RETURNS data on
// success and THROWS (DxError where a fix is known) on failure — no
// console.log, no process.exit. The `ge` CLI (tools/ge/okf.mjs,
// tools/ge/agents.mjs) and the MCP server (tools/mcp-server.mjs) are the
// render boundaries.
//
// OKF ROOT RESOLUTION — the one corpus convention:
// Bundles live one-per-agent at `<okf root>/<agent-id>/`. The root is
// `GE_OKF_ROOT` when set (absolute, or relative to cwd), else `okf/` under
// the current working directory. Tests inject a fixture corpus by passing
// `okfRoot` explicitly or setting the env var — never by touching the real
// repo corpus.
//
// Catalog regeneration is a black box on purpose: register shells to
// `bun run catalog` (whatever that script currently is) and then checks the
// generated catalog for the agent id. A catalog script that predates the OKF
// corpus is a soft outcome (catalogEntry: false), not a failure.

import { spawnSync } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { DxError } from "@ge/std/dx-error";
// Relative package paths, matching tools/ge/okf.mjs — the repo-root workspace
// does not list @ge/okf as a dependency, and tools/* is not its own package.
import {
  OKF_VERSION,
  findUseCase,
  readConceptFile,
  renderConcept,
  slug,
  writeConceptFile,
} from "../../packages/okf/src/index.mjs";
import {
  compileOkfBundle,
  renderVariantBinding,
  toDxError,
} from "../../packages/okf/src/compile/index.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CATALOG_PATH = join(REPO_ROOT, "apps", "factory", "generated", "use-cases.generated.json");

/** The OKF corpus root: GE_OKF_ROOT override, else `okf/` under cwd. */
export function okfRoot(explicit) {
  const raw = explicit || process.env.GE_OKF_ROOT || "okf";
  return isAbsolute(raw) ? raw : resolve(raw);
}

const isDir = (path) => stat(path).then((s) => s.isDirectory()).catch(() => false); // best-effort: "does this candidate directory exist" is the question being asked

/**
 * Resolve a bundle reference — an agent id under the OKF root, or an explicit
 * directory path — to `{ id, dir }`. An id must resolve to an existing
 * directory; a path just has to exist.
 */
export async function resolveBundle(ref, { root } = {}) {
  const corpus = okfRoot(root);
  const candidates = ref.includes("/") || ref.includes("\\")
    ? [resolve(ref)]
    : [join(corpus, ref), resolve(ref)];
  for (const dir of candidates) {
    if (await isDir(dir)) return { id: basename(dir), dir };
  }
  throw new DxError(`OKF bundle "${ref}" not found`, {
    where: candidates[0],
    why: `neither ${candidates.join(" nor ")} is a directory (corpus root: ${corpus})`,
    fix: `ge okf compile --from spec --to bundle --spec <spec.json> --out ${join(corpus, slug(ref))}`,
  });
}

/** Parse repeatable `from=to` pairs (each item may also be comma-separated). */
export function parsePairs(values, flag) {
  const items = [].concat(values ?? [])
    .flatMap((v) => String(v).split(","))
    .map((v) => v.trim())
    .filter(Boolean);
  const pairs = {};
  for (const item of items) {
    const eq = item.indexOf("=");
    if (eq <= 0 || eq === item.length - 1) {
      throw new DxError(`invalid ${flag} value "${item}"`, {
        where: flag,
        why: `${flag} takes <from>=<to> pairs`,
        fix: `${flag} old_value=new_value`,
      });
    }
    pairs[item.slice(0, eq).trim()] = item.slice(eq + 1).trim();
  }
  return pairs;
}

function compileSummary(result) {
  return {
    errors: result.errors.length,
    systems: result.ir.systems.map((s) => s.id),
    tools: result.ir.tools.length,
    workflowSteps: result.ir.workflow?.steps?.length ?? 0,
  };
}

/**
 * Scaffold the MINIMAL variant bundle for `id` from base bundle `base`:
 * a root index.md (variant_of + provenance) and a Variant Binding concept
 * rendered through @ge/okf/compile's authoring templates — then compile the
 * new bundle against its base and throw a structured DxError if the variant
 * does not resolve (bad swap target, unknown workflow step, ...).
 *
 * Deterministic by contract: identical inputs produce identical bytes (no
 * clock — provenance_created_at is stamped at register time, not here).
 */
export async function customizeVariant({ base, id, swapSystems = {}, renames = {}, vertical, out, root } = {}) {
  if (!base) throw new DxError("a variant needs a base bundle", { where: "--base", why: "customize scaffolds a variant OF something", fix: "ge okf customize --base <agent-id> --id <new-agent-id>" });
  if (!id) throw new DxError("a variant needs its own agent id", { where: "--id", why: "the id names the bundle directory and the catalog entry", fix: "ge okf customize --base <agent-id> --id <new-agent-id>" });
  const resolvedBase = await resolveBundle(base, { root });
  const newId = slug(id);
  const outDir = out ? resolve(out) : join(okfRoot(root), newId);

  const variantKind = vertical ? "vertical" : Object.keys(swapSystems).length ? "source-swap" : "custom";
  const bindings = {};
  if (Object.keys(swapSystems).length) bindings.systems = swapSystems;
  if (Object.keys(renames).length) bindings.terminology = renames;
  if (vertical) {
    bindings.policyOverlays = [{
      kind: "refusal",
      rule: `Apply the ${vertical} vertical's regulatory constraints before answering (edit this overlay).`,
    }];
  }

  const index = {
    relPath: "index",
    frontmatter: {
      okf_version: OKF_VERSION,
      type: "Knowledge Bundle",
      title: newId,
      variant_of: resolvedBase.id,
      variant_kind: variantKind,
      provenance_origin: "variant",
      provenance_source_ref: resolvedBase.id,
      provenance_version: "0",
      provenance_status: "draft",
      provenance_lineage: [resolvedBase.id],
    },
    body: `# ${newId}\n\nVariant of \`${resolvedBase.id}\` (${variantKind}). Concepts added here overlay the base; [variant bindings](/variant/bindings.md) rewrite it.`,
  };
  const binding = renderVariantBinding(bindings);
  const files = [];
  for (const entry of [index, binding]) {
    const abs = join(outDir, `${entry.relPath}.md`);
    await writeConceptFile(abs, renderConcept(entry.frontmatter, entry.body));
    files.push(abs);
  }

  const result = await compileOkfBundle(outDir, { baseDir: resolvedBase.dir });
  if (result.errors.length) {
    const err = toDxError(result.errors, outDir);
    err.files = files; // the scaffold stays on disk for fixing
    throw err;
  }
  return {
    apiVersion: "ge.dev/v1",
    kind: "OkfCustomizeResult",
    agentId: newId,
    baseId: resolvedBase.id,
    variantKind,
    out: outDir,
    files,
    compile: compileSummary(result),
    next: `ge agents register --bundle ${outDir}`,
  };
}

// Read the root index.md concept of a bundle; null when it doesn't exist.
async function readRootIndex(dir) {
  try {
    return await readConceptFile(join(dir, "index.md"));
  } catch {
    return null; // caller decides whether a missing root index is fatal
  }
}

function provenanceOf(frontmatter = {}) {
  const p = {};
  if (frontmatter.provenance_origin) p.origin = frontmatter.provenance_origin;
  if (frontmatter.provenance_source_ref) p.sourceRef = frontmatter.provenance_source_ref;
  if (frontmatter.provenance_version !== undefined) p.version = Number(frontmatter.provenance_version) || 0;
  if (frontmatter.provenance_owner) p.owner = frontmatter.provenance_owner;
  if (frontmatter.provenance_status) p.status = frontmatter.provenance_status;
  if (frontmatter.provenance_created_at) p.createdAt = frontmatter.provenance_created_at;
  if (Array.isArray(frontmatter.provenance_lineage)) p.lineage = frontmatter.provenance_lineage;
  return Object.keys(p).length ? p : null;
}

async function catalogHasAgent(agentId, catalogPath) {
  try {
    const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
    return Boolean(findUseCase(catalog, agentId));
  } catch {
    return false; // no generated catalog (yet) — report absence, don't fail
  }
}

// Compile a bundle for lifecycle purposes. When the root declares variant_of
// and the sibling-path convention won't find the base (explicit --bundle path
// outside the corpus), fall back to `<okf root>/<baseId>`.
async function compileForLifecycle(dir, { root } = {}) {
  const index = await readRootIndex(dir);
  const baseId = index?.frontmatter?.variant_of;
  let baseDir;
  if (baseId && !(await isDir(join(dirname(dir), baseId)))) {
    const corpusBase = join(okfRoot(root), baseId);
    if (await isDir(corpusBase)) baseDir = corpusBase;
  }
  return compileOkfBundle(dir, { baseDir });
}

/**
 * Register a bundle as a tracked agent: compile it (structured DxError on any
 * compile error), flip provenance draft→registered + bump provenance_version
 * (+1 per register run) + stamp owner/created_at — a surgical frontmatter
 * edit through @ge/okf parse/render, preserving every other key and the body
 * — then re-run `bun run catalog` so the generated registry picks it up.
 */
export async function registerBundle({ bundle, owner, root, catalog = true, catalogPath = CATALOG_PATH, now = () => new Date().toISOString() } = {}) {
  if (!bundle) throw new DxError("register needs a bundle", { where: "--bundle", why: "nothing to register", fix: "ge agents register --bundle <agent-id | path>" });
  const { id: agentId, dir } = await resolveBundle(bundle, { root });

  const result = await compileForLifecycle(dir, { root });
  if (result.errors.length) throw toDxError(result.errors, dir);

  const indexPath = join(dir, "index.md");
  const index = await readRootIndex(dir);
  if (!index) {
    throw new DxError(`bundle ${dir} has no root index.md`, {
      where: indexPath,
      why: "provenance lives in the root index.md frontmatter; without it there is nothing to register",
      fix: `ge okf repair ${dir} --dry-run=false`,
    });
  }
  const fm = { ...index.frontmatter };
  const previousVersion = Number(fm.provenance_version) || 0;
  if (!fm.provenance_origin) fm.provenance_origin = "manual";
  fm.provenance_status = "registered";
  fm.provenance_version = String(previousVersion + 1);
  if (owner) fm.provenance_owner = owner;
  if (!fm.provenance_created_at) fm.provenance_created_at = now();
  await writeConceptFile(indexPath, renderConcept(fm, index.body));

  let catalogRun = { ran: false, ok: null };
  if (catalog) {
    const proc = spawnSync("bun", ["run", "catalog"], { cwd: REPO_ROOT, encoding: "utf8" });
    catalogRun = { ran: true, ok: proc.status === 0 };
    if (proc.status !== 0) catalogRun.error = (proc.stderr || proc.stdout || "").trim().split("\n").slice(-5).join("\n");
  }

  return {
    apiVersion: "ge.dev/v1",
    kind: "GeAgentRegisterResult",
    agentId,
    bundle: dir,
    version: previousVersion + 1,
    status: "registered",
    owner: fm.provenance_owner || null,
    catalogEntry: await catalogHasAgent(agentId, catalogPath),
    catalog: catalogRun,
    compile: compileSummary(result),
    next: `ge agents track --id ${agentId}`,
  };
}

/**
 * Report one agent's lifecycle state: its provenance block, whether the
 * generated registry knows it, and the variant lineage chain (variant_of
 * walked to the root base, cycle-guarded).
 */
export async function trackAgent({ id, root, catalogPath = CATALOG_PATH } = {}) {
  if (!id) throw new DxError("track needs an agent id", { where: "--id", why: "nothing to track", fix: "ge agents track --id <agent-id>" });
  const { id: agentId, dir } = await resolveBundle(id, { root });
  const index = await readRootIndex(dir);
  const provenance = provenanceOf(index?.frontmatter);

  const lineage = [];
  const seen = new Set([agentId]);
  let currentDir = dir;
  let baseId = index?.frontmatter?.variant_of;
  while (baseId) {
    if (seen.has(baseId)) {
      lineage.push({ id: baseId, cycle: true });
      break;
    }
    seen.add(baseId);
    const siblingDir = join(dirname(currentDir), baseId);
    const corpusDir = join(okfRoot(root), baseId);
    const baseDir = (await isDir(siblingDir)) ? siblingDir : (await isDir(corpusDir)) ? corpusDir : null;
    if (!baseDir) {
      lineage.push({ id: baseId, missing: true });
      break;
    }
    const baseIndex = await readRootIndex(baseDir);
    lineage.push({
      id: baseId,
      status: baseIndex?.frontmatter?.provenance_status || null,
      variantOf: baseIndex?.frontmatter?.variant_of || null,
    });
    currentDir = baseDir;
    baseId = baseIndex?.frontmatter?.variant_of;
  }

  return {
    apiVersion: "ge.dev/v1",
    kind: "GeAgentTrackResult",
    agentId,
    bundle: dir,
    status: provenance?.status || "draft",
    provenance,
    variantOf: index?.frontmatter?.variant_of || null,
    variantKind: index?.frontmatter?.variant_of ? (index?.frontmatter?.variant_kind || "custom") : null,
    lineage,
    inRegistry: await catalogHasAgent(agentId, catalogPath),
    registryPath: catalogPath,
  };
}
