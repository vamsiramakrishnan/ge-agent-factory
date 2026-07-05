// The BYO manifest (`ge.byo.yaml`, schemaVersion "ge.byo.v1") — one file that
// packages an ENTERPRISE'S CUSTOMIZATIONS onto this factory: which blueprint
// libraries it draws from, which source-system overlay/bindings it runs
// against, which fixture/eval packs it brings, which models it prefers, its
// admission/promotion policy, where its generated agent code lives, and which
// cloud project/region it targets.
//
// This is deliberately a DIFFERENT file from ge.manifest.json (schema:
// ge.manifest.schema.json, engine: tools/lib/reconcile.mjs) — that file is
// `ge apply`'s desired PLATFORM/FLEET state (which planes should be up, which
// agents should reach which stage). ge.byo.yaml never touches planes or fleet
// stage targets; it is customization/config, read by `ge byo doctor|apply`,
// not `ge apply`. Two files, two nouns, two verbs — no shared vocabulary.
//
// `loadByoManifest` is strict, hand-rolled validation (mirrors the manual
// style of tools/lib/reconcile.mjs's normalizeManifest — no invented fields,
// every problem carries a JSON-pointer-ish path). `planByoApply` classifies
// every declared action as appliable (this checkout can do it right now),
// planned-only (recognized, but only informational/requires a capability not
// present yet — reported, never silently dropped), or invalid (malformed).
// `applyByoManifest` executes the appliable subset through fully-injected
// deps — every side effect (reading/writing .ge.json, importing an evalset,
// writing a BYO-systems binding) goes through a dep so tests never touch the
// real filesystem or a real config file, and dryRun classifies without
// executing anything.
//
// Return/throw contract (AGENTS.md): loadByoManifest never throws on a bad
// manifest — a malformed file is data (problems[]), not an exception; only a
// missing/unreadable file or unparseable YAML throws (DxError). plan/apply
// never throw for a single bad action either — every action's outcome lands
// in the returned buckets.
import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { readJson, writeJson } from "@ge/std/json-io";
import { DxError } from "./errors/dx-error.mjs";
import { STATE_PATHS, REPO_ROOT } from "./state-paths.mjs";
import { CONFIG_FIELDS } from "./config-schema.mjs";
import { importEvalset as importEvalsetDefault } from "./evals/import-command.mjs";

export const BYO_SCHEMA_VERSION = "ge.byo.v1";

// ── validation ───────────────────────────────────────────────────────────────
const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const isStringArray = (v) => Array.isArray(v) && v.every((x) => typeof x === "string");

function problem(path, message) {
  return { path, message };
}

// One entry per known top-level section: the shape of its known keys.
// "string[]" = array of strings; "string" = scalar string; "object" = a
// free-form object (validated only for keys, e.g. systems.bindings' values
// are opaque binding payloads — @ge/byo-systems owns their inner shape).
const SECTION_SHAPES = {
  blueprints: { libraries: "string[]" },
  systems: { overlays: "object", bindings: "object" },
  fixtures: { packs: "string[]" },
  evals: { packs: "string[]", domainPacks: "string[]" },
  models: { refinement: "string", judge: "string" },
  policies: { admission: "object", promotion: "object" },
  code: { generatedAgentsRepo: "string" },
  cloud: { project: "string", region: "string" },
};
const KNOWN_TOP_KEYS = ["schemaVersion", "_comment", ...Object.keys(SECTION_SHAPES)];

function checkKind(value, kind, path, problems) {
  if (kind === "string[]") {
    if (!isStringArray(value)) problems.push(problem(path, "must be an array of strings"));
  } else if (kind === "string") {
    if (typeof value !== "string") problems.push(problem(path, "must be a string"));
  } else if (kind === "object") {
    if (!isPlainObject(value)) problems.push(problem(path, "must be an object"));
  }
}

