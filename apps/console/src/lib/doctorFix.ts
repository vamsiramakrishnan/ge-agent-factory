import { ge, startJob } from "../services/geClient";
import type { RunFollowMeta } from "../state/runFollow";

// A resolved, runnable doctor fix: a human label + the thunk that kicks off the
// underlying ge.* mutating call. Doctor/DoctorReport turn this into a Run button
// (and fall back to Copy-only when resolveFix returns null).
export interface ResolvedFix {
  label: string;
  run: () => Promise<any>;
}

// Map a doctor fix / repair-plan command STRING onto a runnable ge.* action.
// Tolerant of a leading "ge ", surrounding whitespace, and trailing flags so the
// same matcher handles both the terse repairPlan commands and the chattier check
// fixes. Returns null for anything we can't safely run (→ Copy-only in the UI).
export function resolveFix(command: string): ResolvedFix | null {
  if (!command || typeof command !== "string") return null;
  const raw = command.trim();
  // Doctor emits the dotted command vocabulary (`agents.build.local`,
  // `agents.ship`) while check fixes are the spaced CLI form (`ge agents build
  // --local`). Normalize dots to spaces so the same matcher handles both — but
  // detect the local target on the *raw* string so `.local` is recognized too.
  const lower = raw.toLowerCase();
  const normalized = lower.replace(/\./g, " ").replace(/\s+/g, " ").trim();
  // local is signalled by `--local`, `.local`, or a standalone ` local` word.
  const local = /(^|[.\s-])local\b/.test(lower);

  if (normalized.includes("data up")) {
    return { label: "ge data up", run: () => ge.dataUp() };
  }
  if (normalized.includes("mcp deploy")) {
    return { label: "ge mcp deploy", run: () => ge.mcpDeploy() };
  }
  if (normalized.includes("agents build")) {
    return {
      label: local ? "ge agents build --local" : "ge agents build",
      run: () => ge.build({ local }),
    };
  }
  if (normalized.includes("agents ship")) {
    return { label: "ge agents ship", run: () => ge.ship({}) };
  }
  if (normalized.includes("agents sync")) {
    return { label: "ge agents sync", run: () => ge.sync({}) };
  }
  // Bare `ge up` (with or without the leading "ge", and tolerating flags) but NOT
  // the more specific "data up" handled above.
  if (/(^|\s)(ge\s+)?up(\s|$)/.test(normalized)) {
    return { label: "ge up", run: () => ge.up() };
  }
  return null;
}

// Resolve a command string, start it as a background job, and open the live Run
// Drawer on it. No-op-safe: unresolvable commands return null without throwing,
// and a job that yields no id simply isn't followed. Returns the job id (or null).
export async function runFix(
  command: string,
  follow: (id: string, meta?: RunFollowMeta) => void,
): Promise<string | null> {
  const resolved = resolveFix(command);
  if (!resolved) return null;
  const id = await startJob(resolved.label, resolved.run());
  if (id) follow(id, { kind: "fix", source: resolved.label });
  return id;
}
