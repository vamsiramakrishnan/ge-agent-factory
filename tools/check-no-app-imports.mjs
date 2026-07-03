#!/usr/bin/env node
// Layering guard, two rules:
//
// 1. tools/lib/* must not statically import apps/factory. That edge is the
//    tools<->apps import cycle (Week-4) and blocks a clean single-binary entry
//    point. The two cycle-break modules are allowlisted — they are the
//    designated downward boundary that owns the app-domain ops factory-core
//    used to import.
//
// 2. packages/* source must not import from apps/* OR tools/*. The package
//    docs (packages/std/README.md, packages/{contracts,design,ui,agent-resolver}/AGENTS.md)
//    each claim a hard leaf/shared-layer boundary; this enforces it. Packages
//    are mostly TypeScript (contracts/*.ts, design/*.ts, ui/*.tsx,
//    agent-resolver/*.ts), so this rule scans .mjs/.js/.ts/.tsx across every
//    package source dir (src/, scripts/, tests/), not just .mjs.
//
// Exits non-zero on any violation (wired into the CI gate).
//
// Shared logic that BOTH tools/* and apps/* need lives in the @ge/std leaf
// package (packages/std) — a dependency-free leaf with no apps/* imports, so
// importing it from tools/lib introduces no cycle. @ge/std specifiers never
// contain "apps/factory" and so are already permitted by rule 1; this is the
// sanctioned way to unify a former duplicate (e.g. pipeline-node-registry's
// snakeCase) without an edge.
import { readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "tinyglobby";

const TOOLS = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(TOOLS);

// --- Rule 1: tools/lib -> apps/factory ---------------------------------------
const ALLOW = new Set(["factory-catalog.mjs", "factory-local-ops.mjs"]);
const APP_FROM = /from\s+["'][^"']*apps\/factory[^"']*["']/;

const files = globSync("lib/**/*.mjs", { cwd: TOOLS, ignore: ["**/*.test.mjs"] });
const violations = [];
for (const rel of files) {
  if (ALLOW.has(basename(rel))) continue;
  const text = readFileSync(join(TOOLS, rel), "utf8");
  text.split("\n").forEach((line, i) => {
    if (APP_FROM.test(line)) violations.push(`tools/${rel}:${i + 1}  ${line.trim()}`);
  });
}

if (violations.length) {
  console.error(`✗ ${violations.length} forbidden tools/lib -> apps/factory import(s):`);
  for (const v of violations) console.error(`  ${v}`);
  console.error("Move the operation into a shared package or tools/lib/factory-{catalog,local-ops}.mjs.");
  process.exit(1);
}
console.log("✓ no tools/lib -> apps/factory imports");

// --- Rule 2: packages/* -> apps/* or tools/* ---------------------------------
// Allowlist of package-relative file paths (e.g. "std/src/some-file.mjs") for
// any sanctioned exception. None exist today — packages are clean.
const PKG_ALLOW = new Set([]);

// Doc that states each package's boundary claim; violations cite it.
const PKG_DOC = {
  std: "packages/std/README.md (zero dependencies on anything in apps or tools)",
  contracts: "packages/contracts/AGENTS.md (pure TypeScript, no app imports)",
  design: "packages/design/AGENTS.md (presentation tokens only, no app logic)",
  ui: "packages/ui/AGENTS.md (depends only on @ge/contracts + lucide-react)",
  "agent-resolver": "packages/agent-resolver/AGENTS.md (pure TypeScript, no fs/process/react/express)",
};
const GENERIC_DOC = "packages/* are the shared leaf layer and must not import apps/* or tools/*";

// Every import/require/export-from/dynamic-import specifier on a line.
const SPEC_RE = /(?:\bfrom\s+|\bimport\s+|\b(?:require|import)\(\s*)["']([^"']+)["']/g;
// A specifier whose path contains an `apps/` or `tools/` segment reaches
// across the boundary, whether relative (../../apps/...) or bare-ish.
const CROSSES = /(^|\/)(apps|tools)\//;

const pkgFiles = globSync("packages/*/{src,scripts,tests}/**/*.{mjs,js,ts,tsx}", {
  cwd: ROOT,
  ignore: ["**/node_modules/**"],
});
const pkgViolations = [];
for (const rel of pkgFiles) {
  const pkgRel = rel.slice("packages/".length);
  if (PKG_ALLOW.has(pkgRel)) continue;
  const pkg = pkgRel.split("/")[0];
  const text = readFileSync(join(ROOT, rel), "utf8");
  text.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(SPEC_RE)) {
      if (CROSSES.test(m[1])) {
        pkgViolations.push({ pkg, loc: `${rel}:${i + 1}  ${line.trim()}` });
      }
    }
  });
}

if (pkgViolations.length) {
  console.error(`✗ ${pkgViolations.length} forbidden packages/* -> apps|tools import(s):`);
  for (const v of pkgViolations) {
    console.error(`  [${v.pkg}] ${v.loc}`);
    console.error(`    breaks: ${PKG_DOC[v.pkg] ?? GENERIC_DOC}`);
  }
  console.error("Packages are leaves — invert the dependency (move shared logic into the package, or into @ge/std).");
  process.exit(1);
}
console.log("✓ no packages/* -> apps|tools imports");
