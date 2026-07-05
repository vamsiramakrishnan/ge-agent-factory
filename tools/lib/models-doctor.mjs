// tools/lib/models-doctor.mjs — structural readiness for the model providers
// the factory pipeline depends on: the Vertex runtime the harness targets
// (`ge agents build --local --vertex`, tools/lib/provision.mjs), the harness
// driver's Python interpreter, and the two model knobs config-schema.mjs added
// alongside this file (refinementModel / judgeModel).
//
// "Structural" is deliberate: every check here is a filesystem stat, a `--version`
// probe, or a string match — never a network call, never a paid model
// invocation. `ge models doctor` (tools/ge/models.mjs) is meant to be safe to
// run constantly, including in CI, with no credentials configured.
//
// Check shape (matches every other doctor in this repo — see
// tools/lib/doctor/engine.mjs's remoteLedgerCheck): { id, status, detail, fix }
// with status one of "pass" | "warn" | "fail". Never throws — a failed probe
// becomes a "fail"/"warn" check, not an exception.
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import { REPO_ROOT } from "./state-paths.mjs";

// ── default probes ──────────────────────────────────────────────────────────
// Real (but still non-network) implementations. Every one is overridable via
// the `probes` option so tests never shell out or touch the real filesystem.

function realGcloudOnPath() {
  try {
    execFileSync("gcloud", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function realPathExists(path) {
  try {
    return existsSync(path);
  } catch {
    return false;
  }
}

// gcloud's own well-known ADC file location (POSIX; Windows uses
// %APPDATA%\gcloud, out of scope for this structural check — GOOGLE_APPLICATION_CREDENTIALS
// or `gcloud auth application-default login` output is what matters cross-platform).
function realAdcExists() {
  return realPathExists(join(homedir(), ".config", "gcloud", "application_default_credentials.json"));
}

const DEFAULT_PROBES = {
  gcloudOnPath: realGcloudOnPath,
  pathExists: realPathExists,
  adcExists: realAdcExists,
};

// Repo-local venv python path (platform-aware), same layout as
// tools/lib/doctor/engine.mjs's HARNESS_VENV_DIR/harnessVenvPython — kept as a
// tiny local constant rather than importing that module's factory-shaped
// exports, so this file has no dependency on createDoctorPlane's injected deps.
const VENV_BIN = process.platform === "win32" ? join("Scripts", "python.exe") : join("bin", "python");

// 3-step harness-Python resolution: GE_HARNESS_PYTHON override → repo .venv →
// bare "python3" fallback. Reimplemented here rather than imported because the
// canonical precedent, apps/factory/src/harness-python.js's resolveHarnessPython,
// lives under apps/* — and tools/lib/* must never import from apps/*
// (tools/check-no-app-imports.mjs). The nearest tools/lib twin is
// tools/lib/doctor/engine.mjs's ensureHarnessVenv()/harnessVenvPython(), which
// encodes the same override → venv → fallback shape for a different consumer
// (provisioning/creating the venv, not just reporting on whether one resolves).
function resolveHarnessPythonStructural(env, probes) {
  if (env.GE_HARNESS_PYTHON) return { path: env.GE_HARNESS_PYTHON, source: "env:GE_HARNESS_PYTHON" };
  const venvPy = join(REPO_ROOT, ".venv", VENV_BIN);
  let venvFound = false;
  try {
    venvFound = !!probes.pathExists(venvPy);
  } catch {
    venvFound = false;
  }
  if (venvFound) return { path: venvPy, source: "repo .venv" };
  return { path: "python3", source: "fallback (no override, no repo .venv)" };
}

// gemini-*, claude-*, gpt-* are the model families this pipeline is known to
// target (Vertex/Gemini today; the allowance for claude-*/gpt-* is deliberate —
// a family match is an info-level "looks sane" signal, not an allowlist gate).
const KNOWN_MODEL_FAMILY = /^(gemini|claude|gpt)-/i;

function modelFamilyCheck(id, value) {
  const resolved = String(value || "").trim();
  if (!resolved) {
    return { id, status: "warn", detail: "unresolved — no value configured and no default", fix: "ge config explain" };
  }
  const known = KNOWN_MODEL_FAMILY.test(resolved);
  return {
    id,
    status: known ? "pass" : "warn",
    detail: known
      ? `${resolved} (recognized family)`
      : `${resolved} — does not match a known family (gemini-*, claude-*, gpt-*); verify this is intentional`,
    fix: known ? undefined : "ge config explain  (check GE_REFINEMENT_MODEL / GE_JUDGE_MODEL, .ge.json, or the built-in default)",
  };
}

// modelsDoctor(cfg, opts) → { ok, checks[] }
//
// cfg: a loaded factory config (tools/lib/config-schema.mjs buildFactoryConfig
//      output, or any object shape carrying project/refinementModel/judgeModel).
// opts.env: env source (default process.env; inject a plain object in tests).
// opts.probes: override any of gcloudOnPath()/pathExists(path)/adcExists().
export function modelsDoctor(cfg = {}, { env = process.env, probes = {} } = {}) {
  const p = { ...DEFAULT_PROBES, ...probes };
  const checks = [];

  // ── Vertex provider: project configured ──
  const hasProject = !!cfg.project;
  checks.push({
    id: "vertex.project",
    status: hasProject ? "pass" : "fail",
    detail: hasProject ? `project configured (${cfg.project})` : "no GCP project configured (cfg.project unset)",
    fix: hasProject ? undefined : "ge init  (or set GOOGLE_CLOUD_PROJECT)",
  });

  // ── Vertex provider: gcloud on PATH ──
  let gcloudOk = false;
  try {
    gcloudOk = !!p.gcloudOnPath();
  } catch {
    gcloudOk = false;
  }
  checks.push({
    id: "vertex.gcloud",
    status: gcloudOk ? "pass" : "fail",
    detail: gcloudOk ? "gcloud available on PATH" : "gcloud not found on PATH",
    fix: gcloudOk ? undefined : "Install the Google Cloud CLI: https://cloud.google.com/sdk/docs/install",
  });

  // ── Harness driver Python resolvable ──
  const harness = resolveHarnessPythonStructural(env, p);
  const harnessOk = harness.source !== "fallback (no override, no repo .venv)";
  checks.push({
    id: "harness.python",
    status: harnessOk ? "pass" : "warn",
    detail: harnessOk
      ? `resolved via ${harness.source}: ${harness.path}`
      : `${harness.source} — google-antigravity may not be importable`,
    fix: harnessOk ? undefined : "mise run deps  (creates .venv via uv + installs google-antigravity)",
  });

  // ── refinementModel / judgeModel: resolved + known-family check ──
  checks.push(modelFamilyCheck("model.refinement", cfg.refinementModel));
  checks.push(modelFamilyCheck("model.judge", cfg.judgeModel));

  // ── ADC / GOOGLE_APPLICATION_CREDENTIALS presence ──
  const gac = env.GOOGLE_APPLICATION_CREDENTIALS;
  let adcPresent = false;
  try {
    adcPresent = gac ? p.pathExists(gac) : p.adcExists();
  } catch {
    adcPresent = false;
  }
  checks.push({
    id: "adc",
    status: adcPresent ? "pass" : "warn",
    detail: adcPresent
      ? gac
        ? `GOOGLE_APPLICATION_CREDENTIALS set (${gac})`
        : "application-default credentials found"
      : "no GOOGLE_APPLICATION_CREDENTIALS and no application-default credentials found",
    fix: adcPresent ? undefined : "gcloud auth application-default login",
  });

  const ok = checks.every((check) => check.status !== "fail");
  return { ok, checks };
}
