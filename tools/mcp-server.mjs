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
 * `mcp` blocks in packages/capability-registry/src/registry.mjs — never hand-write a tool
 * here. Only the in-process handler bodies live in this file.
 */

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as core from "./lib/factory-core.mjs";
import { GE_COMMANDS } from "@ge/capability-registry";
import { runDrive } from "./lib/live/drive-session.mjs";
import { proveLive } from "./lib/live/prove-live.mjs";
import { runBench } from "./lib/bench/runner.mjs";
import { compileEvals } from "./lib/evals/compile-command.mjs";
import { importEvalset } from "./lib/evals/import-command.mjs";
import { evalsCoverage } from "./lib/evals/coverage-command.mjs";
import { DxError } from "./lib/errors/dx-error.mjs";

// tools/mcp-server.mjs -> tools -> repo root (for handlers that take injected paths).
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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
  "agents.build":  async (a) => {
    if (a.local && a.detach) {
      // Detached local build: hand the exact CLI argv to the runtime daemon
      // and return the run id immediately instead of blocking the tool call
      // for the whole build (same core as `ge agents build --local --detach`).
      const { submitDetached } = await import("./lib/daemon/detached-submit.mjs");
      return submitDetached({ argv: GE_COMMANDS["agents.build.local"].argv({ ...a, detach: false }) });
    }
    return a.local
      ? core.provisionLocal(cfg(), { scope: a.scope, ids: a.ids, dept: a.dept, limit: a.limit, target: a.target, vertex: a.vertex !== false })
      : core.provision(cfg(), a);
  },
  "agents.sync":   (a) => a.local
    ? core.syncLocal(cfg(), { remote: a.remote, push: a.push, commit: a.commit !== false, create: a.create })
    : core.sync(cfg(), a),
  "mcp.deploy":    () => core.mcpDeploy(cfg()),
  "mcp.doctor":    () => core.mcpDoctor(cfg()),
  "console.doctor": () => core.consoleDoctor(cfg()),
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
  "evals.import": (a) => importEvalset({ evalset: a.evalset, id: a.id, force: a.force }),
  "evals.coverage": (a) => evalsCoverage({ id: a.id }),
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
  // OKF agent lifecycle — the same return/throw core as `ge okf customize` /
  // `ge agents register` / `ge agents track` (tools/lib/okf-lifecycle.mjs).
  "okf.customize": async (a) => {
    const { customizeVariant, parsePairs } = await import("./lib/okf-lifecycle.mjs");
    return customizeVariant({
      base: a.base,
      id: a.id,
      swapSystems: parsePairs(a.swapSystem, "swapSystem"),
      renames: parsePairs(a.rename, "rename"),
      vertical: a.vertical,
      out: a.out,
    });
  },
  "agents.register": async (a) => {
    const { registerBundle } = await import("./lib/okf-lifecycle.mjs");
    return registerBundle({ bundle: a.bundle, owner: a.owner });
  },
  "agents.track": async (a) => {
    const { trackAgent } = await import("./lib/okf-lifecycle.mjs");
    return trackAgent({ id: a.id });
  },
  // Agent Library — the same return/throw core as `ge library stats/search/
  // inspect/status` and `ge create --from-library` (packages/blueprint-library;
  // dynamic import so the server never pays for it — and its yaml dep — until
  // a library tool is called).
  "library.stats": async () => {
    const { readLibraryIndex } = await import("@ge/blueprint-library");
    return readLibraryIndex();
  },
  "library.search": async (a) => {
    const { searchBlueprints } = await import("@ge/blueprint-library");
    const rows = await searchBlueprints(a.query || "", { department: a.department });
    const blueprints = a.limit ? rows.slice(0, a.limit) : rows;
    return { ok: true, query: a.query || "", count: blueprints.length, blueprints };
  },
  "library.inspect": async (a) => {
    const { resolveBlueprint } = await import("@ge/blueprint-library");
    return resolveBlueprint(a.slug);
  },
  "library.status": async (a) => {
    const { blueprintStatus } = await import("@ge/blueprint-library");
    return blueprintStatus(a.slug);
  },
  "create.fromLibrary": async (a) => {
    const { createFromLibrary } = await import("@ge/blueprint-library");
    return createFromLibrary({ slug: a.slug, outDir: a.out, overlay: a.overlay, target: a.target, dryRun: a.dryRun, noSmoke: a.noSmoke, force: a.force });
  },
  // Bring-Your-Own-System — same core as `ge systems list/synth/doctor`
  // (packages/byo-systems; dynamic import, paths injected via REPO_ROOT).
  "systems.list": async () => {
    const byoSystems = await import("@ge/byo-systems");
    return byoSystems.listKnownSystems({ repoRoot: REPO_ROOT });
  },
  "systems.synth": async (a) => {
    const byoSystems = await import("@ge/byo-systems");
    const body = {};
    if (a.name) body.displayName = a.name;
    if (a.fromOpenapi) {
      body.mode = "openapi";
      body.openapi = JSON.parse(await readFile(a.fromOpenapi, "utf8"));
    } else if (a.fromSamples) {
      body.mode = "samples";
      body.samples = JSON.parse(await readFile(a.fromSamples, "utf8"));
    } else {
      body.mode = "nl";
      body.description = a.description || "";
    }
    const spec = byoSystems.buildSynthesisSpec(body);
    return byoSystems.runSynthesis(spec, { repoRoot: REPO_ROOT, promote: Boolean(a.promote) });
  },
  "systems.doctor": async () => {
    const byoSystems = await import("@ge/byo-systems");
    return byoSystems.checkToolchain({ repoRoot: REPO_ROOT });
  },
  // Local-only handoff inspection — `ge handoff plan|package|verify-package`
  // (tools/lib/handoff-package.mjs; dynamic import so the server never pays
  // for tar/@ge/admission until one of these is called). Zero cloud calls:
  // no GCS upload, no gateway POST, no ledger write.
  "handoff.plan": async (a) => {
    const { planHandoff } = await import("./lib/handoff-package.mjs");
    return planHandoff({ ids: a.ids, target: a.target });
  },
  "handoff.package": async (a) => {
    const { packageHandoff } = await import("./lib/handoff-package.mjs");
    return packageHandoff({ ids: a.ids, out: a.out });
  },
  "handoff.verifyPackage": async (a) => {
    const { verifyHandoffPackage } = await import("./lib/handoff-package.mjs");
    return verifyHandoffPackage({ archive: a.archive });
  },
  // Release admission — the same return/throw core as `ge passport emit` /
  // `ge passport verify` / `ge passport admit` (tools/lib/admission/
  // admission-ops.mjs; dynamic so the server never pays for @ge/admission
  // until a passport tool is called).
  "passport.emit": async (a) => {
    const { emitPassport } = await import("./lib/admission/admission-ops.mjs");
    return emitPassport({ id: a.id });
  },
  "passport.verify": async (a) => {
    const { verifyPassport } = await import("./lib/admission/admission-ops.mjs");
    return verifyPassport({ id: a.id });
  },
  "passport.admit": async (a) => {
    const { checkAdmission } = await import("./lib/admission/admission-ops.mjs");
    return checkAdmission({ id: a.id, stage: a.stage || "handoff", force: !!a.force });
  },
};

for (const command of Object.values(GE_COMMANDS)) {
  if (!command.mcp) continue;
  const handler = HANDLERS[command.id];
  if (!handler) throw new Error(`registry entry '${command.id}' declares mcp but has no handler`);
  server.tool(command.mcp.tool, command.mcp.description, zodFromParams(command.mcp.params),
    async (a) => { try { return result(await handler(a)); } catch (e) { return fail(e); } });
}

// Exported for tools/mcp-registry-parity.test.mjs, which holds this map equal
// to the registry's declared mcp surface — a declared tool with no executor
// fails there (in CI) instead of at server boot.
export { HANDLERS };

if (import.meta.main) {
  await server.connect(new StdioServerTransport());
}
