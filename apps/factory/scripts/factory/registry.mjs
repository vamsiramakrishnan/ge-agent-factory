import { defineCommand } from "citty";

// citty command registry for the factory CLI (Week-4 / PR-B). Replaces the
// hand-rolled parseArgs + 28-case switch. Two kinds of command:
//   - TYPED: citty args schema (typed flags + auto --help).
//   - LEGACY passthrough: re-parses ctx.rawArgs with the existing parser and
//     calls the handler — byte-identical to the old switch.
// A command stays on LEGACY only when typing it would change behaviour under
// citty's strict parsing: handlers that compare flags to the STRING "true"
// (=== "true"), ambiguous --soft (true/false/valueless), sub-action dispatch
// (mcp), or commands that FORWARD arbitrary flags to others (batch-audit).
// Handlers are INJECTED (not imported) → no import cycle back to factory.mjs.
//
// Flag aliases: a TYPED arg may declare `alias: [...]` (citty); citty mirrors
// the value onto both the canonical key and every alias key in the parsed
// `args` object, so a legacy handler reading `args["force-agent"]` keeps
// working unchanged even when the caller passes the alias `--regenerate-agent`
// instead. Existing flag names are never removed or renamed — aliases are
// additive only.
//
// ── Rendering boundary ───────────────────────────────────────────────────
// Every command handler in factory.mjs (cmdInit, cmdGenerate, ...) used to
// print its own JSON directly (via the old process-printing ok()/fail()) and,
// on failure, process.exit(1) the whole CLI. Handlers now RETURN a plain data
// object on success and THROW on failure; this module is the single place
// that turns that return-or-throw into console output + exit code. This is
// what makes commands composable in-process (from-usecase/batch-audit call
// other cmd* functions directly and can now catch their failures instead of
// the whole process dying) and opens the door to non-JSON output.
//
// Output format is NEVER decided by a flag the caller must remember to pass.
// It's decided by whether stdout is a real terminal:
//   - stdout is NOT a TTY (piped, redirected, captured by execFileSync/spawn —
//     which is what every subprocess caller in this repo does) → JSON, byte-
//     identical to what the old ok()/fail() printed. This is the default and
//     requires zero flags; dozens of scripts/tests parse this JSON today.
//   - stdout IS a real TTY and the caller did not pass --json → human-
//     friendly text. --json always forces JSON even at a real TTY.
// This mirrors the isTTY-gating already used for the interactive `factory
// init` prompt wizard (see shouldPromptForInit in factory.mjs): default
// behavior for scripted/CI/subprocess usage never changes; only an actual
// human at an actual terminal (and only when they haven't asked for --json)
// sees anything different.

function isRealTTY({ isTTY = Boolean(process.stdout.isTTY) } = {}) {
  return isTTY;
}

// Renders a successful command result. `result` is exactly what the handler
// returned (already shaped like { ok: true, ...data } by factory.mjs's own
// ok() helper — see there for why handlers return that shape rather than this
// module re-wrapping it). `opts.isTTY` is injectable for tests; `opts.json`
// forces the JSON path even at a real TTY.
function renderResult(name, result, opts = {}) {
  const useHuman = isRealTTY(opts) && !opts.json;
  if (!useHuman) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  const renderer = HUMAN_RENDERERS[name] || renderGenericSuccess;
  renderer(name, result);
}

// Renders a failed command. `error` is whatever the handler threw — normally
// a FactoryCommandError from factory.mjs's fail(), but this renders ANY
// thrown error the same way, matching fail()'s original contract (before
// this refactor, essentially every reachable command failure went through
// fail() one way or another).
function renderError(name, error, opts = {}) {
  const message = error?.message ?? String(error);
  const useHuman = isRealTTY(opts) && !opts.json;
  if (!useHuman) {
    console.error(JSON.stringify({ ok: false, error: message }, null, 2));
    return;
  }
  console.error(`✗ ${message}`);
}

// ── Human renderers ──────────────────────────────────────────────────────
// Flagship renderers for the commands a new user hits first. Everything else
// falls back to renderGenericSuccess below. Adding a new flagship renderer
// later is just one more entry in this map — no plumbing changes needed.
// Every flagship renderer (and the generic fallback below) appends this same
// trailing "Next: <command>" line when the result carries a nextCommand —
// the human-render equivalent of the nextCommand field factory.mjs's cmd*
// handlers now attach to their return value (see nextCommandFor in
// factory.mjs). Centralized so a new flagship renderer gets this for free.
function withNextLine(line, result) {
  return result?.nextCommand ? `${line}\nNext: ${result.nextCommand}` : line;
}

