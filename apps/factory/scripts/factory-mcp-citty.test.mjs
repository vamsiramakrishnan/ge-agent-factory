// Parse-only test for the `mcp` citty subcommand conversion (docs/plans/
// audit-fix-wave/03-packaging-exec-hygiene.md, 3d). Drives the REAL citty
// `runCommand` against the tree `buildFactoryCommandTree` returns, with a
// fake `handlers.mcp` that records what (dir, flags) it was invoked with —
// this proves dispatch shape (which action, which flags) without shelling
// to gcloud/Agent Registry (house rule 4: this command is deploy-path and is
// parse-verified only in this sandbox).
//
// The four shapes below are exactly the ones docs/plans/audit-fix-wave/
// 03-packaging-exec-hygiene.md names as the behavior-preserving contract:
// `factory mcp`, `factory mcp list`, `factory mcp enable --service X`,
// `factory mcp plan`.
import { describe, expect, test } from "bun:test";
import { runCommand } from "citty";
import { buildFactoryCommandTree } from "./factory/registry.mjs";

function makeTree() {
  const calls = [];
  const noop = async () => ({ ok: true });
  const tree = buildFactoryCommandTree({
    resolveDir: (d) => d || ".",
    parseLegacy: () => ({}),
    handlers: {
      status: noop, listUsecases: noop, promotionGate: noop, sources: noop, packCoverage: noop,
      init: noop, schema: noop, generate: noop, tools: noop, eval: noop, serve: noop,
      dataPlan: noop, sourceIntegrationPlan: noop, snowfakeryRecipe: noop, deployStatus: noop,
      verifyLive: noop, publish: noop, reset: noop, planData: noop, fromUseCase: noop, test: noop,
      qualityGate: noop, harnessReview: noop, harnessRefine: noop,
      mcp: async (dir, flags) => { calls.push({ dir, flags }); return { ok: true }; },
      deploy: noop, register: noop, batchAudit: noop,
    },
  });
  return { tree, calls };
}

// Suppress the human-vs-JSON console output dispatch() produces — this test
// only cares about what reached handlers.mcp, not rendering (that's covered
// by factory-render-boundary.test.mjs).
async function silently(fn) {
  const origLog = console.log;
  const origError = console.error;
  console.log = () => {};
  console.error = () => {};
  try {
    return await fn();
  } finally {
    console.log = origLog;
    console.error = origError;
  }
}

describe("mcp citty subcommand conversion — dispatch shape parity", () => {
  test("`factory mcp` (no subcommand) defaults to list, same as the old flags.action||flags._sub||'list' fallback", async () => {
    const { tree, calls } = makeTree();
    await silently(() => runCommand(tree.mcp, { rawArgs: [] }));
    expect(calls).toHaveLength(1);
    expect(calls[0].flags.action).toBe("list");
  });

  test("`factory mcp list` dispatches to list", async () => {
    const { tree, calls } = makeTree();
    await silently(() => runCommand(tree.mcp, { rawArgs: ["list"] }));
    expect(calls).toHaveLength(1);
    expect(calls[0].flags.action).toBe("list");
  });

  test("`factory mcp ls` (alias) also dispatches to list", async () => {
    const { tree, calls } = makeTree();
    await silently(() => runCommand(tree.mcp, { rawArgs: ["ls"] }));
    expect(calls).toHaveLength(1);
    expect(calls[0].flags.action).toBe("list");
  });

  test("`factory mcp enable --service X` dispatches to enable with --service carried through", async () => {
    const { tree, calls } = makeTree();
    await silently(() => runCommand(tree.mcp, { rawArgs: ["enable", "--service", "bigquery"] }));
    expect(calls).toHaveLength(1);
    expect(calls[0].flags.action).toBe("enable");
    expect(calls[0].flags.service).toBe("bigquery");
  });

  test("`factory mcp disable --service X` dispatches to disable with --service carried through", async () => {
    const { tree, calls } = makeTree();
    await silently(() => runCommand(tree.mcp, { rawArgs: ["disable", "--service", "maps"] }));
    expect(calls).toHaveLength(1);
    expect(calls[0].flags.action).toBe("disable");
    expect(calls[0].flags.service).toBe("maps");
  });

  test("`factory mcp plan` dispatches to plan (no --project/--service required)", async () => {
    const { tree, calls } = makeTree();
    await silently(() => runCommand(tree.mcp, { rawArgs: ["plan"] }));
    expect(calls).toHaveLength(1);
    expect(calls[0].flags.action).toBe("plan");
  });

  test("`factory mcp plan --project X --region Y` carries project/region through to cmdMcp's plan branch", async () => {
    const { tree, calls } = makeTree();
    await silently(() => runCommand(tree.mcp, { rawArgs: ["plan", "--project", "my-proj", "--region", "us-east1"] }));
    expect(calls).toHaveLength(1);
    expect(calls[0].flags.action).toBe("plan");
    expect(calls[0].flags.project).toBe("my-proj");
    expect(calls[0].flags.region).toBe("us-east1");
  });

  test("an unknown subcommand is a citty parse error, not a silent fall-through to list", async () => {
    const { tree, calls } = makeTree();
    let threw = false;
    try {
      await silently(() => runCommand(tree.mcp, { rawArgs: ["bogus-action"] }));
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
    expect(calls).toHaveLength(0);
  });
});
