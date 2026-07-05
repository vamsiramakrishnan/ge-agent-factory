// Parity oracle freezing the MCP tool surface as declared in the command
// registry. EXPECTED_TOOLS is a byte-level transcription of the tool surface
// tools/mcp-server.mjs exposed BEFORE it became a registry consumer (tool
// names + param names/optionality, captured 2026-07-02). Any drift in the
// registry's `mcp` blocks — a renamed tool, a dropped/added param, a flipped
// optionality — fails here first. Widening the MCP surface is a deliberate
// act: update this fixture in the same commit, and say so in the subject.
import { test, expect } from "bun:test";
import { GE_COMMANDS } from "@ge/capability-registry";

const EXPECTED_TOOLS = {
  // Golden-path verbs (Language & DX refactor, 2026-07-03): capture/prove/
  // handoff delegate to the same core functions as the CLI verbs. The
  // factory_ship tool was folded into factory_handoff in the full-rename
  // sweep (unreleased surface — no alias kept).
  factory_capture: ["from?"],
  factory_prove: ["id?", "target?", "force?"],
  // Admission-gate widening (Agent Passport + handoff admission gate,
  // 2026-07-04): factory_handoff gains the recorded break-glass `force`.
  factory_handoff: ["target?", "ids?", "startStage?", "targetStage?", "noProxy?", "force?"],
  // Renamed from factory_list_usecases (2026-07-04) to match the
  // noun_verb convention every other tool name follows (its own registry
  // id was already "usecases.list"; only this field lagged).
  factory_usecases_list: ["department?", "search?", "limit?"],
  factory_doctor: [],
  factory_status: ["noProxy?"],
  factory_logs: ["runId", "stage?", "item?"],
  // Renamed from factory_provision (2026-07-04): "provision" was a third
  // spelling for "build agents" (alongside CLI `ge agents build` and mise's
  // provision/provision-local tasks), while apps/factory/src/cli.js's own
  // `factory provision` meant something unrelated (infra/control-plane
  // apply) -- renamed to match its registry id "agents.build".
  factory_agents_build: ["scope?", "dept?", "ids?", "concurrency?", "force?", "noProxy?", "local?", "vertex?", "target?", "limit?"],
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
  // OKF agent-lifecycle widening (customize → register → track, 2026-07-04):
  // the three lifecycle verbs share tools/lib/okf-lifecycle.mjs with the CLI.
  factory_okf_customize: ["base", "id", "swapSystem?", "rename?", "vertical?", "out?"],
  factory_agents_register: ["bundle", "owner?"],
  factory_agents_track: ["id"],
  // Admission-gate widening (Agent Passport + handoff admission gate,
  // 2026-07-04): mint/verify the signed passport and run the recorded
  // admission decision — the same evaluation `ge handoff` enforces.
  factory_passport_emit: ["id"],
  factory_passport_verify: ["id"],
  factory_passport_admit: ["id", "stage?", "force?"],
  // Agent Library parity (blueprint-library extraction, 2026-07-05):
  // read-only projections over the generated okf/library/index.json, plus
  // create-from-library — same core as `ge library ...` / `ge create`.
  factory_library_stats: [],
  factory_library_search: ["query?", "department?", "limit?"],
  factory_library_inspect: ["slug"],
  factory_library_status: ["slug"],
  factory_library_create: ["slug", "out?", "overlay?", "target?", "dryRun?", "noSmoke?", "force?"],
  // BYO source systems (byo-systems extraction, 2026-07-05): list/synthesize/
  // doctor over the simulator-system corpus — same core as `ge systems ...`.
  factory_systems_list: [],
  factory_systems_synth: ["name?", "description?", "fromOpenapi?", "fromSamples?", "promote?"],
  factory_systems_doctor: [],
  // Eval packs (2026-07-05): bring-your-own evalset import + coverage
  // reporting over the compile-emitted coverage artifact.
  factory_evals_import: ["evalset", "id?", "force?"],
  factory_evals_coverage: ["id?"],
  // Handoff packaging (2026-07-05): local-only plan/package/verify trio —
  // digests + admission verdict, zero cloud calls.
  factory_handoff_plan: ["ids?", "target?"],
  factory_handoff_package: ["ids?", "out?"],
  factory_handoff_verify_package: ["archive"],
  // Console UI packaging (2026-07-05): read-only doctor (deploy is CLI/console
  // only — widening MCP to cloud deploys is a separate deliberate act).
  factory_console_doctor: [],
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

test("every declared mcp tool has an in-process handler in mcp-server.mjs", async () => {
  // A registry entry may declare an MCP surface only if the server can
  // execute it — this is what used to fail at server boot (the loop in
  // tools/mcp-server.mjs throws on a handler-less mcp block); holding the two
  // maps equal here surfaces the gap in CI instead. The import is safe: the
  // server module only connects its stdio transport under import.meta.main.
  const { HANDLERS } = await import("./mcp-server.mjs");
  const declared = Object.values(GE_COMMANDS).filter((c) => c.mcp).map((c) => c.id).sort();
  const handled = Object.keys(HANDLERS).sort();
  expect(handled).toEqual(declared);
});
