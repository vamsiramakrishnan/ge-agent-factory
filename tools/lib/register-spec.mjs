// register-spec — invoke scripts/register-agent-spec.mjs and (optionally)
// resync the generated catalog (`ge spec register`). Verbatim extraction from
// factory-core.mjs (see AGENTS.md / REFACTOR-HANDOFF.md §9 methodology: verbatim
// move, dependency injection where needed, re-export from factory-core.mjs to
// preserve its public API contract). `run` and the two directories are injected
// the same way factory-core wires them into the plane modules.

import { existsSync } from "node:fs";
import { resolve } from "node:path";

export async function registerSpecWith({ run, repoRoot, genDir }, { input, allowDraft = false, syncCatalog = true } = {}) {
  if (!input) throw new Error("missing spec input path");
  const inputPath = resolve(repoRoot, input);
  if (!existsSync(inputPath)) throw new Error(`spec not found: ${inputPath}`);
  const args = ["scripts/register-agent-spec.mjs", "--input", inputPath];
  if (allowDraft) args.push("--allow-draft", "true");
  const registered = run("node", args, { cwd: genDir, allowFail: true });
  if (!registered.ok) throw new Error((registered.err || registered.out || "spec registration failed").trim());
  let result = {};
  try { result = JSON.parse(registered.out); } catch {}
  let sync = null;
  if (syncCatalog) {
    sync = run("node", ["scripts/sync-use-cases-from-slides.mjs"], { cwd: genDir, allowFail: true });
    if (!sync.ok) throw new Error((sync.err || sync.out || "spec registered but catalog sync failed").trim());
  }
  return {
    ok: true,
    ...result,
    input: inputPath,
    catalog: {
      synced: Boolean(syncCatalog),
      stdout: sync?.out || "",
      note: syncCatalog ? "generated catalog synced" : "generated catalog sync skipped; interview registry is available immediately",
    },
  };
}
