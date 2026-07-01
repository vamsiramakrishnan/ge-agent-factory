import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const DEFAULT_ALLOWED_LEGACY = new Set([
  // use-cases.generated.js was relocated to a git-ignored build artifact
  // (apps/factory/generated/use-cases.generated.json), loaded lazily.
  "apps/presentation/public/architecture/vendor/html2canvas.min.js",
  "apps/presentation/public/architecture/vendor/jspdf.umd.min.js",
]);

const FORBIDDEN_TRACKED_PATTERNS = [
  {
    id: "runtime-state",
    detail: "Runtime state must stay local and reproducible.",
    match: (path) => path === ".ge" || path.startsWith(".ge/") || path === ".ge-daemon" || path.startsWith(".ge-daemon/") || path === ".ge-harness" || path.startsWith(".ge-harness/") || path === ".ge-missions" || path.startsWith(".ge-missions/") || path.endsWith("/.ge-daemon"),
  },
  {
    id: "harness-cache",
    detail: "Harness workspaces and caches should not be reviewed as source.",
    match: (path) => path === ".harness" || path.startsWith(".harness/") || path.includes("/.harness/"),
  },
  {
    id: "assistant-workspace",
    detail: "Assistant brainstorm/output workspaces are local collaboration artifacts, not product source.",
    match: (path) => path === ".superpowers" || path.startsWith(".superpowers/") || path.includes("/.superpowers/"),
  },
  {
    id: "dependency-cache",
    detail: "Installed dependencies belong to the package manager, not git.",
    match: (path) => path.includes("node_modules/") || path.endsWith("/node_modules"),
  },
  {
    id: "python-cache",
    detail: "Python bytecode and pytest caches are machine-local artifacts.",
    match: (path) => path.includes("__pycache__/") || path.includes(".pytest_cache/") || path.endsWith(".pyc"),
  },
  {
    id: "openapi-cache",
    detail: "Downloaded API docs/spec cache is reproducible from the manifest.",
    match: (path) => path.startsWith("apps/factory/simulator-systems/_openapi/"),
  },
  {
    id: "build-output",
    detail: "Build output should be produced by CI or local build commands.",
    match: (path) => path.includes("/dist/") || path.startsWith("dist/") || path.endsWith("/dist"),
  },
];

const SOURCE_STATE_PATH_ALLOWED_FILES = new Set([
  "tools/lib/state-paths.mjs",
  "tools/lib/source-hygiene.mjs",
]);