// Pure. Never throws — every finding becomes a problem entry with a
// JSON-pointer-ish path (e.g. "/systems/bindings/crm") so a CLI/editor can
// point at the exact offending key.
export function validateByoManifest(raw) {
  const problems = [];
  if (!isPlainObject(raw)) {
    return { ok: false, problems: [problem("/", "manifest must be a YAML/JSON object")] };
  }

  if (raw.schemaVersion !== BYO_SCHEMA_VERSION) {
    problems.push(problem(
      "/schemaVersion",
      raw.schemaVersion === undefined
        ? `missing — must be "${BYO_SCHEMA_VERSION}"`
        : `unsupported schemaVersion "${raw.schemaVersion}" — expected "${BYO_SCHEMA_VERSION}"`,
    ));
  }

  for (const key of Object.keys(raw)) {
    if (!KNOWN_TOP_KEYS.includes(key)) problems.push(problem(`/${key}`, "unknown top-level key"));
  }

  for (const [section, shape] of Object.entries(SECTION_SHAPES)) {
    if (raw[section] === undefined) continue;
    if (!isPlainObject(raw[section])) {
      problems.push(problem(`/${section}`, "must be an object"));
      continue;
    }
    for (const key of Object.keys(raw[section])) {
      if (!(key in shape)) problems.push(problem(`/${section}/${key}`, "unknown key"));
    }
    for (const [key, kind] of Object.entries(shape)) {
      const value = raw[section][key];
      if (value === undefined) continue;
      checkKind(value, kind, `/${section}/${key}`, problems);
    }
  }

  // systems.bindings' values are opaque payloads owned by @ge/byo-systems
  // (validateBinding, once it lands), but each must at least be an object —
  // a string/number/array there can never become a binding.
  if (isPlainObject(raw.systems?.bindings)) {
    for (const [id, binding] of Object.entries(raw.systems.bindings)) {
      if (!isPlainObject(binding)) problems.push(problem(`/systems/bindings/${id}`, "binding must be an object"));
    }
  }

  const KNOWN_OVERLAY_BACKENDS = ["memory", "firestore", "alloydb"];
  const backend = raw.systems?.overlays?.backend;
  if (backend !== undefined && typeof backend === "string" && !KNOWN_OVERLAY_BACKENDS.includes(backend)) {
    problems.push(problem("/systems/overlays/backend", `unknown backend "${backend}" — expected one of ${KNOWN_OVERLAY_BACKENDS.join(", ")}`));
  }

  return { ok: problems.length === 0, problems };
}

// Read + parse + validate ge.byo.yaml. Throws (DxError) only when the file
// itself can't be read or parsed — a structurally-wrong-but-readable manifest
// is reported as problems[], never thrown, so `ge byo doctor` always has
// something to render.
export function loadByoManifest(path, { readFile = readFileSync } = {}) {
  if (!path) {
    throw new DxError("no BYO manifest path given", {
      where: "ge byo doctor|apply --manifest",
      why: "loadByoManifest needs a file to read",
      fix: "ge byo doctor --manifest ge.byo.yaml",
    });
  }
  let text;
  try {
    text = readFile(path, "utf8");
  } catch (error) {
    throw new DxError(`could not read BYO manifest: ${path}`, {
      where: `manifest: ${path}`,
      why: error?.message || String(error),
      fix: "ge byo doctor --manifest <path-to-ge.byo.yaml>",
    });
  }
  let raw;
  try {
    raw = YAML.parse(text) ?? {};
  } catch (error) {
    throw new DxError(`BYO manifest is not valid YAML: ${path}`, {
      where: `manifest: ${path}`,
      why: error?.message || String(error),
      fix: "fix the YAML syntax and re-run",
    });
  }
  const { ok, problems } = validateByoManifest(raw);
  return { ok, problems, manifest: raw, schemaVersion: raw?.schemaVersion, path };
}

// ── deps ─────────────────────────────────────────────────────────────────────
// Every filesystem/config/module access planByoApply/applyByoManifest make is
// injected through this shape; defaultDeps() binds the real ones. Tests pass
// their own (tmp dirs, fake config store, fake importEvalset, a fake or
// absent byo-systems module) so nothing here ever touches the real repo.
export function defaultByoDeps() {
  return {
    exists: existsSync,
    readConfig: () => readJson(STATE_PATHS.config, {}),
    writeConfig: (next) => writeJson(STATE_PATHS.config, next),
    importEvalset: importEvalsetDefault,
    // Lazy + soft-fail: @ge/byo-systems' bindings surface (validateBinding /
    // readBindings / writeBinding) is landing in a concurrent track. Import
    // it at call time (never at module load) and degrade to null on any
    // failure (package absent, or present but without the binding exports
    // yet) so this module works standalone either way.
    loadByoSystems: async () => {
      try {
        const mod = await import("@ge/byo-systems");
        return typeof mod.writeBinding === "function" && typeof mod.validateBinding === "function" ? mod : null;
      } catch {
        return null;
      }
    },
    configFields: CONFIG_FIELDS,
    domainPacksRoot: "domain-packs",
    repoRoot: REPO_ROOT,
  };
}

