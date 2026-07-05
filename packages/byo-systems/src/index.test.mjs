import { test, expect } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  MAX_DESCRIPTION_BYTES,
  buildSynthesisSpec,
  listKnownSystems,
  resolveSynthesisPython,
  defaultRegistryPath,
  defaultSynthesizeScript,
  synthesisArgv,
  probeInterpreter,
  checkToolchain,
} from "./index.mjs";

function fixtureRepoRoot(registry) {
  const root = mkdtempSync(join(tmpdir(), "ge-byo-systems-"));
  mkdirSync(join(root, "apps", "factory", "simulator-systems"), { recursive: true });
  writeFileSync(
    join(root, "apps", "factory", "simulator-systems", "registry.json"),
    JSON.stringify(registry),
  );
  return root;
}

test("buildSynthesisSpec: valid nl spec", () => {
  const spec = buildSynthesisSpec({ mode: "nl", description: "parts", displayName: "X", useLlm: false });
  expect(spec).toMatchObject({ mode: "nl", description: "parts", displayName: "X", use_llm: false });
  // useLlm defaults to true when omitted.
  expect(buildSynthesisSpec({ mode: "nl", description: "x" }).use_llm).toBe(true);
});

test("buildSynthesisSpec: missing description throws 400", () => {
  let status = 0;
  try {
    buildSynthesisSpec({ mode: "nl", description: "" });
  } catch (e) {
    status = e.statusCode;
    expect(e.message).toMatch(/description is required/);
  }
  expect(status).toBe(400);
});

test("buildSynthesisSpec: oversize description throws 413", () => {
  let status = 0;
  try {
    buildSynthesisSpec({ mode: "nl", description: "x".repeat(MAX_DESCRIPTION_BYTES + 1) });
  } catch (e) {
    status = e.statusCode;
  }
  expect(status).toBe(413);
});

test("buildSynthesisSpec: unsupported mode throws 400", () => {
  expect(() => buildSynthesisSpec({ mode: "bogus", description: "x" })).toThrow(/unsupported synthesis mode/);
});

test("buildSynthesisSpec: samples mode requires an object", () => {
  expect(() => buildSynthesisSpec({ mode: "samples" })).toThrow(/samples must be an object/);
  const spec = buildSynthesisSpec({ mode: "samples", samples: { widgets: [{ id: 1 }] } });
  expect(spec.samples).toEqual({ widgets: [{ id: 1 }] });
});

test("buildSynthesisSpec: openapi mode requires a spec object", () => {
  expect(() => buildSynthesisSpec({ mode: "openapi" })).toThrow(/openapi must be a spec object/);
  const spec = buildSynthesisSpec({ mode: "openapi", openapi: { paths: {} } });
  expect(spec.openapi).toEqual({ paths: {} });
});

test("listKnownSystems: reads a fixture registry.json via repoRoot", async () => {
  const repoRoot = fixtureRepoRoot({
    simulators: [
      { id: "workday", displayName: "Workday", maturity: "stable", family: "hr" },
      { id: "acme", maturity: "beta" },
      { id: "" }, // filtered out: no id
      null, // filtered out
    ],
  });
  const { systems } = await listKnownSystems({ repoRoot });
  expect(systems).toHaveLength(2);
  expect(systems[0]).toEqual({ id: "workday", displayName: "Workday", maturity: "stable", family: "hr" });
  // Missing displayName/family/maturity fall back sanely.
  expect(systems[1]).toEqual({ id: "acme", displayName: "acme", maturity: "beta", family: null });
});

test("listKnownSystems: explicit registryPath overrides the repoRoot default", async () => {
  const repoRoot = fixtureRepoRoot({ simulators: [] });
  const otherRoot = fixtureRepoRoot({ simulators: [{ id: "other" }] });
  const { systems } = await listKnownSystems({ repoRoot, registryPath: defaultRegistryPath(otherRoot) });
  expect(systems.map((s) => s.id)).toEqual(["other"]);
});

test("listKnownSystems: neither repoRoot nor registryPath throws", async () => {
  await expect(listKnownSystems({})).rejects.toThrow(/requires repoRoot or registryPath/);
});

test("listKnownSystems: unreadable registry throws a 500-tagged error", async () => {
  const repoRoot = mkdtempSync(join(tmpdir(), "ge-byo-systems-empty-"));
  let status = 0;
  try {
    await listKnownSystems({ repoRoot });
  } catch (e) {
    status = e.statusCode;
  }
  expect(status).toBe(500);
});

