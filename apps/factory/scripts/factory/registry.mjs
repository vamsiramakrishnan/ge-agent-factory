import { defineCommand } from "citty";

// citty command registry for the factory CLI (Week-4 / PR-B). Replaces the
// hand-rolled parseArgs + 28-case switch. Two kinds of command:
//   - TYPED: citty args schema (typed flags, the migration target).
//   - LEGACY passthrough: re-parses ctx.rawArgs with the existing parser and
//     calls the handler — byte-identical behaviour to the old switch, so every
//     command moves onto the registry now and gets typed args incrementally.
// Handlers are INJECTED (not imported) → no import cycle back to factory.mjs.
export function buildFactoryCommandTree({ resolveDir, parseLegacy, handlers }) {
  const typed = (name, description, args, run) =>
    defineCommand({ meta: { name, description }, args, run });

  const legacy = (name, description, handler, takesDir = true) =>
    defineCommand({
      meta: { name, description },
      run: (ctx) => {
        const flags = parseLegacy(ctx.rawArgs);
        return takesDir ? handler(resolveDir(flags.dir || "."), flags) : handler(flags);
      },
    });

  return {
    // ── Typed commands ──────────────────────────────────────────────────────
    status: typed("status", "Status board for a generated workspace",
      { dir: { type: "string", description: "Workspace directory", default: "." } },
      ({ args }) => handlers.status(resolveDir(args.dir))),
    "list-usecases": typed("list-usecases", "List use cases in the catalog",
      {
        department: { type: "string", description: "Filter by department" },
        search: { type: "string", description: "Filter by search term" },
        limit: { type: "string", description: "Max results" },
        json: { type: "boolean", description: "Emit JSON" },
      },
      ({ args }) => handlers.listUsecases(args)),
    "promotion-gate": typed("promotion-gate", "Evaluate the promotion gate (blocks deploy on failure)",
      {
        dir: { type: "string", description: "Workspace directory", default: "." },
        force: { type: "boolean", description: "Override blockers" },
      },
      ({ args }) => handlers.promotionGate(resolveDir(args.dir), args)),
    sources: typed("sources", "Analyze use-case data sources (writes the source map + doc)",
      {
        json: { type: "string", description: "Output JSON path" },
        md: { type: "string", description: "Output markdown path" },
        slides: { type: "string", description: "Slides source directory" },
      },
      ({ args }) => handlers.sources(args)),
    "pack-coverage": typed("pack-coverage", "Report scenario-pack coverage across the catalog",
      { out: { type: "string", description: "Write the full report to this path" } },
      ({ args }) => handlers.packCoverage(args)),

    // ── Legacy passthrough (identical behaviour; typed incrementally) ─────────
    init: legacy("init", "Initialize a workspace", handlers.init),
    schema: legacy("schema", "Derive the schema", handlers.schema),
    generate: legacy("generate", "Generate mock data", handlers.generate),
    tools: legacy("tools", "Render app/tools.py and scaffold", handlers.tools),
    test: legacy("test", "Run the workspace smoke tests", handlers.test),
    eval: legacy("eval", "Run evals", handlers.eval),
    "quality-gate": legacy("quality-gate", "Run the quality gate", handlers.qualityGate),
    "harness-review": legacy("harness-review", "Antigravity harness review (read-only)", handlers.harnessReview),
    "harness-refine": legacy("harness-refine", "Antigravity harness refine (write-enabled)", handlers.harnessRefine),
    serve: legacy("serve", "Serve the agent locally (adk web)", handlers.serve),
    "data-plan": legacy("data-plan", "Build the cloud data plan", handlers.dataPlan),
    "source-integration-plan": legacy("source-integration-plan", "Plan source-system integration", handlers.sourceIntegrationPlan),
    "snowfakery-recipe": legacy("snowfakery-recipe", "Emit the Snowfakery recipe", handlers.snowfakeryRecipe),
    mcp: legacy("mcp", "MCP tool-plane operations", handlers.mcp),
    deploy: legacy("deploy", "Deploy the agent (Cloud Run / Agent Runtime)", handlers.deploy),
    "deploy-status": legacy("deploy-status", "Check deploy status", handlers.deployStatus),
    "verify-live": legacy("verify-live", "Verify the deployed agent", handlers.verifyLive),
    register: legacy("register", "Register the agent (Gemini Enterprise / MCP)", handlers.register),
    publish: legacy("publish", "Publish to Gemini Enterprise", handlers.publish),
    reset: legacy("reset", "Reset workspace pipeline state", handlers.reset),
    "plan-data": legacy("plan-data", "Plan mock data generation", handlers.planData),
    "from-usecase": legacy("from-usecase", "Generate a full workspace from a use case", handlers.fromUseCase),
    "batch-audit": legacy("batch-audit", "Audit use-case specs in batch", handlers.batchAudit, false),
  };
}
