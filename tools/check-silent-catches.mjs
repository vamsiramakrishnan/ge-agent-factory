#!/usr/bin/env node
// Silent-catch guard (taste campaign WS6).
//
// A swallowed error must either be provably best-effort — and say so — or be
// on the deploy path where we deliberately do not touch behavior we cannot
// exercise in a sandbox. Concretely, every `catch {}` / `catch (e) {}` with an
// empty body and every argument-less `.catch(() => …)` handler must:
//
//   1. carry a `best-effort:` comment on the same line explaining why the
//      failure is impossible-or-irrelevant by construction, OR
//   2. appear in the deploy-path allowlist below.
//
// Anything else is a policy violation: swallowing a meaningful failure hides
// degraded output from the operator. Fix it by adding a `console.warn` (or the
// module's event/log callback), rethrowing, or — only when silence is truly
// correct — documenting it with a `best-effort:` comment.
//
// The allowlist is SHRINK-ONLY and holds deploy-path sites exclusively
// (cmdTest/cmdRegister/cmdDeploy, gcloud/Cloud Build/GCS/Cloud Tasks
// shell-outs) — code we can only parse-verify in a sandbox, so we refuse to
// edit it even cosmetically. Never add a non-deploy-path entry; fix the site
// instead. Stale entries (matching nothing) fail the check so they get
// trimmed.
//
// Exits non-zero on any violation (wired into `source:hygiene` / the CI gate).
import { readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "tinyglobby";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

// Deploy-path allowlist. `match` is a line-independent anchor: a substring
// that must appear within the three lines ending at the catch site.
const ALLOW = [
  // factory-worker.mjs's cloud worker: Cloud Build id parsing, GCE metadata
  // token, GCS log sink flush, Cloud Tasks enqueue response body.
  { file: "apps/factory/src/factory-worker.js", match: "if (id) return id;", reason: "deploy-path" },
  { file: "apps/factory/src/factory-worker.js", match: "return (await res.json()).access_token;", reason: "deploy-path" },
  { file: "apps/factory/src/factory-worker.js", match: "await authedFetch(putUrl", reason: "deploy-path" },
  { file: "apps/factory/src/factory-worker.js", match: "stdout: res.ok ? await res.text()", reason: "deploy-path" },
  // cli.js executeFactoryStageNow: gcloud identity token + Cloud Run POST.
  { file: "apps/factory/src/cli.js", match: "parsed = text ? JSON.parse(text) : null;", reason: "deploy-path" },
  // lifecycle/deploy.mjs (cmdDeploy): gcloud project probe, Gemini Enterprise
  // app resolution via agents-cli/gcloud, verify-live artifacts dir.
  { file: "apps/factory/scripts/factory/lifecycle/deploy.mjs", match: 'if (val && val !== "(unset)") return val;', reason: "deploy-path" },
  { file: "apps/factory/scripts/factory/lifecycle/deploy.mjs", match: "if (exact?.resource) return { appId: exact.resource", reason: "deploy-path" },
  { file: "apps/factory/scripts/factory/lifecycle/deploy.mjs", match: "if (match?.name) return { appId: match.name", reason: "deploy-path" },
  { file: "apps/factory/scripts/factory/lifecycle/deploy.mjs", match: 'await mkdir(join(dir, "artifacts"), { recursive: true }).catch(() => {});', reason: "deploy-path" },
];

// Empty catch block on one line, or an argument-less promise .catch handler.
// Line-based on purpose: it is the campaign's counting rule
// (grep -rnE 'catch\s*(\([^)]*\))?\s*\{\s*\}|\.catch\(\(\)\s*=>' …), kept
// exact so the inventory numbers stay comparable across sweeps.
const EMPTY_CATCH = /catch\s*(\([^)]*\))?\s*\{\s*\}/;
const ARROW_CATCH = /\.catch\(\(\)\s*=>/;

const files = globSync("{apps,tools,packages}/**/*.{mjs,js,ts}", {
  cwd: ROOT,
  ignore: [
    "**/node_modules/**",
    "**/*.test.*",
    // Vendored third-party bundles are not ours to sweep.
    "**/vendor/**",
    "**/*.min.js",
    // Local build output (git-ignored; e.g. `bun run build:presentation`
    // emits minified bundles under apps/presentation/dist/) is not source.
    "**/dist/**",
    "**/dist-ssr/**",
    // apps/docs is swept by the docs-website workstream, which owns every
    // file under it; remove this exclusion once that sweep lands.
    "apps/docs/**",
  ],
});

const self = basename(fileURLToPath(import.meta.url));
const violations = [];
const usedAllow = new Set();

for (const rel of files) {
  if (basename(rel) === self) continue;
  const lines = readFileSync(join(ROOT, rel), "utf8").split("\n");
  lines.forEach((line, i) => {
    if (!EMPTY_CATCH.test(line) && !ARROW_CATCH.test(line)) return;
    if (line.includes("best-effort:")) return;
    const context = lines.slice(Math.max(0, i - 2), i + 1).join("\n");
    const allowed = ALLOW.findIndex((a) => a.file === rel && context.includes(a.match));
    if (allowed >= 0) {
      usedAllow.add(allowed);
      return;
    }
    violations.push(`${rel}:${i + 1}  ${line.trim()}`);
  });
}

const stale = ALLOW.map((a, i) => (usedAllow.has(i) ? null : a)).filter(Boolean);

if (violations.length || stale.length) {
  if (violations.length) {
    console.error(`✗ ${violations.length} silent catch site(s) without a best-effort: comment:`);
    for (const v of violations) console.error(`  ${v}`);
    console.error("Either warn (console.warn / the module's event callback), rethrow, or — when");
    console.error("silence is correct by construction — add a `best-effort: <why>` comment on the line.");
    console.error("The allowlist in tools/check-silent-catches.mjs is shrink-only (deploy-path sites only).");
  }
  if (stale.length) {
    console.error(`✗ ${stale.length} stale allowlist entr${stale.length === 1 ? "y" : "ies"} in tools/check-silent-catches.mjs:`);
    for (const a of stale) console.error(`  ${a.file} :: ${a.match}`);
    console.error("The allowlist is shrink-only — remove entries whose sites no longer exist.");
  }
  process.exit(1);
}
console.log(`✓ no undocumented silent catches (${ALLOW.length} deploy-path site(s) allowlisted)`);
