// Root-cause gate for the "deployment-environment assumption diverges between
// spawn sites" class (blindspot audit, class: env-assumption).
//
// Claude Code refuses `--permission-mode bypassPermissions` under uid 0 unless
// IS_SANDBOX=1. That compensation now lives ON the adapter (agents.js claude
// def's spawnEnv) and is applied via spawnEnvForAgent(). The two twin spawn
// paths that launch an adapter binary — the daemon (harness-runner.js) and the
// console server (runtime/run-agent-subprocess.js) — MUST both merge it, or one
// path succeeds while the other refuses at spawn under root (the bug: the
// console path forgot it). This gate asserts every spawn(<x>.resolvedBin, …)
// site in active source merges the adapter spawn env, and that the adapter
// contract itself still yields IS_SANDBOX for claude under root.
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { AGENT_DEFS, spawnEnvForAgent } from "./agents.js";

const HERE = dirname(fileURLToPath(import.meta.url));

// Files that spawn an adapter binary (its resolvedBin). Keep in lock-step with
// the real spawn sites; a new one must merge spawnEnvForAgent to pass here.
const SPAWN_SITE_FILES = [
  "harness-runner.js",
  "runtime/run-agent-subprocess.js",
];

describe("adapter spawn-env is applied at every spawn site", () => {
  for (const rel of SPAWN_SITE_FILES) {
    test(`${rel} merges the adapter spawn env where it spawns resolvedBin`, () => {
      const src = readFileSync(join(HERE, rel), "utf8");
      const lines = src.split("\n");
      const spawnLines = lines
        .map((line, i) => ({ line, i }))
        .filter(({ line }) => /\bspawn\(\s*\w+\.resolvedBin\b/.test(line));
      expect(spawnLines.length).toBeGreaterThan(0); // sanity: we found the spawn site

      for (const { i } of spawnLines) {
        // The env is built in the spawn options object, within ~20 lines.
        const block = lines.slice(i, i + 20).join("\n");
        const merges = /spawnEnvForAgent\(/.test(block) || /claudeSandboxEnv\(/.test(block);
        expect(merges).toBe(true);
      }
    });
  }

  test("claude adapter contributes IS_SANDBOX under root, nothing otherwise", () => {
    const claude = AGENT_DEFS.find((d) => d.id === "claude");
    expect(spawnEnvForAgent(claude, 0)).toEqual({ IS_SANDBOX: "1" });
    expect(spawnEnvForAgent(claude, 1000)).toEqual({});
    // Adapters without a spawnEnv contribute nothing (no accidental leakage).
    const codex = AGENT_DEFS.find((d) => d.id === "codex");
    expect(spawnEnvForAgent(codex, 0)).toEqual({});
  });
});
