// Re-export shim: the docs site's single, build-time window onto the operator
// command registry — the sanctioned cross-surface contract that already backs
// the CLI, the console routes, and the MCP server. Same seam the console uses
// (apps/console/src/shared/ge-commands.mjs). Components import from here, so
// tools/check-app-import-surface.mjs sees exactly one apps/docs -> tools/lib
// pair; documentation rendered from GE_COMMANDS (see CommandCard.astro) can
// never drift from what the commands actually do.
export { GE_COMMANDS, commandMeta } from "../../../../tools/lib/ge-command-registry.mjs";
