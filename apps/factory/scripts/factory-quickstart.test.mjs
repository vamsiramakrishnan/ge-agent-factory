// Tests for `factory quickstart`: the zero-flag local pipeline that composes
// cmdInit → cmdSchema → cmdGenerate → cmdTools → cmdTest in-process (same
// composition pattern cmdFromUseCase already uses — see factory.mjs). Two
// layers, matching this repo's existing conventions:
//
//   1. Registry wiring (like factory-render-boundary.test.mjs): quickstart is
//      declared in the citty command tree with an injected fake handler, and
//      the human-render path (renderQuickstart / registry.mjs __test) is
//      exercised WITHOUT a real terminal via the same isTTY-injection pattern
//      already proven there.
//   2. A real subprocess end-to-end run (like factory-workflow.test.mjs's
//      generateAgent() helper): spawns `node factory.mjs quickstart` against a
//      mkdtemp workspace and asserts on both the parsed JSON result and the
//      files actually written to disk. --run-tests false skips the uv/pytest
//      cycle so this stays fast and hermetic (mirrors factory-workflow.test.mjs's
//      own comment on why its from-usecase helper skips the heavy pytest step
//      wherever a test doesn't specifically need it).
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { execFileSyncCapture } from "@ge/std/subprocess";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildFactoryCommandTree, __test } from "./factory/registry.mjs";

const { renderResult, HUMAN_RENDERERS } = __test;

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const GE_MOCK = join(SCRIPT_DIR, "factory.mjs");
// factory resolves its use-case catalog relative to cwd; run subprocesses from
// the app root so `bun test` (which runs from the repo root) finds src/use-cases.js —
// same reasoning as factory-workflow.test.mjs's APP_DIR.
const APP_DIR = resolve(SCRIPT_DIR, "..");

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

