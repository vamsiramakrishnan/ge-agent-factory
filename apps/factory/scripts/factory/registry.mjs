import { defineCommand } from "citty";

// citty-based command registry for the factory CLI (Week-4 / PR-B). Each command
// is a citty `defineCommand` with typed args + auto `--help`, replacing the
// hand-rolled parseArgs + switch incrementally. Handlers are INJECTED (not
// imported) so this module has no dependency back on factory.mjs — no import
// cycle. New/department commands register by adding a spec here.
//
// Migration is incremental: main() runs any command present in this tree via
// citty and falls back to the legacy switch for commands not yet converted.
export function buildFactoryCommandTree({ resolveDir, handlers }) {
  const cmd = (name, description, args, run) =>
    defineCommand({ meta: { name, description }, args, run });

  return {
    status: cmd(
      "status",
      "Status board for a generated workspace",
      { dir: { type: "string", description: "Workspace directory", default: "." } },
      ({ args }) => handlers.status(resolveDir(args.dir)),
    ),
    "list-usecases": cmd(
      "list-usecases",
      "List use cases in the catalog",
      {
        department: { type: "string", description: "Filter by department" },
        search: { type: "string", description: "Filter by search term" },
        limit: { type: "string", description: "Max results" },
        json: { type: "boolean", description: "Emit JSON" },
      },
      ({ args }) => handlers.listUsecases(args),
    ),
    "promotion-gate": cmd(
      "promotion-gate",
      "Evaluate the promotion gate (blocks deploy on failure)",
      {
        dir: { type: "string", description: "Workspace directory", default: "." },
        force: { type: "boolean", description: "Override blockers" },
      },
      ({ args }) => handlers.promotionGate(resolveDir(args.dir), args),
    ),
  };
}
