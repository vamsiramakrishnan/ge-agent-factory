#!/usr/bin/env bun
/**
 * MCP server exposing the GE Agent Factory operations as typed tools, backed by
 * the same tools/lib/factory-core.mjs the `ge` CLI uses. Lets models/harnesses
 * call factory verbs as structured tools instead of shelling out and parsing
 * stdout. Transport: stdio.
 *
 * Register via .mcp.json. Read/observe tools (doctor, status, logs,
 * list_usecases) are safe; prove/handoff/provision/sync mutate, so they're
 * explicit.
 *
 * The tool surface (names, descriptions, param schemas) is derived from the
 * `mcp` blocks in tools/lib/ge-command-registry.mjs — never hand-write a tool
 * here. Only the in-process handler bodies live in this file.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as core from "./lib/factory-core.mjs";
import { GE_COMMANDS } from "./lib/ge-command-registry.mjs";
import { runDrive } from "./lib/live/drive-session.mjs";
import { proveLive } from "./lib/live/prove-live.mjs";
import { runBench } from "./lib/bench/runner.mjs";
import { compileEvals } from "./lib/evals/compile-command.mjs";
import { DxError } from "./lib/errors/dx-error.mjs";

const cfg = () => core.loadConfig({});
const result = (data) => ({ content: [{ type: "text", text: JSON.stringify(data, null, 2) }] });
const fail = (err) => ({ isError: true, content: [{ type: "text", text: String(err?.message || err) }] });

const server = new McpServer({ name: "ge-agent-factory", version: "1.0.0" });

// zod schema from the registry's dependency-free param descriptors.
function zodFromParams(params = {}) {
  const shape = {};
  for (const [name, p] of Object.entries(params)) {
    let s = p.enum ? z.enum(p.enum) : { string: z.string(), boolean: z.boolean(), number: z.number() }[p.type];
    if (!s) throw new Error(`unknown mcp param type '${p.type}' for '${name}'`);
    shape[name] = p.optional ? s.optional() : s;
  }
  return shape;
}

// In-process implementations, keyed by REGISTRY ID. Handlers stay here —
// they call core directly (not subprocesses) — but names/descriptions/schemas
// come from the registry.
const HANDLERS = {
  // The golden path — same core functions as `ge capture/prove/handoff`.
  "capture":       (a) => core.capture(cfg(), { from: a.from }),
  "prove":         (a) => core.prove(cfg(), { id: a.id, target: a.target, force: a.force }),
  "handoff":       (a) => core.handoff(cfg(), { target: a.target || "agents-cli", ids: a.ids, startStage: a.startStage, targetStage: a.targetStage, noProxy: a.noProxy }),
  "usecases.list": (a) => core.listUsecases(a),
  "doctor":        () => core.doctor(cfg()),
  "status":        (a) => core.status(cfg(), { noProxy: a.noProxy }),
  "logs":          (a) => core.logs(cfg(), a),
  "agents.build":  (a) => a.local
    ? core.provisionLocal(cfg(), { scope: a.scope, ids: a.ids, dept: a.dept, limit: a.limit, target: a.target, vertex: a.vertex !== false })
    : core.provision(cfg(), a),
  "agents.sync":   (a) => a.local
    ? core.syncLocal(cfg(), { remote: a.remote, push: a.push, commit: a.commit !== false, create: a.create })
    : core.sync(cfg(), a),
  "mcp.deploy":    () => core.mcpDeploy(cfg()),
  "mcp.doctor":    () => core.mcpDoctor(cfg()),
  // Live surfaces — same core functions as `ge drive` / `ge prove --live` /
  // `ge bench` / `ge evals compile`, called in-process.
  "drive":         (a) => runDrive(cfg(), {
    turns: String(a.turns || "").split("\n").map((line) => line.trim()).filter(Boolean),
    cassette: a.cassette,
    record: a.record,
    recordId: a.recordId,
    recordCassette: a.recordCassette,
    targetAgent: a.targetAgent,
    assistant: a.assistant,
    strictResponder: a.strictResponder,
  }),
  "prove.live":    (a) => proveLive(cfg(), {
    evalset: a.evalset,
    cassette: a.cassette,
    maxCases: a.maxCases,
    maxTurns: a.maxTurns,
    strictResponder: a.strictResponder,
    updateBaseline: a.updateBaseline,
    targetAgent: a.targetAgent,
    assistant: a.assistant,
  }),
  "bench":         (a) => {
    if (!a.cassette && !a.confirm) {
      throw new DxError("a live bench sends real traffic at a paid surface — pass confirm=true", {
        where: "factory_bench",
        why: "live load runs are explicit and cost-guarded by design; cassette replays never need confirmation",
        fix: "factory_bench with cassette=<recording>, or confirm=true",
      });
    }
    return runBench(cfg(), {
      cassette: a.cassette,
      sessions: a.sessions,
      turnsPerSession: a.turns,
      concurrency: a.concurrency ? String(a.concurrency).split(",").map(Number).filter((level) => Number.isFinite(level) && level > 0) : [1],
      targetAgent: a.targetAgent,
    });
  },
  "evals.compile": (a) => compileEvals({ spec: a.spec, id: a.id, maxCases: a.maxCases }),
  // Synthetic seed data — the same generator core as `ge data synth`
  // (apps/factory/scripts/generate-simulator-data.mjs exports it; a
  // CLI-boundary import like tools/ge/data.mjs's, dynamic so the server
  // never pays for @ge/synthkit until the tool is called).
  "data.synth": async (a) => {
    const { synthesizeSeed } = await import("../apps/factory/scripts/generate-simulator-data.mjs");
    const { summary, fk } = synthesizeSeed({
      system: a.system,
      seed: a.seed,
      profile: a.profile,
      edgeCaseRate: a.edgeCaseRate,
      out: a.out,
    });
    if (!fk.ok) {
      throw new DxError(`seed realized but ${fk.violations.length} foreign-key reference(s) do not resolve`, {
        where: summary.out || summary.system,
        why: "every ref: value in a seed must point at a generated primary key; an open reference means the pack contract and recipe disagree",
        fix: `node apps/factory/scripts/validate-simulator-pack.mjs --system ${summary.system}`,
      });
    }
    return summary;
  },
};

for (const command of Object.values(GE_COMMANDS)) {
  if (!command.mcp) continue;
  const handler = HANDLERS[command.id];
  if (!handler) throw new Error(`registry entry '${command.id}' declares mcp but has no handler`);
  server.tool(command.mcp.tool, command.mcp.description, zodFromParams(command.mcp.params),
    async (a) => { try { return result(await handler(a)); } catch (e) { return fail(e); } });
}

await server.connect(new StdioServerTransport());
