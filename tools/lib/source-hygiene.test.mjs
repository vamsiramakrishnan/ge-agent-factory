import { expect, test } from "bun:test";
import {
  activeSourceFiles,
  codeAntipatternIds,
  formatHygieneReport,
  formatSourceStatePathReport,
  sourceStatePathFindings,
  trackedFiles,
  trackedHygieneFindings,
} from "./source-hygiene.mjs";

test("codeAntipatternIds flags raw JSON writes and shell-interpolated exec", () => {
  expect(codeAntipatternIds("  writeFileSync(p, JSON.stringify(x, null, 2));")).toContain("raw-json-write");
  expect(codeAntipatternIds("execSync(`tar -czf ${tarPath}`)")).toContain("shell-interpolation");
  expect(codeAntipatternIds("exec(`gcloud --audiences=${aud}`)")).toContain("shell-interpolation");
});

test("codeAntipatternIds does not flag the atomic writer or execFile", () => {
  expect(codeAntipatternIds("  writeJson(p, x);")).toEqual([]);
  expect(codeAntipatternIds('execFileSync("tar", ["-czf", tarPath]);')).toEqual([]);
  expect(codeAntipatternIds("const x = 1;")).toEqual([]);
});

test("flags tracked runtime, cache, dependency, and build artifacts", () => {
  const findings = trackedHygieneFindings([
    "src/app.mjs",
    ".ge-daemon/state.json",
    ".superpowers/brainstorm/123/state/server.pid",
    "apps/console/node_modules/.vite/react.js",
    "apps/service/__pycache__/server.pyc",
    "apps/service/.pytest_cache/v/cache/nodeids",
    "apps/console/dist/index.html",
    "apps/ge-demo-generator/simulator-systems/_openapi/workday/spec.json",
  ]);

  expect(findings.map((finding) => finding.id)).toEqual([
    "runtime-state",
    "assistant-workspace",
    "dependency-cache",
    "python-cache",
    "python-cache",
    "build-output",
    "openapi-cache",
  ]);
});

test("allows explicitly documented legacy generated assets", () => {
  const findings = trackedHygieneFindings([
    "apps/ge-demo-generator/src/use-cases.generated.js",
    "apps/presentation/public/architecture/vendor/html2canvas.min.js",
  ]);

  expect(findings).toEqual([]);
});

test("formats actionable failure report", () => {
  const report = formatHygieneReport([
    { path: ".ge-daemon/state.json", id: "runtime-state", detail: "local only" },
  ]);

  expect(report).toContain("Source hygiene check failed");
  expect(report).toContain(".ge-daemon/state.json");
  expect(report).toContain("Move these to generated/cache/runtime state");
});

test("trackedFiles excludes deleted paths from the working tree", () => {
  expect(trackedFiles().some((path) => path.includes("/state/server.pid"))).toBe(false);
});

test("flags active source references to legacy state paths and routes", () => {
  const findings = sourceStatePathFindings(["tools/lib/source-hygiene.test.mjs"]);
  expect(findings).toEqual([]);

  const report = formatSourceStatePathReport([
    {
      path: "apps/example/server.js",
      line: 12,
      id: "legacy-workspace-api",
      detail: "use /api/workspaces",
      text: 'fetch("/api/projects")',
    },
  ]);
  expect(report).toContain("Source state-path check failed");
  expect(report).toContain("apps/example/server.js:12");
});

test("active source does not use legacy repo-root state paths", () => {
  const findings = sourceStatePathFindings(activeSourceFiles());
  expect(findings).toEqual([]);
});
