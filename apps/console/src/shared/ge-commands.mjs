// Re-export shim: the console's single window onto the operator command
// registry (@ge/capability-registry — the sanctioned cross-surface contract
// that also backs the CLI, the MCP server, and the docs site). Console code
// imports from here, so the seam stays one file wide.
export {
  GE_COMMANDS,
  GE_COMMAND_LIST,
  commandForRoute,
  commandIds,
  commandMeta,
  commandRequirements,
} from "@ge/capability-registry";