function withDeps(deps) {
  return { ...defaultByoDeps(), ...deps };
}

function action(kind, target, status, detail, fix) {
  const out = { kind, target, status, detail };
  if (fix) out.fix = fix;
  return out;
}

// ── plan ─────────────────────────────────────────────────────────────────────
// Ordered actions, one section at a time (the order BUILD lists them in), so
// a rendered plan always reads in the same shape as the manifest itself.
export async function planByoApply({ manifest = {}, cfg = {}, deps: userDeps = {} } = {}) {
  const deps = withDeps(userDeps);
  const actions = [];

  // 1. blueprints.libraries[] — informational only: does the path exist and
  // is it a readable OKF bundle (index.md present)? There is no mechanism
  // here that "installs" a blueprint library — this section only ever reports.
  for (const path of manifest.blueprints?.libraries || []) {
    const dirExists = deps.exists(path);
    const indexReadable = dirExists && deps.exists(join(path, "index.md"));
    actions.push(action(
      "blueprints.libraries",
      path,
      "planned-only",
      dirExists
        ? (indexReadable ? `directory and OKF index.md present at ${path}` : `directory exists at ${path} but index.md is missing — not a readable OKF bundle`)
        : `path does not exist: ${path}`,
      indexReadable ? undefined : `point at a real OKF bundle directory containing index.md (e.g. okf/<agent-id>)`,
    ));
  }

  // 2. systems.overlays.backend — appliable: maps 1:1 onto .ge.json's
  // simulatorOverlayBackend scalar (tools/lib/config-schema.mjs).
  const overlayBackend = manifest.systems?.overlays?.backend;
  if (overlayBackend !== undefined) {
    const known = ["memory", "firestore", "alloydb"];
    const valid = typeof overlayBackend === "string" && known.includes(overlayBackend);
    actions.push(action(
      "systems.overlays.backend",
      "simulatorOverlayBackend",
      valid ? "appliable" : "invalid",
      valid
        ? `will set .ge.json simulatorOverlayBackend = "${overlayBackend}" (current: ${cfg.simulatorOverlayBackend || "memory"})`
        : `not a recognized overlay backend: ${JSON.stringify(overlayBackend)} — expected one of ${known.join(", ")}`,
      valid ? undefined : `set systems.overlays.backend to one of ${known.join(", ")}`,
    ));
  }

  // 3. systems.bindings{} — appliable only if @ge/byo-systems exposes the
  // writeBinding/validateBinding pair a concurrent track is adding
  // (src/bindings.mjs); degrades to planned-only with a clear reason
  // otherwise, so this track works standalone either way.
  const bindingEntries = Object.entries(manifest.systems?.bindings || {});
  if (bindingEntries.length) {
    const byoSystems = await deps.loadByoSystems();
    for (const [systemId, binding] of bindingEntries) {
      actions.push(action(
        "systems.bindings",
        systemId,
        byoSystems ? "appliable" : "planned-only",
        byoSystems
          ? `will validate + write the BYO binding for '${systemId}' via @ge/byo-systems#writeBinding`
          : `@ge/byo-systems does not yet export writeBinding/validateBinding — '${systemId}' recorded as planned-only until that lands`,
      ));
    }
  }

  // 4. fixtures.packs[] — existence check, planned-only (no fixture-loading
  // mechanism lives here — this only reports what a later stage will need).
  for (const path of manifest.fixtures?.packs || []) {
    const exists = deps.exists(path);
    actions.push(action(
      "fixtures.packs",
      path,
      "planned-only",
      exists ? `fixture pack present at ${path}` : `fixture pack path does not exist: ${path}`,
      exists ? undefined : `create the fixture pack, or correct the path`,
    ));
  }

  // 5. evals.packs[] — appliable: each entry is a bring-your-own ADK evalset
  // file, imported via tools/lib/evals/import-command.mjs's importEvalset.
  for (const path of manifest.evals?.packs || []) {
    const exists = deps.exists(path);
    actions.push(action(
      "evals.packs",
      path,
      exists ? "appliable" : "invalid",
      exists ? `will import ${path} into .ge/behavioral via ge evals import` : `evalset file does not exist: ${path}`,
      exists ? undefined : `correct the path to a real ADK-compatible evalset JSON file`,
    ));
  }

  // 6. evals.domainPacks[] — path/id entries checked against the domain-packs
  // root (tools/lib/okf-quality.mjs's loadDomainPacks convention: <root>/<id>/pack.json);
  // planned-only — enrichment consumes these, this section only reports.
  for (const id of manifest.evals?.domainPacks || []) {
    const packPath = join(deps.domainPacksRoot, id, "pack.json");
    const exists = deps.exists(packPath);
    actions.push(action(
      "evals.domainPacks",
      id,
      "planned-only",
      exists ? `domain pack readable at ${packPath}` : `no pack.json under ${deps.domainPacksRoot}/${id} — expected ${packPath}`,
      exists ? undefined : `add the domain pack under ${deps.domainPacksRoot}/${id}/pack.json, or correct the id`,
    ));
  }

  // 7. models.refinement / models.judge — appliable only once CONFIG_FIELDS
  // carries refinementModel/judgeModel (a concurrent track's addition);
  // degrades to planned-only otherwise.
  if (manifest.models?.refinement !== undefined) {
    const supported = Boolean(deps.configFields.refinementModel);
    actions.push(action(
      "models.refinement",
      "refinementModel",
      supported ? "appliable" : "planned-only",
      supported
        ? `will set .ge.json refinementModel = "${manifest.models.refinement}" (current: ${cfg.refinementModel || "<unset>"})`
        : `.ge.json has no refinementModel field yet (tools/lib/config-schema.mjs) — recorded as planned-only until that lands`,
    ));
  }
  if (manifest.models?.judge !== undefined) {
    const supported = Boolean(deps.configFields.judgeModel);
    actions.push(action(
      "models.judge",
      "judgeModel",
      supported ? "appliable" : "planned-only",
      supported
        ? `will set .ge.json judgeModel = "${manifest.models.judge}" (current: ${cfg.judgeModel || "<unset>"})`
        : `.ge.json has no judgeModel field yet (tools/lib/config-schema.mjs) — recorded as planned-only until that lands`,
    ));
  }

  // 8. policies.admission / policies.promotion — appliable: merged into
  // .ge.json's sanctioned free-form promotion.gates.<name> block (the same
  // convention tools/lib/admission/admission-ops.mjs's admissionGatePolicy
  // and tools/lib/gates/live-gate.mjs's liveGatePolicy already read from).
  if (manifest.policies?.admission !== undefined) {
    actions.push(action(
      "policies.admission",
      "promotion.gates.admission",
      "appliable",
      `will merge ${Object.keys(manifest.policies.admission).join(", ") || "(empty)"} into .ge.json promotion.gates.admission`,
    ));
  }
  if (manifest.policies?.promotion !== undefined) {
    actions.push(action(
      "policies.promotion",
      "promotion.gates.promotion",
      "appliable",
      `will merge ${Object.keys(manifest.policies.promotion).join(", ") || "(empty)"} into .ge.json promotion.gates.promotion`,
    ));
  }

  // 9. code.generatedAgentsRepo — appliable: .ge.json's `agentsRepo` scalar.
  if (manifest.code?.generatedAgentsRepo !== undefined) {
    actions.push(action(
      "code.generatedAgentsRepo",
      "agentsRepo",
      "appliable",
      `will set .ge.json agentsRepo = "${manifest.code.generatedAgentsRepo}" (current: ${cfg.agentsRepo || "<unset>"})`,
    ));
  }

  // 10. cloud.project / cloud.region — appliable: .ge.json scalars.
  if (manifest.cloud?.project !== undefined) {
    actions.push(action(
      "cloud.project",
      "project",
      "appliable",
      `will set .ge.json project = "${manifest.cloud.project}" (current: ${cfg.project || "<unset>"})`,
    ));
  }
  if (manifest.cloud?.region !== undefined) {
    actions.push(action(
      "cloud.region",
      "region",
      "appliable",
      `will set .ge.json region = "${manifest.cloud.region}" (current: ${cfg.region || "<unset>"})`,
    ));
  }

  return actions;
}

