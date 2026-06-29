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
export function buildFactoryCommandTree({ resolveDir, parseLegacy, handlers }) {
  const typed = (name, description, args, run) =>
    defineCommand({ meta: { name, description }, args, run });

  // dir-taking typed command whose handler reads its flags off the parsed args.
  const dirCmd = (name, description, flags, handler) =>
    typed(name, description, { dir: { type: "string", description: "Workspace directory", default: "." }, ...flags },
      ({ args }) => handler(resolveDir(args.dir), args));

  const legacy = (name, description, handler, takesDir = true) =>
    defineCommand({
      meta: { name, description },
      run: (ctx) => {
        const flags = parseLegacy(ctx.rawArgs);
        return takesDir ? handler(resolveDir(flags.dir || "."), flags) : handler(flags);
      },
    });

  const str = (description) => ({ type: "string", description });

  return {
    // ── Typed (flags-only handlers) ──────────────────────────────────────────
    status: typed("status", "Status board for a generated workspace",
      { dir: { type: "string", description: "Workspace directory", default: "." } },
      ({ args }) => handlers.status(resolveDir(args.dir))),
    "list-usecases": typed("list-usecases", "List use cases in the catalog",
      { department: str("Filter by department"), search: str("Filter by search term"), limit: str("Max results"), json: { type: "boolean", description: "Emit JSON" } },
      ({ args }) => handlers.listUsecases(args)),
    sources: typed("sources", "Analyze use-case data sources (writes the source map + doc)",
      { json: str("Output JSON path"), md: str("Output markdown path"), slides: str("Slides source directory") },
      ({ args }) => handlers.sources(args)),
    "pack-coverage": typed("pack-coverage", "Report scenario-pack coverage across the catalog",
      { out: str("Write the full report to this path") },
      ({ args }) => handlers.packCoverage(args)),

    // ── Typed (dir + clean string-value flags) ───────────────────────────────
    "promotion-gate": dirCmd("promotion-gate", "Evaluate the promotion gate (blocks deploy on failure)",
      { force: { type: "boolean", description: "Override blockers" } }, handlers.promotionGate),
    init: dirCmd("init", "Initialize a workspace", { name: str("Agent name"), domain: str("Domain") }, handlers.init),
    schema: dirCmd("schema", "Derive / edit the schema", { "add-table": str("Add a table (JSON)"), "from-file": str("Import schema JSON") }, handlers.schema),
    generate: dirCmd("generate", "Generate mock data", { seed: str("Faker seed"), rows: str("Default rows per table") }, handlers.generate),
    eval: dirCmd("eval", "Run evals", { run: str("Set to 'false' to skip running"), "eval-timeout": str("Eval timeout (s)"), "timeout-ms": str("Command timeout (ms)") }, handlers.eval),
    serve: dirCmd("serve", "Serve the agent locally (adk web)", { port: str("Port (default 8080)") }, handlers.serve),
    "data-plan": dirCmd("data-plan", "Build the cloud data plan", {}, handlers.dataPlan),
    "source-integration-plan": dirCmd("source-integration-plan", "Plan source-system integration", {}, handlers.sourceIntegrationPlan),
    "snowfakery-recipe": dirCmd("snowfakery-recipe", "Emit the Snowfakery recipe", { rows: str("Rows per object") }, handlers.snowfakeryRecipe),
    "deploy-status": dirCmd("deploy-status", "Check deploy status", {}, handlers.deployStatus),
    "verify-live": dirCmd("verify-live", "Verify the deployed agent",
      { url: str("Override URL"), mode: str("adk|a2a"), prompt: str("Prompt"), "app-name": str("App name"), "timeout-ms": str("Timeout (ms)") }, handlers.verifyLive),
    publish: dirCmd("publish", "Publish to Gemini Enterprise",
      { location: str("Location"), region: str("Region"), "project-number": str("Project number"), "app-id": str("GE app id"), "display-name": str("Display name"), description: str("Description") }, handlers.publish),
    reset: dirCmd("reset", "Reset workspace pipeline state", { step: str("Reset from this step") }, handlers.reset),
    "plan-data": dirCmd("plan-data", "Plan mock data generation", { usecase: str("Use case id"), "source-map": str("Source-map path") }, handlers.planData),

    // ── Newly typed (clean string flags; parse-verified) ────────────────────
    tools: dirCmd("tools", "Render app/tools.py and scaffold",
      { out: str("Output path for tools.py"), "force-agent": str("Regenerate app/agent.py (true/false)") }, handlers.tools),
    "from-usecase": dirCmd("from-usecase", "Generate a full workspace from a use case",
      {
        usecase: str("Use case id from the enterprise catalog"),
        id: str("Alias for --usecase"),
        freeform: str("Freeform use-case description (when not using --usecase)"),
        rows: str("Rows per table"),
        seed: str("Faker seed"),
        domain: str("Department / domain slug"),
        systems: str("Comma-separated source systems"),
        "force-agent": str("Regenerate app/agent.py (true/false)"),
        "run-tests-after-refine": str("Run smoke tests after refine (true/false)"),
        out: str("Write the run report to this path"),
      }, handlers.fromUseCase),

    // ── Legacy passthrough — each kept legacy for a CONCRETE reason citty's
    //    strict parsing would break; not yet typed:
    //    test          — uses `"flag" in flags` presence detection; citty fills
    //                    declared flags with defaults, so `in` is always true.
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