test("resolveSynthesisPython: env override wins over everything", () => {
  const python = resolveSynthesisPython({ repoRoot: "/nonexistent", env: { GE_HARNESS_PYTHON: "/opt/fake/python" } });
  expect(python).toBe("/opt/fake/python");
});

test("resolveSynthesisPython: falls back to python3 when no venv is found", () => {
  const repoRoot = mkdtempSync(join(tmpdir(), "ge-byo-systems-novenv-"));
  const python = resolveSynthesisPython({ repoRoot, cwd: repoRoot, env: {} });
  expect(python).toBe("python3");
});

test("resolveSynthesisPython: finds a .venv under repoRoot", () => {
  const repoRoot = mkdtempSync(join(tmpdir(), "ge-byo-systems-venv-"));
  const venvBin = join(repoRoot, ".venv", "bin");
  mkdirSync(venvBin, { recursive: true });
  writeFileSync(join(venvBin, "python"), "#!/bin/sh\n");
  const python = resolveSynthesisPython({ repoRoot, cwd: repoRoot, env: {} });
  expect(python).toBe(join(venvBin, "python"));
});

test("synthesisArgv: base case has no promote flags", () => {
  const argv = synthesisArgv({ script: "/repo/synthesize_cli.py" });
  expect(argv).toEqual(["/repo/synthesize_cli.py", "--stdin", "--include-contract", "--no-register"]);
});

test("synthesisArgv: --promote also passes --repo-root", () => {
  const argv = synthesisArgv({ script: "/repo/synthesize_cli.py", promote: true, repoRoot: "/repo" });
  expect(argv).toEqual([
    "/repo/synthesize_cli.py",
    "--stdin",
    "--include-contract",
    "--no-register",
    "--promote",
    "--repo-root",
    "/repo",
  ]);
});

test("synthesisArgv: --promote without repoRoot omits --repo-root (CLI infers its own)", () => {
  const argv = synthesisArgv({ script: "/repo/synthesize_cli.py", promote: true });
  expect(argv).toEqual(["/repo/synthesize_cli.py", "--stdin", "--include-contract", "--no-register", "--promote"]);
});

test("probeInterpreter: reports a runnable interpreter", () => {
  // node itself always exists in this environment and understands --version.
  const probe = probeInterpreter(process.execPath);
  expect(probe.ok).toBe(true);
  expect(probe.detail.length).toBeGreaterThan(0);
});

test("probeInterpreter: reports a missing interpreter without throwing", () => {
  const probe = probeInterpreter("/definitely/not/a/real/interpreter-xyz");
  expect(probe.ok).toBe(false);
  expect(probe.detail).toBeTruthy();
});

test("checkToolchain: all-pass shape with an injected good python + fixture registry", async () => {
  const repoRoot = fixtureRepoRoot({ simulators: [{ id: "workday" }] });
  const result = await checkToolchain({
    repoRoot,
    python: process.execPath,
    synthesizeScript: process.execPath, // any existing file satisfies the presence check
    env: { GE_SIMULATOR_OVERLAY_BACKEND: "firestore" },
  });
  expect(result.ok).toBe(true);
  expect(result.checks).toHaveLength(4);
  const byName = Object.fromEntries(result.checks.map((c) => [c.name, c]));
  expect(byName.python.status).toBe("pass");
  expect(byName["synthesize_cli.py"].status).toBe("pass");
  expect(byName["registry.json"].status).toBe("pass");
  expect(byName["overlay backend"].detail).toMatch(/firestore/);
});

test("checkToolchain: never throws — surfaces failures as checks", async () => {
  const result = await checkToolchain({
    repoRoot: "/nonexistent/repo/root",
    python: "/definitely/not/a/real/interpreter-xyz",
    env: {},
  });
  expect(result.ok).toBe(false);
  const byName = Object.fromEntries(result.checks.map((c) => [c.name, c]));
  expect(byName.python.status).toBe("fail");
  expect(byName.python.fix).toBe("mise run setup");
  expect(byName["synthesize_cli.py"].status).toBe("fail");
  expect(byName["registry.json"].status).toBe("fail");
  expect(byName["overlay backend"].detail).toMatch(/in-process overlay only/);
});

test("default path helpers derive from repoRoot", () => {
  expect(defaultRegistryPath("/repo")).toBe(join("/repo", "apps", "factory", "simulator-systems", "registry.json"));
  expect(defaultSynthesizeScript("/repo")).toBe(join("/repo", "apps", "factory", "mcp-service", "synthesize_cli.py"));
});
