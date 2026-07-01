// Tests for the render-boundary in registry.mjs: renderResult/renderError and
// the TTY-gating decision (isRealTTY). These use the SAME isTTY-injection
// pattern already proven for factory init's interactive-prompt gating (see
// factory-init-prompt.test.mjs / shouldPromptForInit) — the real
// process.stdout.isTTY is never touched; every test drives an explicit
// { isTTY } override instead.
//
// What this guards against regressing:
//   - Non-TTY (the default: piped/redirected/execFileSync-captured, which is
//     what every subprocess caller in this repo does) must ALWAYS get JSON,
//     with no flag required — dozens of scripts/tests parse this today.
//   - A real TTY without --json gets a human-friendly line via the flagship
//     renderer for a command, or the generic fallback for everything else.
//   - --json forces JSON even at a real TTY.
//   - renderError never throws for either path, and always includes the
//     underlying error message.
import { describe, expect, test } from "bun:test";
import { buildFactoryCommandTree, __test } from "./factory/registry.mjs";

const { renderResult, renderError, isRealTTY, HUMAN_RENDERERS } = __test;

// Capture console.log/console.error output around a callback without
// touching the real streams (avoids interfering with bun test's own output).
function captureConsole(fn) {
  const logs = [];
  const errors = [];
  const origLog = console.log;
  const origError = console.error;
  console.log = (...args) => logs.push(args.join(" "));
  console.error = (...args) => errors.push(args.join(" "));
  try {
    fn();
  } finally {
    console.log = origLog;
    console.error = origError;
  }
  return { logs, errors };
}

describe("isRealTTY", () => {
  test("respects an explicit override in both directions", () => {
    expect(isRealTTY({ isTTY: true })).toBe(true);
    expect(isRealTTY({ isTTY: false })).toBe(false);
  });

  test("defaults to the real process.stdout.isTTY when no override given", () => {
    // In this (non-interactive) test runner, stdout is never a real TTY, so
    // the default must resolve to false — the same as a CI run or a piped
    // invocation gets with zero flags.
    expect(isRealTTY({})).toBe(Boolean(process.stdout.isTTY));
  });
});

describe("renderResult — non-TTY (default) path stays JSON, byte-identical to the old ok()", () => {
  test("prints exactly { ok: true, ...result } as pretty JSON when isTTY is false", () => {
    const result = { ok: true, step: "init", name: "demo", domain: "hr" };
    const { logs, errors } = captureConsole(() => renderResult("init", result, { isTTY: false }));
    expect(logs).toEqual([JSON.stringify(result, null, 2)]);
    expect(errors).toEqual([]);
  });

  test("stays JSON at a real TTY when --json is explicitly passed", () => {
    const result = { ok: true, step: "init", name: "demo", domain: "hr" };
    const { logs } = captureConsole(() => renderResult("init", result, { isTTY: true, json: true }));
    expect(logs).toEqual([JSON.stringify(result, null, 2)]);
  });

  test("renders the SAME JSON regardless of which command name is passed", () => {
    // The JSON path must never depend on whether a flagship human renderer
    // exists for this command — only isTTY/--json decide the format.
    const result = { ok: true, step: "deploy-status", status: "done" };
    const { logs } = captureConsole(() => renderResult("deploy-status", result, { isTTY: false }));
    expect(logs).toEqual([JSON.stringify(result, null, 2)]);
  });
});

describe("renderResult — human path only engages at a real TTY without --json", () => {
  test("flagship renderer: init", () => {
    const result = { ok: true, step: "init", name: "acme", domain: "hr", dir: "/work/acme" };
    const { logs } = captureConsole(() => renderResult("init", result, { isTTY: true }));
    expect(logs.length).toBe(1);
    expect(logs[0]).toContain("acme");
    expect(logs[0]).toContain("hr");
    expect(logs[0]).not.toContain("{"); // not JSON
  });

  test("flagship renderer: generate", () => {
    const result = { ok: true, step: "generate", tables: [{ name: "a", rows: 1 }, { name: "b", rows: 2 }], totalRows: 3, manifest: "/work/fixtures/manifest.json" };
    const { logs } = captureConsole(() => renderResult("generate", result, { isTTY: true }));
    expect(logs.length).toBe(1);
    expect(logs[0]).toContain("2 tables");
    expect(logs[0]).toContain("manifest.json");
  });

  test("flagship renderer: tools", () => {
    const result = { ok: true, step: "tools", output: "/work/app/tools.py", functions: ["list_systems", "query_a"] };
    const { logs } = captureConsole(() => renderResult("tools", result, { isTTY: true }));
    expect(logs.length).toBe(1);
    expect(logs[0]).toContain("tools.py");
  });

  test("flagship renderer: status", () => {
    const result = {
      ok: true,
      name: "acme",
      domain: "hr",
      pipeline: [{ step: "init", status: "done" }, { step: "schema", status: "pending" }],
      nextCommand: "factory schema --dir /work/acme",
    };
    const { logs } = captureConsole(() => renderResult("status", result, { isTTY: true }));
    expect(logs.length).toBe(1);
    expect(logs[0]).toContain("acme");
    expect(logs[0]).toContain("schema");
  });

  test("generic fallback renders a short non-crashing line for a command with no bespoke renderer", () => {
    expect(HUMAN_RENDERERS["deploy-status"]).toBeUndefined();
    const result = { ok: true, step: "deploy-status", status: "done", project: "p", region: "us-central1" };
    const { logs } = captureConsole(() => renderResult("deploy-status", result, { isTTY: true }));
    expect(logs.length).toBe(1);
    expect(logs[0]).toContain("deploy-status");
  });

  test("generic fallback surfaces an obvious output/path field when present", () => {
    const result = { ok: true, step: "reset", output: "/work/artifacts/reset.json" };
    const { logs } = captureConsole(() => renderResult("reset", result, { isTTY: true }));
    expect(logs[0]).toContain("/work/artifacts/reset.json");
  });

  test("generic fallback never crashes when there's no obvious path-like field", () => {
    const result = { ok: true, step: "reset", resetFrom: "tools", currentStep: "generate" };
    expect(() => captureConsole(() => renderResult("reset", result, { isTTY: true }))).not.toThrow();
  });
});

