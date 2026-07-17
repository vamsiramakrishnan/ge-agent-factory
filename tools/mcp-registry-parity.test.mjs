// Parity oracle freezing the MCP tool surface as declared in the command
// registry. EXPECTED_TOOLS is a byte-level transcription of the tool surface
// tools/mcp-server.mjs exposed BEFORE it became a registry consumer (tool
// names + param names/optionality, captured 2026-07-02). Any drift in the
// registry's `mcp` blocks — a renamed tool, a dropped/added param, a flipped
// optionality — fails here first. Widening the MCP surface is a deliberate
// act: update this fixture in the same commit, and say so in the subject.
import { test, expect } from "bun:test";
import { mkdtemp, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
  // Console/CLI parity widening (2026-07-09): `concurrency` is the same
  // parallel remote submission knob `ge handoff` already exposes.
  factory_handoff: ["target?", "ids?", "startStage?", "targetStage?", "concurrency?", "noProxy?", "force?"],
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
  // Eval fanout widening (2026-07-11): the judge sample count now crosses the
  // same CLI/API/MCP payload boundary as every other build-affecting option.
  factory_agents_build: ["scope?", "dept?", "ids?", "concurrency?", "force?", "noProxy?", "local?", "vertex?", "target?", "limit?", "evalJudgeSamples?", "detach?"],
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
  // Spec → Agent Skill package (2026-07-06): the skill-based consumption
  // alternative to generated ADK runtime code (apps/factory/scripts/spec-to-skill.mjs).
  factory_okf_skill: ["id?", "spec?", "out?"],
  // Self-improvement loop (2026-07-06): audit → enrich → verify → re-audit a
  // blueprint toward a target quality level (tools/lib/improve.mjs).
  factory_improve: ["id", "target?", "write?", "maxIterations?"],
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
  // Real-system twins Phase 0 (2026-07-06): the one dialing tool — doctor
  // plus a read-only reachability probe + dispatch decision per rest binding
  // (risk: calls-live-readonly) — and the directive compiler the tool plane
  // consumes via GE_SIMULATOR_DISPATCH (see docs/plans/real-system-twins/).
  factory_systems_dial: [],
  factory_systems_dispatch: [],
  // Real-system twins Phase 2 (2026-07-06): profile a real system read-only,
  // record a redacted replay corpus, compare a twin to live — all
  // calls-live-readonly (see docs/plans/real-system-twins/).
  factory_systems_profile: ["system", "openapi", "baseUrl?", "auth?", "redact?", "probe?", "out?"],
  factory_systems_record: ["system", "profile?", "script?", "maxCalls?", "importHar?", "importNdjson?", "redact?", "out?"],
  factory_systems_compare: ["system", "profile", "maxCalls?", "out?"],
  // Real-system twins Phase 1 (2026-07-06): the write-semantics contract
  // (ge.mutation-model.v1) — infer a hash-guarded proposal from
  // OpenAPI/samples, validate the corpus, apply with dry-run default.
  factory_systems_mutation_infer: ["system", "fromOpenapi?", "fromSamples?", "out?"],
  factory_systems_mutation_validate: ["system?"],
  factory_systems_mutation_apply: ["proposal", "write?", "force?"],
  // BYO completion wave (bindings + manifest + models + quality trio, 2026-07-05):
  factory_systems_bind: ["system", "to", "kind", "mode", "connector?", "config?"],
  factory_systems_bindings: [],
  factory_systems_unbind: ["system"],
  factory_byo_doctor: ["manifest"],
  factory_byo_apply: ["manifest", "dryRun?"],
  factory_models_doctor: [],
  factory_quality_audit: ["spec?", "all?"],
  factory_enrich_plan: ["spec?", "all?", "target?"],
  // Enrichment completion (audit-fix-wave WS2, 2026-07-05): generate/apply/
  // shard fill out the plan → generate → apply/shard verb set; write
  // defaults falsy on factory_enrich_apply so an MCP call is a dry run
  // unless the caller explicitly opts in, mirroring the CLI's own default.
  factory_enrich_generate: ["spec", "target?", "root?", "packRoot?", "out?", "maxEvals?"],
  factory_enrich_apply: ["patch", "root?", "write?", "force?"],
  factory_enrich_shard: ["plan", "out"],
  factory_evals_verify: ["spec?", "all?"],
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

const KNOWN_RISKS = ["mutates-cloud", "starts-workloads", "starts-local-workloads", "writes-repo", "calls-live-readonly", "read-only"];

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

test("system capture MCP handlers enforce identity and private atomic artifacts", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ge-mcp-capture-"));
  try {
    const { HANDLERS } = await import("./mcp-server.mjs");
    const openapi = join(dir, "openapi.json");
    const profilePath = join(dir, "crm.profile.json");
    await writeFile(
      openapi,
      JSON.stringify({
        openapi: "3.0.0",
        info: { title: "CRM" },
        paths: { "/cases": { get: { operationId: "listCases" } } },
      }),
    );
    await HANDLERS["systems.profile"]({
      system: "crm",
      openapi,
      baseUrl: "https://crm.example.com",
      out: profilePath,
    });
    expect((await stat(profilePath)).mode & 0o777).toBe(0o600);

    const importPath = join(dir, "input.ndjson");
    const corpusPath = join(dir, "output.ndjson");
    await writeFile(
      importPath,
      `${JSON.stringify({ schemaVersion: "ge.replay-corpus.v1", kind: "system_trace", system: "crm", profileHash: null, policyHash: null })}\n` +
        `${JSON.stringify({ request: { method: "GET", path: "/cases?token=path-secret" }, response: { status: 200 } })}\n`,
    );
    await HANDLERS["systems.record"]({ system: "crm", importNdjson: importPath, out: corpusPath });
    const reportPath = join(dir, "output.redaction-report.json");
    expect((await stat(corpusPath)).mode & 0o777).toBe(0o600);
    expect((await stat(reportPath)).mode & 0o777).toBe(0o600);
    expect(await Bun.file(corpusPath).text()).not.toContain("path-secret");
    expect((await readdir(dir)).some((name) => name.endsWith(".tmp"))).toBe(false);

    await expect(
      HANDLERS["systems.record"]({ system: "billing", importNdjson: importPath, out: join(dir, "wrong.ndjson") }),
    ).rejects.toThrow("identity mismatch");
    await expect(
      HANDLERS["systems.compare"]({ system: "billing", profile: profilePath, maxCalls: 1, out: join(dir, "wrong.json") }),
    ).rejects.toThrow("identity mismatch");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
