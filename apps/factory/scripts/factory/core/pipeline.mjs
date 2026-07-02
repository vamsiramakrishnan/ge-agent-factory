// Pipeline-state core shared by every factory command: the canonical STEPS
// sequence, workspace path helpers, JSON/text state I/O, the pipeline.json
// load/mark/save cycle, the ok()/fail() command contract (FactoryCommandError),
// and the "what should a human run next" derivation. Extracted from factory.mjs
// verbatim so domain modules can depend on pipeline state without importing the
// command orchestrator — behavior is identical to the former inline cluster.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

export const STEPS = ["init", "schema", "generate", "tools", "test", "harnessReview", "harnessRefine", "sourceIntegration", "serve", "deploy", "register", "publish"];

export function pipelinePath(dir) { return join(dir, "mock_systems", "pipeline.json"); }
export function schemaPath(dir) { return join(dir, "mock_systems", "schema.json"); }
export function fixturesDir(dir) { return join(dir, "fixtures"); }
export function manifestPath(dir) { return join(dir, "fixtures", "manifest.json"); }
export function cloudDataDir(dir) { return join(dir, "mock_data", "cloud"); }
export function deployPlanPath(dir) { return join(dir, "artifacts", "deploy-plan.json"); }

export async function readJson(path, fallback) {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch { return fallback; }
}

// With { recursive: true } mkdir only rejects on real fs errors (EACCES, ENOSPC,
// a file where a directory should be) — never on "already exists". Warn instead
// of swallowing so those failures are diagnosable; the follow-up write still
// fails loudly on its own.
export const warnMkdirFailure = (path) => (error) => {
  console.warn(`[factory] could not create directory ${path} — ${error?.message || String(error)}`);
};

export async function writeJson(path, data) {
  await mkdir(dirname(path), { recursive: true }).catch(warnMkdirFailure(dirname(path)));
  await writeFile(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export async function writeText(path, data) {
  await mkdir(dirname(path), { recursive: true }).catch(warnMkdirFailure(dirname(path)));
  await writeFile(path, data, "utf8");
}

export async function loadPipeline(dir) {
  return readJson(pipelinePath(dir), {
    name: basename(dir),
    domain: "general",
    createdAt: null,
    steps: {},
    currentStep: null,
  });
}

export async function savePipeline(dir, pipeline) {
  await writeJson(pipelinePath(dir), pipeline);
}

export function markStep(pipeline, step, status, meta = {}) {
  pipeline.steps[step] = { status, completedAt: new Date().toISOString(), ...meta };
  pipeline.currentStep = step;
}

// Thrown by fail() (and requireStep()) instead of exiting the process. A thrown
// error unwinds exactly like process.exit(1) did (immediately, past every call
// site — no call-site edits needed since `fail(msg);` and `return fail(msg);`
// behave identically once fail throws), EXCEPT that a JS exception, unlike
// process.exit, DOES unwind through any enclosing try/catch. Every existing
// try/catch in factory.mjs has been audited for that difference (see
// registry.mjs dispatch boundary + factory.mjs's from-usecase catch-guard);
// this is intentional, not a gap.
export class FactoryCommandError extends Error {}

// Returns the same shape ok() used to print, so a bare `ok(data);` statement
// (now a no-op — see below) doesn't change behavior for internal callers that
// only rely on the function's own `return summary;`, while `return ok(data);`
// gives the registry's render boundary a value to print/render.
export function ok(data) { return { ok: true, ...data }; }
// Throws instead of exiting so composed in-process command calls (from-usecase,
// batch-audit, quality-gate) can catch/aggregate failures instead of killing the
// whole process. The registry's dispatch boundary renders the JSON/human error
// and sets process.exitCode = 1 (not process.exit) so this matches the old
// exit-code contract without bypassing citty's own cleanup/promise chain.
export function fail(msg) { throw new FactoryCommandError(msg); }

export function requireStep(pipeline, step) {
  if (!pipeline.steps[step] || pipeline.steps[step].status !== "done") {
    fail(`Step "${step}" has not been completed yet. Run "factory ${step}" first.`);
  }
}

// STEPS entries are camelCase pipeline-state keys; the CLI subcommand for a
// few of them is kebab-case and/or spelled differently (harnessReview →
// harness-review, sourceIntegration → source-integration-plan). Anything not
// listed here has an identical CLI name (init, schema, generate, tools, test,
// serve, deploy, register, publish).
export const STEP_CLI_COMMAND = {
  harnessReview: "harness-review",
  harnessRefine: "harness-refine",
  sourceIntegration: "source-integration-plan",
};

// Cloud steps (deploy/register/publish) need operator-supplied values (GCP
// project, Gemini Enterprise app id, ...) this function can't infer from the
// workspace alone, so the suggested command carries a placeholder — same
// convention already used by cmdRegister's own nextStep/nextCommand and by
// cmdFromUseCase's nextSteps list.
export const STEP_CLI_PLACEHOLDER_ARGS = {
  deploy: "--project <gcp-project> --region <region>",
  register: "--as adk|mcp|a2a",
  publish: "--app-id <GEMINI_ENTERPRISE_APP_ID>",
};

// Pure: "what's the next command a human should run" derived from the SAME
// pipeline.steps state markStep/requireStep already track, walking the SAME
// STEPS sequence and using the SAME "blocks progress" rule cmdStatus already
// uses for its own nextStep (a step only blocks if it's missing/"pending" or
// explicitly "failed" — any other status, e.g. tools' terminal "done", or
// test's "created" when --run false skipped actually executing pytest, or
// deploy's transitional "running", means the pipeline has moved past it).
// Centralized here so every cmd* function can attach a consistent
// nextCommand field to its return value instead of each one reimplementing
// (or omitting, or subtly diverging from cmdStatus's own notion of "next").
export function nextCommandFor(pipeline, dir) {
  const nextStep = STEPS.find((step) => {
    const status = pipeline.steps?.[step]?.status || "pending";
    return status === "pending" || status === "failed";
  }) || null;
  if (!nextStep) return null;
  const cliName = STEP_CLI_COMMAND[nextStep] || nextStep;
  const placeholder = STEP_CLI_PLACEHOLDER_ARGS[nextStep];
  return `factory ${cliName} --dir ${dir}${placeholder ? ` ${placeholder}` : ""}`;
}