describe("renderError", () => {
  test("non-TTY (default): prints { ok: false, error } as JSON to stderr, matching the old fail()", () => {
    const { errors, logs } = captureConsole(() => renderError("generate", new Error("No schema found."), { isTTY: false }));
    expect(logs).toEqual([]);
    expect(errors).toEqual([JSON.stringify({ ok: false, error: "No schema found." }, null, 2)]);
  });

  test("real TTY without --json: short human line, still carries the message", () => {
    const { errors } = captureConsole(() => renderError("generate", new Error("No schema found."), { isTTY: true }));
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain("No schema found.");
    expect(errors[0]).not.toContain("{");
  });

  test("--json forces JSON even at a real TTY for errors too", () => {
    const { errors } = captureConsole(() => renderError("generate", new Error("boom"), { isTTY: true, json: true }));
    expect(errors).toEqual([JSON.stringify({ ok: false, error: "boom" }, null, 2)]);
  });

  test("handles a non-Error thrown value without crashing", () => {
    const { errors } = captureConsole(() => renderError("generate", "plain string failure", { isTTY: false }));
    expect(errors).toEqual([JSON.stringify({ ok: false, error: "plain string failure" }, null, 2)]);
  });
});

describe("buildFactoryCommandTree — dispatch never lets a handler's rejection escape uncaught", () => {
  test("a rejecting handler resolves the command's run() instead of throwing, and sets process.exitCode", async () => {
    const originalExitCode = process.exitCode;
    try {
      process.exitCode = undefined;
      const tree = buildFactoryCommandTree({
        resolveDir: (d) => d || ".",
        parseLegacy: () => ({}),
        handlers: {
          status: async () => { throw new Error("boom"); },
          listUsecases: async () => ({ ok: true }),
          promotionGate: async () => ({ ok: true }),
          sources: async () => ({ ok: true }),
          packCoverage: async () => ({ ok: true }),
          init: async () => ({ ok: true }),
          schema: async () => ({ ok: true }),
          generate: async () => ({ ok: true }),
          tools: async () => ({ ok: true }),
          eval: async () => ({ ok: true }),
          serve: async () => ({ ok: true }),
          dataPlan: async () => ({ ok: true }),
          sourceIntegrationPlan: async () => ({ ok: true }),
          snowfakeryRecipe: async () => ({ ok: true }),
          deployStatus: async () => ({ ok: true }),
          verifyLive: async () => ({ ok: true }),
          publish: async () => ({ ok: true }),
          reset: async () => ({ ok: true }),
          planData: async () => ({ ok: true }),
          fromUseCase: async () => ({ ok: true }),
          test: async () => ({ ok: true }),
          qualityGate: async () => ({ ok: true }),
          harnessReview: async () => ({ ok: true }),
          harnessRefine: async () => ({ ok: true }),
          mcp: async () => ({ ok: true }),
          deploy: async () => ({ ok: true }),
          register: async () => ({ ok: true }),
          batchAudit: async () => ({ ok: true }),
        },
      });
      // status is a typed() command whose run() directly awaits dispatch(); call
      // it the same way citty would (it returns a promise, never throws).
      let threw = false;
      let result;
      const c = { logs: [], errors: [] };
      const origLog = console.log, origError = console.error;
      console.log = (...a) => c.logs.push(a.join(" "));
      console.error = (...a) => c.errors.push(a.join(" "));
      try {
        result = await tree.status.run({ args: { dir: "." } });
      } catch {
        threw = true;
      } finally {
        console.log = origLog;
        console.error = origError;
      }
      expect(threw).toBe(false);
      expect(c.errors.length).toBe(1);
      expect(JSON.parse(c.errors[0])).toEqual({ ok: false, error: "boom" });
      expect(process.exitCode).toBe(1);
    } finally {
      process.exitCode = originalExitCode;
    }
  });
});