const SOURCE_STATE_PATH_PATTERNS = [
  {
    id: "legacy-root-harness-state",
    detail: "Active source must use the canonical .ge state root, not repo-root .harness.",
    match: (line) => /(?:join|resolve)\([^;\n]*(?:REPO_ROOT|repoRoot|resolvedRepoRoot|HARNESS_ROOT|GEN_DIR|dataRoot)[^;\n]*["']\.harness["']/.test(line)
      || /["']\.harness\/(?:skills|factory|projects|uv-cache|console-jobs|runs|artifacts)/.test(line),
  },
  {
    id: "legacy-workspace-api",
    detail: "Active source must use /api/workspaces; /api/projects is no longer a supported route.",
    match: (line) => /\/api\/projects/.test(line),
  },
  {
    id: "legacy-workspace-store",
    detail: "Active source must use workspaces.json for the generated workspace registry.",
    match: (line) => /projects\.json/.test(line),
  },
  {
    id: "legacy-state-root",
    detail: "Old root state directories are cleanup-only and must not be active writers/readers.",
    match: (line) => /\.ge-daemon|\.ge-missions|\.ge-harness\/interviews/.test(line),
  },
];

// Code-level antipatterns that the fixes in this repo eliminated; enforced so the
// whole class can't silently return. Each maps to a gotcha: raw non-atomic JSON
// state writes, and shell-interpolated process execution.
const SOURCE_CODE_ANTIPATTERNS = [
  {
    id: "raw-json-write",
    detail: "Write JSON state atomically via writeJson/updateJson (@ge/std/json-io), not raw writeFileSync(JSON.stringify(...)).",
    match: (line) => /writeFileSync\(.*JSON\.stringify/.test(line),
  },
  {
    id: "shell-interpolation",
    detail: "Use execFile/execFileSync with an argv array, not exec/execSync with an interpolated template literal (shell-injection risk).",
    match: (line) => /\bexec(Sync)?\(\s*`[^`]*\$\{/.test(line),
  },
];

export function codeAntipatternIds(line) {
  const ids = [];
  for (const pattern of SOURCE_CODE_ANTIPATTERNS) {
    if (pattern.match(line)) ids.push(pattern.id);
  }
  return ids;
}

function isActiveSourcePath(path) {
  if (!path) return false;
  if (SOURCE_STATE_PATH_ALLOWED_FILES.has(path)) return false;
  if (path.includes("/docs/") || path.includes("/README") || path.endsWith("/README.md") || path.endsWith(".md")) return false;
  if (path.includes("/tests/") || /\.test\.[cm]?[jt]sx?$/.test(path) || path.endsWith(".test.mjs")) return false;
  if (path.includes("/catalog/interview-specs/")) return false;
  return /\.(mjs|js|ts|tsx|json|ya?ml)$/.test(path) || path === "mise.toml" || path.endsWith("package.json");
}

export function trackedHygieneFindings(paths, options = {}) {
  const allowedLegacy = options.allowedLegacy || DEFAULT_ALLOWED_LEGACY;
  const findings = [];
  for (const path of paths) {
    if (!path || allowedLegacy.has(path)) continue;
    for (const pattern of FORBIDDEN_TRACKED_PATTERNS) {
      if (pattern.match(path)) {
        findings.push({ path, id: pattern.id, detail: pattern.detail });
        break;
      }
    }
  }
  return findings;
}

function gitOutput(args, cwd) {
  const git = process.env.GIT_BIN || "/usr/bin/git";
  try {
    return execFileSync(git, args, {
      cwd,
      encoding: "utf8",
      maxBuffer: 128 * 1024 * 1024,
    });
  } catch (error) {
    if (error.status === 0 && typeof error.stdout === "string") return error.stdout;
    if (error.stdout) return error.stdout;
    throw error;
  }
}

export function trackedFiles(cwd = process.cwd()) {
  const deleted = new Set(gitOutput(["ls-files", "--deleted"], cwd).split(/\r?\n/).filter(Boolean));
  return gitOutput(["ls-files"], cwd)
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((path) => !deleted.has(path));
}

export function activeSourceFiles(cwd = process.cwd()) {
  return trackedFiles(cwd).filter(isActiveSourcePath);
}

export function sourceStatePathFindings(paths, { cwd = process.cwd() } = {}) {
  const findings = [];
  for (const path of paths.filter(isActiveSourcePath)) {
    const fullPath = `${cwd}/${path}`;
    if (!existsSync(fullPath)) continue;
    const lines = readFileSync(fullPath, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const pattern of SOURCE_STATE_PATH_PATTERNS) {
        if (!pattern.match(line)) continue;
        findings.push({
          path,
          line: index + 1,
          id: pattern.id,
          detail: pattern.detail,
          text: line.trim(),
        });
      }
    });
  }
  return findings;
}

export function sourceAntipatternFindings(paths, { cwd = process.cwd() } = {}) {
  const findings = [];
  for (const path of paths.filter(isActiveSourcePath)) {
    const fullPath = `${cwd}/${path}`;
    if (!existsSync(fullPath)) continue;
    const lines = readFileSync(fullPath, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const id of codeAntipatternIds(line)) {
        const pattern = SOURCE_CODE_ANTIPATTERNS.find((p) => p.id === id);
        findings.push({ path, line: index + 1, id, detail: pattern.detail, text: line.trim() });
      }
    });
  }
  return findings;
}

export function formatAntipatternReport(findings) {
  if (!findings.length) return "Source antipattern check passed: no raw JSON writes or shell-interpolated exec in active source.";
  const lines = [
    `Source antipattern check failed: ${findings.length} antipattern${findings.length === 1 ? "" : "s"} found in active source.`,
    "",
  ];
  for (const finding of findings) {
    lines.push(`- ${finding.path}:${finding.line}`);
    lines.push(`  ${finding.id}: ${finding.detail}`);
    lines.push(`  ${finding.text}`);
  }
  return lines.join("\n");
}

export function formatSourceStatePathReport(findings) {
  if (!findings.length) return "Source state-path check passed: active code uses canonical .ge/workspaces paths.";
  const lines = [
    `Source state-path check failed: ${findings.length} legacy state/path reference${findings.length === 1 ? "" : "s"} found in active source.`,
    "",
  ];
  for (const finding of findings) {
    lines.push(`- ${finding.path}:${finding.line}`);
    lines.push(`  ${finding.id}: ${finding.detail}`);
    lines.push(`  ${finding.text}`);
  }
  lines.push("");
  lines.push("Move active state to tools/lib/state-paths.mjs and canonical .ge paths, or add a narrow cleanup-only exception.");
  return lines.join("\n");
}

export function formatHygieneReport(findings) {
  if (!findings.length) return "Source hygiene check passed: no forbidden tracked artifacts found.";
  const lines = [
    `Source hygiene check failed: ${findings.length} forbidden tracked artifact${findings.length === 1 ? "" : "s"} found.`,
    "",
  ];
  for (const finding of findings) {
    lines.push(`- ${finding.path}`);
    lines.push(`  ${finding.id}: ${finding.detail}`);
  }
  lines.push("");
  lines.push("Move these to generated/cache/runtime state, or add a narrow legacy exception with a comment explaining why it must be reviewed as source.");
  return lines.join("\n");
}

export function runSourceHygiene({ cwd = process.cwd(), allowedLegacy = DEFAULT_ALLOWED_LEGACY } = {}) {
  const findings = trackedHygieneFindings(trackedFiles(cwd), { allowedLegacy });
  const active = activeSourceFiles(cwd);
  const sourceStateFindings = sourceStatePathFindings(active, { cwd });
  const antipatternFindings = sourceAntipatternFindings(active, { cwd });
  return {
    ok: findings.length === 0 && sourceStateFindings.length === 0 && antipatternFindings.length === 0,
    findings,
    sourceStateFindings,
    antipatternFindings,
    report: [
      formatHygieneReport(findings),
      formatSourceStatePathReport(sourceStateFindings),
      formatAntipatternReport(antipatternFindings),
    ].join("\n\n"),
  };
}