function renderInit(name, result) {
  console.log(withNextLine(`✓ Initialized "${result.name}" (${result.domain}) -> ${result.dir}`, result));
}

function renderGenerate(name, result) {
  const tableCount = result.tables?.length ?? 0;
  const rows = typeof result.totalRows === "number" ? result.totalRows.toLocaleString() : result.totalRows;
  console.log(withNextLine(`✓ Generated ${tableCount} table${tableCount === 1 ? "" : "s"}, ${rows} rows -> ${result.manifest}`, result));
}

function renderTools(name, result) {
  const fnCount = result.functions?.length ?? 0;
  console.log(withNextLine(`✓ Rendered ${fnCount} tool function${fnCount === 1 ? "" : "s"} -> ${result.output}`, result));
}

function renderStatus(name, result) {
  const lines = [`Agent: ${result.name} (${result.domain})`];
  for (const step of result.pipeline || []) {
    const mark = step.status === "done" ? "✓" : step.status === "failed" ? "✗" : "·";
    lines.push(`  ${mark} ${step.step}`);
  }
  if (result.nextCommand) lines.push(`Next: ${result.nextCommand}`);
  console.log(lines.join("\n"));
}

// Quickstart runs 5 stages in-process (init/schema/generate/tools/test) and
// returns each stage's own result embedded under init/schema/generate/tools/
// test — same nested-result convention cmdFromUseCase already uses for its
// harnessReview/harnessRefine fields. One line per stage, then a summary +
// next-step suggestion, matching the "what you just built and where it is"
// shape asked for.
function renderQuickstart(name, result) {
  const lines = [`✓ quickstart: "${result.name}" (${result.domain}) built in ${result.dir}`];
  lines.push(`  ✓ init      -> ${result.dir}`);
  lines.push(`  ✓ schema    -> ${result.tables ?? "?"} table(s)`);
  const rows = typeof result.totalRows === "number" ? result.totalRows.toLocaleString() : result.totalRows ?? "?";
  lines.push(`  ✓ generate  -> ${rows} rows`);
  lines.push(`  ✓ tools     -> ${result.functions?.length ?? "?"} function(s)`);
  const test = result.test;
  if (test?.skipped) lines.push(`  · test      -> skipped (${test.reason})`);
  else if (test?.ran) lines.push(`  ${test.passed ? "✓" : "✗"} test      -> ${test.passed ? "passed" : "failed"} (${result.dir}/tests)`);
  else lines.push(`  ✓ test      -> generated (not run)`);
  lines.push(`\nWhat you built: a local agent workspace at ${result.dir} with mock data, generated ADK tools, and smoke tests.`);
  if (result.nextCommand) lines.push(`Next: ${result.nextCommand}`);
  console.log(lines.join("\n"));
}

// Generic fallback: works for any command's result shape without a bespoke
// renderer. Surfaces a couple of obviously-useful fields (a path/output, a
// step name) when present, and always stays a single short line (plus an
// optional trailing Next: line — see withNextLine above).
function renderGenericSuccess(name, result) {
  const hint = result?.output || result?.dir || result?.manifest || result?.markdown || null;
  console.log(withNextLine(hint ? `✓ ${name} done -> ${hint}` : `✓ ${name} done`, result));
}

const HUMAN_RENDERERS = {
  init: renderInit,
  generate: renderGenerate,
  tools: renderTools,
  status: renderStatus,
  quickstart: renderQuickstart,
};

// Wraps a handler invocation so:
//   - a resolved value is rendered as success and returned (dirCmd/legacy's
//     own run() then resolves normally — citty sees no error, so it never
//     falls back to its own non-JSON `console.error(error, "\n")` handling).
//   - a thrown error (FactoryCommandError from fail(), or any other error) is
//     rendered as failure and swallowed HERE, with process.exitCode set to 1
//     instead of process.exit(1)ing. process.exitCode lets Node finish
//     flushing stdout/stderr and exit normally once the event loop drains —
//     unlike process.exit(1), which could truncate output mid-write.
async function dispatch(name, handlerPromise, opts) {
  try {
    const result = await handlerPromise;
    renderResult(name, result, opts);
    return result;
  } catch (error) {
    renderError(name, error, opts);
    process.exitCode = 1;
    return undefined;
  }
}

// citty's builtin --json isn't a thing; declare it ourselves on every command
// that goes through dispatch() so `factory <cmd> --json` forces JSON even at
// a real TTY. Doesn't collide with any existing flag name in this file.
const withJsonFlag = (args) => ({ ...args, json: { type: "boolean", description: "Force JSON output even at an interactive terminal" } });