// ── apply ────────────────────────────────────────────────────────────────────
function mergeConfigField(deps, fields) {
  const existing = deps.readConfig() || {};
  deps.writeConfig({ ...existing, ...fields });
  return fields;
}

function mergeGate(deps, gateName, patch) {
  const existing = deps.readConfig() || {};
  const gates = { ...(existing.promotion?.gates || {}) };
  gates[gateName] = { ...(gates[gateName] || {}), ...patch };
  deps.writeConfig({ ...existing, promotion: { ...(existing.promotion || {}), gates } });
  return gates[gateName];
}

// Dispatch one appliable action to its real side effect. Only ever called for
// actions planByoApply already classified "appliable" — a kind with no
// executor here is a programming error (new appliable kind added to the plan
// without a matching executor), so it throws rather than silently no-opping.
async function executeByoAction(action, { manifest, deps }) {
  switch (action.kind) {
    case "systems.overlays.backend":
      return mergeConfigField(deps, { simulatorOverlayBackend: manifest.systems.overlays.backend });
    case "systems.bindings": {
      const binding = manifest.systems.bindings[action.target];
      const byoSystems = await deps.loadByoSystems();
      if (!byoSystems) throw new Error("@ge/byo-systems binding support is unavailable at apply time");
      // writeBinding validates internally (throws with a `.problems` array on
      // a bad shape) — no need to duplicate that call here. The store
      // directory is @ge/byo-systems' own convention (defaultBindingsDir,
      // ".ge/systems"), not a per-system path.
      const dir = binding.dir || (byoSystems.defaultBindingsDir
        ? byoSystems.defaultBindingsDir(deps.repoRoot)
        : join(deps.repoRoot, ".ge", "systems"));
      return byoSystems.writeBinding({ dir, binding });
    }
    case "evals.packs":
      return deps.importEvalset({ evalset: action.target });
    case "models.refinement":
      return mergeConfigField(deps, { refinementModel: manifest.models.refinement });
    case "models.judge":
      return mergeConfigField(deps, { judgeModel: manifest.models.judge });
    case "policies.admission":
      return mergeGate(deps, "admission", manifest.policies.admission);
    case "policies.promotion":
      return mergeGate(deps, "promotion", manifest.policies.promotion);
    case "code.generatedAgentsRepo":
      return mergeConfigField(deps, { agentsRepo: manifest.code.generatedAgentsRepo });
    case "cloud.project":
      return mergeConfigField(deps, { project: manifest.cloud.project });
    case "cloud.region":
      return mergeConfigField(deps, { region: manifest.cloud.region });
    default:
      throw new Error(`no executor registered for appliable action kind: ${action.kind}`);
  }
}

// Execute the appliable subset of a manifest's plan. Every action's outcome
// lands in exactly one bucket — nothing is dropped, and a failed *execution*
// of an appliable action still surfaces (in `applied`, with ok:false and an
// error string) rather than throwing and losing the rest of the run.
export async function applyByoManifest({ manifest = {}, cfg = {}, deps: userDeps = {}, dryRun = false } = {}) {
  const deps = withDeps(userDeps);
  const actions = await planByoApply({ manifest, cfg, deps });

  const applied = [];
  const planned = [];
  const invalid = [];

  for (const item of actions) {
    if (item.status === "planned-only") {
      planned.push(item);
      continue;
    }
    if (item.status === "invalid") {
      invalid.push(item);
      continue;
    }
    if (dryRun) {
      applied.push({ ...item, ok: null, dryRun: true });
      continue;
    }
    try {
      const result = await executeByoAction(item, { manifest, deps });
      applied.push({ ...item, ok: true, dryRun: false, result });
    } catch (error) {
      applied.push({ ...item, ok: false, dryRun: false, error: error?.message || String(error) });
    }
  }

  return { applied, planned, invalid };
}
