// apply-ops — declarative reconcile (ADR 0001 phase 5): diff desired manifest
// against actual platform/fleet state (`ge apply --plan`) and execute the plan
// in dependency order (`ge apply`). Verbatim extraction from factory-core.mjs
// (see AGENTS.md / REFACTOR-HANDOFF.md §9 methodology: verbatim move, dependency
// injection where needed, re-export from factory-core.mjs to preserve its public
// API contract).
//
// createApplyOps takes `statusBoard` plus the platform bring-up ops (`up`,
// `dataUp`, `mcpDeploy`) and the composed `provisionOps` as injected
// dependencies — the same factory-function shape createDataPlane/createMcpPlane/
// createFactoryPlane already use in this directory — because all of them close
// over the plane compositions that only exist once factory-core.mjs wires them,
// and factory-core.mjs is the module that re-exports this file's functions, so
// this file must not import factory-core.mjs back (that would be the cycle).
// ledgerPlan/planReconcile are stable leaf imports.

import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readJson } from "@ge/std/json-io";
import { ledgerPlan } from "./factory-ledger.mjs";
import { planReconcile } from "./reconcile.mjs";

const noop = () => {};

// Same-directory leaf constant, computed independently (matches state-paths.mjs's
// own pattern) rather than importing REPO_ROOT back from factory-core.mjs, which
// would create an import cycle.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const APPLY_MANIFEST_PATH = join(REPO_ROOT, "ge.manifest.json");

export function createApplyOps({ statusBoard, up, dataUp, mcpDeploy, provisionOps }) {
  // Gather actual platform + fleet state and diff it against the desired manifest.
  async function applyPlan(cfg, { manifest = null } = {}) {
    const board = statusBoard(cfg);
    const planes = {};
    for (const p of board.planes || []) {
      const n = (p.name || "").toLowerCase();
      const key = n.includes("tool") || n.includes("mcp") ? "mcp" : n.includes("data") ? "data" : "infra";
      planes[key] = !!p.up;
    }
    const source = manifest ? "inline" : existsSync(APPLY_MANIFEST_PATH) ? "ge.manifest.json" : "default";
    const m = manifest || readJson(APPLY_MANIFEST_PATH, {});
    const plan = await ledgerPlan({ targetStage: m?.fleet?.target || "previewed", mode: cfg.mode });
    return { ...planReconcile(m, { planes, plan }), source };
  }

  // Execute the reconcile plan in dependency order (gateway → data → tool plane →
  // agents). Reuses the same tested core operations the CLI/console already call.
  async function applyApply(cfg, { manifest = null, log = noop } = {}) {
    const planResult = await applyPlan(cfg, { manifest });
    for (const step of planResult.steps) {
      log(`→ ${step.id}: ${step.command}`);
      if (step.kind === "platform") {
        if (step.plane === "infra") await up(cfg, { planes: ["infra"], log });
        else if (step.plane === "data") await dataUp(cfg, { log });
        else if (step.plane === "mcp") mcpDeploy(cfg, { log });
      } else if (step.kind === "fleet") {
        const ids = step.agents.join(",");
        if (cfg.mode === "remote") await provisionOps.provision(cfg, { ids, log });
        else await provisionOps.provisionLocal(cfg, { ids, log });
      }
      log(`✓ ${step.id}`);
    }
    return { applied: planResult.steps.length, plan: planResult };
  }

  return { applyPlan, applyApply };
}