describe("registry: quickstart command wiring", () => {
  function buildTree(quickstartHandler) {
    return buildFactoryCommandTree({
      resolveDir: (d) => resolve(d || "."),
      parseLegacy: () => ({}),
      handlers: {
        status: async () => ({ ok: true }),
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
        quickstart: quickstartHandler,
      },
    });
  }

  test("quickstart is a declared subcommand that forwards --dir/--name/--domain to the injected handler", async () => {
    let seenDir, seenArgs;
    const tree = buildTree(async (dir, args) => {
      seenDir = dir;
      seenArgs = args;
      return { ok: true, step: "quickstart" };
    });
    await tree.quickstart.run({ args: { dir: "./acme", name: "acme", domain: "hr" } });
    expect(seenDir).toBe(resolve("./acme"));
    expect(seenArgs.name).toBe("acme");
    expect(seenArgs.domain).toBe("hr");
  });

  test("a quickstart handler rejection renders as a JSON error and sets process.exitCode, never throws", async () => {
    const originalExitCode = process.exitCode;
    try {
      process.exitCode = undefined;
      const tree = buildTree(async () => { throw new Error("boom"); });
      const { errors } = captureConsole(() => {});
      let threw = false;
      const c = { errors: [] };
      const origError = console.error;
      console.error = (...a) => c.errors.push(a.join(" "));
      try {
        await tree.quickstart.run({ args: { dir: "." } });
      } catch {
        threw = true;
      } finally {
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

describe("renderResult — quickstart has a flagship human renderer", () => {
  const result = {
    ok: true,
    step: "quickstart",
    name: "acme",
    domain: "hr",
    dir: "/work/acme",
    tables: 1,
    totalRows: 25,
    functions: ["list_systems", "query_records"],
    test: { skipped: true, reason: "Pass --run-tests true..." },
    nextCommand: "factory test --dir /work/acme",
  };

  test("stays JSON at a non-TTY (default), byte-identical to the raw result", () => {
    const { logs, errors } = captureConsole(() => renderResult("quickstart", result, { isTTY: false }));
    expect(logs).toEqual([JSON.stringify(result, null, 2)]);
    expect(errors).toEqual([]);
  });

  test("human path at a real TTY: one line per stage, a summary, and a trailing Next: line", () => {
    expect(HUMAN_RENDERERS.quickstart).toBeDefined();
    const { logs } = captureConsole(() => renderResult("quickstart", result, { isTTY: true }));
    expect(logs.length).toBe(1);
    const out = logs[0];
    expect(out).toContain("acme");
    expect(out).toContain("hr");
    expect(out).toContain("init");
    expect(out).toContain("schema");
    expect(out).toContain("generate");
    expect(out).toContain("tools");
    expect(out).toContain("test");
    expect(out).toContain("skipped");
    expect(out).toContain("Next: factory test --dir /work/acme");
  });

  test("human path never crashes when a stage result is missing optional fields", () => {
    const sparse = { ok: true, step: "quickstart", name: "x", domain: "general", dir: "/work/x" };
    expect(() => captureConsole(() => renderResult("quickstart", sparse, { isTTY: true }))).not.toThrow();
  });
});

// ── End-to-end (real subprocess, hermetic — --run-tests false skips uv/pytest) ──

describe("factory quickstart — real subprocess, non-TTY JSON", () => {
  test("runs init -> schema -> generate -> tools -> test(skipped) and returns an aggregated result", () => {
    const dir = mkdtempSync(join(tmpdir(), "ge-quickstart-"));
    const env = { ...process.env, GE_SOURCE_DATE: "2026-01-01T00:00:00Z" };
    try {
      const stdout = execFileSyncCapture(
        "node",
        [GE_MOCK, "quickstart", "--dir", dir, "--name", "quickstart-demo", "--domain", "general", "--run-tests", "false"],
        { env, cwd: APP_DIR },
      );
      const result = JSON.parse(stdout);

      expect(result.ok).toBe(true);
      expect(result.step).toBe("quickstart");
      expect(result.name).toBe("quickstart-demo");
      expect(result.domain).toBe("general");
      expect(result.dir).toBe(dir);

      // Each stage's own result is embedded verbatim (same nested-result
      // convention cmdFromUseCase uses for harnessReview/harnessRefine).
      expect(result.init.ok).toBe(true);
      expect(result.init.step).toBe("init");
      expect(result.schema.ok).toBe(true);
      expect(result.generate.ok).toBe(true);
      expect(result.generate.totalRows).toBeGreaterThan(0);
      expect(result.tools.ok).toBe(true);
      expect(Array.isArray(result.tools.functions)).toBe(true);
      expect(result.test.skipped).toBe(true);

      // Convenience roll-up fields.
      expect(result.tables).toBe(1);
      expect(result.totalRows).toBe(result.generate.totalRows);
      expect(result.functions).toEqual(result.tools.functions);

      // nextCommand points at the next incomplete pipeline step (test, since
      // it was skipped) — same derivation `factory status` uses.
      expect(result.nextCommand).toContain("factory test");
      expect(result.nextCommand).toContain(dir);

      // The workspace itself was actually built on disk. test_smoke.py is
      // NOT written here — --run-tests false means quickstart never calls
      // cmdTest (writing that file is cmdTest's job, not cmdTools's).
      expect(existsSync(join(dir, "mock_systems", "schema.json"))).toBe(true);
      expect(existsSync(join(dir, "fixtures", "manifest.json"))).toBe(true);
      expect(existsSync(join(dir, "app", "tools.py"))).toBe(true);
      expect(existsSync(join(dir, "app", "agent.py"))).toBe(true);
      expect(existsSync(join(dir, "tests", "test_smoke.py"))).toBe(false);
      expect(existsSync(join(dir, "mock_systems", "pipeline.json"))).toBe(true);

      const pipeline = JSON.parse(readFileSync(join(dir, "mock_systems", "pipeline.json"), "utf8"));
      expect(pipeline.steps.init.status).toBe("done");
      expect(pipeline.steps.schema.status).toBe("done");
      expect(pipeline.steps.generate.status).toBe("done");
      expect(pipeline.steps.tools.status).toBe("done");
      // test was skipped (--run-tests false), so quickstart never calls
      // cmdTest and the pipeline never marks that step.
      expect(pipeline.steps.test).toBeUndefined();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 30000);

  test("respects a caller-supplied --add-table instead of the built-in default table", () => {
    const dir = mkdtempSync(join(tmpdir(), "ge-quickstart-table-"));
    const env = { ...process.env, GE_SOURCE_DATE: "2026-01-01T00:00:00Z" };
    const customTable = JSON.stringify({ name: "widgets", rows: 5, columns: [{ name: "id", type: "seq", pattern: "W-{n:3}" }] });
    try {
      const stdout = execFileSyncCapture(
        "node",
        [GE_MOCK, "quickstart", "--dir", dir, "--add-table", customTable, "--run-tests", "false"],
        { env, cwd: APP_DIR },
      );
      const result = JSON.parse(stdout);
      expect(result.ok).toBe(true);
      expect(result.generate.tables.map((t) => t.name)).toEqual(["widgets"]);
      expect(result.generate.totalRows).toBe(5);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 30000);

  test("never touches deploy/register/publish — those pipeline steps stay untouched after quickstart", () => {
    const dir = mkdtempSync(join(tmpdir(), "ge-quickstart-scope-"));
    const env = { ...process.env, GE_SOURCE_DATE: "2026-01-01T00:00:00Z" };
    try {
      execFileSync("node", [GE_MOCK, "quickstart", "--dir", dir, "--run-tests", "false"], { env, stdio: "ignore", cwd: APP_DIR });
      const pipeline = JSON.parse(readFileSync(join(dir, "mock_systems", "pipeline.json"), "utf8"));
      expect(pipeline.steps.deploy).toBeUndefined();
      expect(pipeline.steps.register).toBeUndefined();
      expect(pipeline.steps.publish).toBeUndefined();
      expect(pipeline.steps.serve).toBeUndefined();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 30000);

  // --run-tests defaults to true (unset here), so this exercises the real
  // cmdTest stage (writes tests/test_smoke.py and runs `uv run pytest`).
  // NOTE: this intentionally does NOT assert result.test.passed === true.
  // The generated smoke test currently fails for ANY table with no
  // _sourceSystem (quickstart's default table included) — app/tools.py emits
  // `sourceSystem: null` as a raw JS/JSON literal into Python source, where
  // `null` isn't a name (Python needs `None`). Reproduced independently on
  // pristine HEAD via `factory schema --add-table ...` + generate + tools +
  // test with a hand-written table — this is a pre-existing bug in
  // factory/tools/render-tools-py.mjs, unrelated to and predating quickstart.
  // What THIS test guards is quickstart's own contract: it must actually run
  // the test stage (not skip or swallow it) and faithfully report whatever
  // cmdTest returns, including a failure, in result.test.
  test("--run-tests (default true) actually generates and runs the smoke tests, faithfully reporting the outcome", () => {
    const dir = mkdtempSync(join(tmpdir(), "ge-quickstart-runtests-"));
    const env = { ...process.env, GE_SOURCE_DATE: "2026-01-01T00:00:00Z" };
    try {
      // NOTE: stdout is NOT captured/parsed as JSON here — cmdTest streams the
      // child `uv run pytest` process's own stdout through (runCommand's
      // { stream: true }), which lands on this subprocess's inherited stdout
      // and would interleave with (and corrupt) the JSON. pipeline.json on
      // disk is the source of truth instead; { stdio: "ignore" } matches the
      // convention factory-workflow.test.mjs already uses for the same reason.
      execFileSync(
        "node",
        [GE_MOCK, "quickstart", "--dir", dir, "--name", "runtests-demo", "--domain", "general"],
        { env, stdio: "ignore", cwd: APP_DIR },
      );
      expect(existsSync(join(dir, "tests", "test_smoke.py"))).toBe(true);
      const pipeline = JSON.parse(readFileSync(join(dir, "mock_systems", "pipeline.json"), "utf8"));
      expect(pipeline.steps.test).toBeDefined();
      expect(["done", "failed"]).toContain(pipeline.steps.test.status);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 60000);
});

describe("factory quickstart — real subprocess, TTY human output", () => {
  test("prints one line per stage and a trailing Next: line at a real terminal", () => {
    const dir = mkdtempSync(join(tmpdir(), "ge-quickstart-tty-"));
    const env = { ...process.env, GE_SOURCE_DATE: "2026-01-01T00:00:00Z" };
    const pyScript = `
import pty, os, subprocess, sys
master, slave = pty.openpty()
proc = subprocess.Popen(sys.argv[1:], stdin=slave, stdout=slave, stderr=slave, close_fds=True)
os.close(slave)
out = b""
while True:
    try:
        chunk = os.read(master, 4096)
    except OSError:
        break
    if not chunk:
        break
    out += chunk
proc.wait()
sys.stdout.write(out.decode(errors="replace"))
`;
    try {
      const stdout = execFileSyncCapture(
        "python3",
        ["-c", pyScript, "node", GE_MOCK, "quickstart", "--dir", dir, "--name", "tty-demo", "--domain", "general", "--run-tests", "false"],
        { env, cwd: APP_DIR },
      );
      expect(stdout).toContain("quickstart");
      expect(stdout).toContain("tty-demo");
      expect(stdout).not.toContain('"ok": true'); // not JSON
      expect(stdout).toMatch(/Next: factory test/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 30000);
});
