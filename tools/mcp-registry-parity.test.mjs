// Parity oracle freezing the MCP tool surface as declared in the command
// registry. EXPECTED_TOOLS is a byte-level transcription of the tool surface
// tools/mcp-server.mjs exposed BEFORE it became a registry consumer (tool
// names + param names/optionality, captured 2026-07-02). Any drift in the
// registry's `mcp` blocks — a renamed tool, a dropped/added param, a flipped
// optionality — fails here first. Widening the MCP surface is a deliberate
// act: update this fixture in the same commit, and say so in the subject.
import { test, expect } from "bun:test";
import { GE_COMMANDS } from "./lib/ge-command-registry.mjs";

const EXPECTED_TOOLS = {
  // Golden-path verbs (Language & DX refactor, 2026-07-03): capture/prove/
  // handoff delegate to the same core functions as the CLI verbs. The
  // factory_ship tool was folded into factory_handoff in the full-rename
  // sweep (unreleased surface — no alias kept).
  factory_capture: ["from?"],
  factory_prove: ["id?", "target?", "force?"],
  factory_handoff: ["target?", "ids?", "startStage?", "targetStage?", "noProxy?"],
  factory_list_usecases: ["department?", "search?", "limit?"],
  factory_doctor: [],
  factory_status: ["noProxy?"],
  factory_logs: ["runId", "stage?", "item?"],
  factory_provision: ["scope?", "dept?", "ids?", "concurrency?", "force?", "noProxy?", "local?", "vertex?", "target?", "limit?"],
  factory_sync: ["force?", "push?", "commit?", "local?", "remote?", "create?"],
  factory_mcp_deploy: [],
  factory_mcp_doctor: [],
  // Live-surface widening (Behavioral Compiler / Live Proof feature set,
  // 2026-07-03): drive/prove-live/bench/evals-compile expose the same core
  // functions as their CLI verbs; cassette params keep every tool runnable
  // with zero cloud calls.
  factory_drive: ["turns", "cassette?", "record?", "recordId?", "recordCassette?", "targetAgent?", "assistant?", "strictResponder?"],
  factory_prove_live: ["evalset", "cassette?", "maxCases?", "maxTurns?", "strictResponder?", "updateBaseline?", "targetAgent?", "assistant?"],
  factory_bench: ["cassette?", "sessions?", "turns?", "concurrency?", "targetAgent?", "confirm?"],
  factory_evals_compile: ["spec?", "id?", "maxCases?"],
  // Synthetic-data widening (synthkit surfacing, 2026-07-03): factory_data_synth
  // exposes the same seed-generation core as `ge data synth`.
  factory_data_synth: ["system", "seed?", "profile?", "edgeCaseRate?", "out?"],
};

const KNOWN_RISKS = ["mutates-cloud", "starts-workloads", "starts-local-workloads", "writes-repo", "read-only"];

const PARAM_TYPES = ["string", "boolean", "number"];

test("every registry mcp block matches the frozen tool surface", () => {
  const entries = Object.values(GE_COMMANDS).filter((c) => c.mcp);
  const byTool = Object.fromEntries(entries.map((c) => [c.mcp.tool,
    Object.entries(c.mcp.params || {}).map(([n, p]) => p.optional ? `${n}?` : n)]));
  expect(byTool).toEqual(EXPECTED_TOOLS);
});

test("mcp tool names are unique and factory_-prefixed", () => {
  const tools = Object.values(GE_COMMANDS).filter((c) => c.mcp).map((c) => c.mcp.tool);
  expect(new Set(tools).size).toBe(tools.length);
  for (const tool of tools) expect(tool).toMatch(/^factory_[a-z0-9_]+$/);
});

test("every mcp block carries a real description and typed params", () => {
  for (const command of Object.values(GE_COMMANDS)) {
    if (!command.mcp) continue;
    expect(typeof command.mcp.description).toBe("string");
    expect(command.mcp.description.length).toBeGreaterThan(0);
    for (const [name, param] of Object.entries(command.mcp.params || {})) {
      expect(PARAM_TYPES).toContain(param.type);
      if (param.enum !== undefined) {
        expect(Array.isArray(param.enum)).toBe(true);
        expect(param.enum.length).toBeGreaterThan(0);
      }
      if (param.optional !== undefined) expect(param.optional).toBe(true);
      expect(name.length).toBeGreaterThan(0);
    }
  }
});

test("every registry entry declares one of the known risk values", () => {
  for (const command of Object.values(GE_COMMANDS)) {
    expect(KNOWN_RISKS).toContain(command.risk);
  }
});
