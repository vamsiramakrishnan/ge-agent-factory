// Registry-derived CLI strings for console actions ("the console teaches the
// CLI"). Every suggested `ge …` invocation next to a registry-backed button
// must DERIVE from the command registry's `cli` field (served by
// GET /api/ge/commands, i.e. tools/lib/ge-command-registry.mjs) — never a
// hardcoded literal in a view. These pure lookups keep that derivation
// testable without React.
import type { GeCommand } from "../services/geClient";

/** Resolve a registry command id (e.g. "agents.build") to its `cli` string. */
export function cliForCommand(
  commands: ReadonlyArray<Pick<GeCommand, "id" | "cli">> | null | undefined,
  id: string,
): string | null {
  const command = (commands || []).find((c) => c.id === id);
  return command?.cli || null;
}

/** Resolve a console route (e.g. POST /api/ge/handoff) to its `cli` string. */
export function cliForRoute(
  commands: ReadonlyArray<Pick<GeCommand, "method" | "path" | "cli">> | null | undefined,
  method: string,
  path: string,
): string | null {
  const command = (commands || []).find((c) => c.method === method && c.path === path);
  return command?.cli || null;
}