export function buildFactoryCommandTree({ resolveDir, parseLegacy, handlers }) {
  const typed = (name, description, args, run) =>
    defineCommand({ meta: { name, description }, args, run });

  // dir-taking typed command whose handler reads its flags off the parsed args.
  // Routed through dispatch() so success/failure both render exactly once and
  // failure never process.exit()s (see module doc comment above).
  const dirCmd = (name, description, flags, handler) =>
    typed(name, description, withJsonFlag({ dir: { type: "string", description: "Workspace directory", default: "." }, ...flags }),
      ({ args }) => dispatch(name, handler(resolveDir(args.dir), args), { json: args.json }));

  const legacy = (name, description, handler, takesDir = true) =>
    defineCommand({
      meta: { name, description },
      run: (ctx) => {
        const flags = parseLegacy(ctx.rawArgs);
        return dispatch(
          name,
          takesDir ? handler(resolveDir(flags.dir || "."), flags) : handler(flags),
          { json: flags.json === true || flags.json === "true" },
        );
      },
    });

  const str = (description) => ({ type: "string", description });

  return {
    // ── Typed (flags-only handlers) ──────────────────────────────────────────
    status: typed("status", "Status board for a generated workspace",
      withJsonFlag({ dir: { type: "string", description: "Workspace directory", default: "." } }),
      ({ args }) => dispatch("status", handlers.status(resolveDir(args.dir)), { json: args.json })),
    "list-usecases": typed("list-usecases", "List use cases in the catalog",
      { department: str("Filter by department"), search: str("Filter by search term"), limit: str("Max results"), json: { type: "boolean", description: "Emit JSON" } },
      ({ args }) => dispatch("list-usecases", handlers.listUsecases(args), { json: args.json })),
    // NOTE: no --json override flag here — `sources` already has its own
    // `--json <path>` (a FILE PATH to write, not a boolean); adding a same-
    // named boolean --json would collide with and break that existing flag.
    // `sources` always renders through the default TTY-gated path (JSON at a
    // non-TTY, generic human summary at a real terminal) with no override.
    sources: typed("sources", "Analyze use-case data sources (writes the source map + doc)",
      { json: str("Output JSON path"), md: str("Output markdown path"), slides: str("Slides source directory") },
      ({ args }) => dispatch("sources", handlers.sources(args), {})),
    "pack-coverage": typed("pack-coverage", "Report scenario-pack coverage across the catalog",
      withJsonFlag({ out: str("Write the full report to this path") }),
      ({ args }) => dispatch("pack-coverage", handlers.packCoverage(args), { json: args.json })),

    // ── Typed (dir + clean string-value flags) ───────────────────────────────
    "promotion-gate": dirCmd("promotion-gate", "Evaluate the promotion gate (blocks deploy on failure)",
      { force: { type: "boolean", description: "Override blockers" } }, handlers.promotionGate),
    init: dirCmd("init", "Initialize a workspace", { name: str("Agent name"), domain: str("Domain") }, handlers.init),
    schema: dirCmd("schema", "Derive / edit the schema", { "add-table": str("Add a table (JSON)"), "from-file": str("Import schema JSON") }, handlers.schema),
    generate: dirCmd("generate", "Generate mock data", { seed: str("Faker seed"), rows: str("Default rows per table") }, handlers.generate),
    eval: dirCmd("eval", "Run evals", { run: str("Set to 'false' to skip running"), "eval-timeout": str("Eval timeout in SECONDS (s)"), "timeout-ms": str("Command timeout in MILLISECONDS (ms) — note: --eval-timeout above is in seconds, not ms") }, handlers.eval),
    serve: dirCmd("serve", "Serve the agent locally (adk web)", { port: str("Port (default 8080)") }, handlers.serve),
    "data-plan": dirCmd("data-plan", "Build the cloud data plan", {}, handlers.dataPlan),
    "source-integration-plan": dirCmd("source-integration-plan", "Plan source-system integration", {}, handlers.sourceIntegrationPlan),
    "snowfakery-recipe": dirCmd("snowfakery-recipe", "Emit the Snowfakery recipe", { rows: str("Rows per object") }, handlers.snowfakeryRecipe),
    "deploy-status": dirCmd("deploy-status", "Check deploy status", {}, handlers.deployStatus),
    "verify-live": dirCmd("verify-live", "Verify the deployed agent",
      { url: str("Override URL"), mode: str("adk|a2a"), prompt: str("Prompt"), "app-name": str("App name"), "timeout-ms": str("Request timeout in MILLISECONDS (ms)") }, handlers.verifyLive),
    publish: dirCmd("publish", "Publish to Gemini Enterprise",
      { location: str("Location"), region: str("Region"), "project-number": str("Project number"), "app-id": str("GE app id"), "display-name": str("Display name"), description: str("Description") }, handlers.publish),
    reset: dirCmd("reset", "Reset workspace pipeline state", { step: str("Reset from this step") }, handlers.reset),
    "plan-data": dirCmd("plan-data", "Plan mock data generation", { usecase: str("Use case id"), "source-map": str("Source-map path") }, handlers.planData),

    // ── Newly typed (clean string flags; parse-verified) ────────────────────
    tools: dirCmd("tools", "Render app/tools.py and scaffold",
      { out: str("Output path for tools.py"), "force-agent": { type: "string", alias: ["regenerate-agent"], description: "Force regeneration of app/agent.py even if it already exists (true/false; alias: --regenerate-agent)" } }, handlers.tools),
    "from-usecase": dirCmd("from-usecase", "Generate a full workspace from a use case",
      {
        usecase: str("Use case id from the enterprise catalog"),
        id: str("Alias for --usecase"),
        freeform: str("Freeform use-case description (when not using --usecase)"),
        rows: str("Rows per table"),
        seed: str("Faker seed"),
        domain: str("Department / domain slug"),
        systems: str("Comma-separated source systems"),
        "force-agent": { type: "string", alias: ["regenerate-agent"], description: "Force regeneration of app/agent.py even if it already exists (true/false; alias: --regenerate-agent)" },
        "run-tests-after-refine": str("Run smoke tests after refine (true/false)"),
        out: str("Write the run report to this path"),
      }, handlers.fromUseCase),
    quickstart: dirCmd("quickstart", "Zero-flag local pipeline for a brand-new workspace: init -> schema -> generate -> tools -> test",
      {
        name: str("Agent name"),
        domain: str("Domain"),
        "add-table": str("Override the default seed table (JSON) added during the schema step"),
        seed: str("Faker seed"),
        rows: str("Default rows per table"),
        "force-agent": { type: "string", alias: ["regenerate-agent"], description: "Force regeneration of app/agent.py even if it already exists (true/false; alias: --regenerate-agent)" },
        "run-tests": str("Set to 'false' to skip generating + running smoke tests (default: true)"),
      }, handlers.quickstart),

    // ── Legacy passthrough — each kept legacy for a CONCRETE reason citty's
    //    strict parsing would break; not yet typed:
    //    test          — reads flags.out/flags["run"]/flags["include-integration"],
    //                    the same shape as the already-typed `eval` command, so
    //                    the `"flag" in flags` presence-detection hazard (real in
    //                    shouldRunFlag/wantsVertex/shouldRunHarnessReview elsewhere
    //                    in factory.mjs) doesn't apply here; retyping `test` is
    //                    deferred as its own decision, not blocked on that hazard.
    //    quality-gate  — `--lint-fix`/`--lint-mypy` are `=== "true"` checks used
    //                    bare; runs agents-cli (can't verify parsing offline).
    //    harness-review/refine — `--soft`/`--vertex` are passed WITH values
    //                    (factory-worker `--soft true`) yet also used valueless;
    //                    citty can't model both, and they drive the external harness.
    //    mcp           — sub-action dispatch (`mcp deploy|doctor|…`); needs citty
    //                    subcommands, not flags.
    //    deploy/register — `--wait === "true"` bare hazard + gcloud/agents-cli only
    //                    (deploy path, unverifiable in this environment).
    //    batch-audit   — FORWARDS arbitrary flags to other commands; citty strict
    //                    parsing rejects undeclared flags.
    test: legacy("test", "Run the workspace smoke tests", handlers.test),
    "quality-gate": legacy("quality-gate", "Run the quality gate", handlers.qualityGate),
    "harness-review": legacy("harness-review", "Antigravity harness review (read-only)", handlers.harnessReview),
    "harness-refine": legacy("harness-refine", "Antigravity harness refine (write-enabled)", handlers.harnessRefine),
    mcp: legacy("mcp", "MCP tool-plane operations", handlers.mcp),
    deploy: legacy("deploy", "Deploy the agent (Cloud Run / Agent Runtime)", handlers.deploy),
    register: legacy("register", "Register the agent (Gemini Enterprise / MCP)", handlers.register),
    "batch-audit": legacy("batch-audit", "Audit use-case specs in batch", handlers.batchAudit, false),
  };
}

// Exported for the render-boundary unit test (renderResult/renderError take an
// injectable isTTY so tests never need a real terminal — see the isTTY-
// injection pattern already used for shouldPromptForInit in factory.mjs).
export const __test = { renderResult, renderError, isRealTTY, HUMAN_RENDERERS };
