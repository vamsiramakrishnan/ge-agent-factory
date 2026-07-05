// `ge evals import` core — bring an external, bring-your-own ADK-compatible
// evalset into .ge/behavioral so it sits alongside compiled suites (same
// directory, same file naming as `ge evals compile`'s <agentId>.evalset.json)
// and is discoverable by `ge evals coverage --id` / `ge prove --live`.
// Validation is entirely evalset.mjs's job — this command never re-implements
// the ADK-shape checks, it only picks an id and a destination.
import { existsSync } from "node:fs";
import { basename } from "node:path";
import { writeJson } from "@ge/std/json-io";
import { DxError } from "../errors/dx-error.mjs";
import { statePath } from "../state-paths.mjs";
import { loadEvalset } from "./evalset.mjs";

// Filename → slug fallback when the source file carries no id of its own —
// same sanitizing rule appendRecordedCase (evalset.mjs) uses for a fresh file.
function slugFromPath(path) {
  const stem = basename(path).replace(/\.evalset\.json$/i, "").replace(/\.json$/i, "");
  const slug = stem.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || "evalset";
}

// The id becomes a filename segment under the behavioral state dir, so it
// must never carry path separators (or anything else outside the slug
// charset slugFromPath produces) — an explicit bad --id is rejected, a bad
// id read from the file itself is re-slugged instead of trusted.
const ID_SHAPE = /^[a-zA-Z0-9_-]+$/;

// `out` is injectable so tests (and callers with their own state root) never
// depend on the module-load-time GE_STATE_ROOT resolution in state-paths.
export function importEvalset({ evalset, id, out, force = false } = {}) {
  if (!evalset) {
    throw new DxError("no evalset path given", {
      where: "ge evals import",
      why: "importing needs a source file to bring in",
      fix: "ge evals import --evalset <path-to-adk-evalset.json>",
    });
  }
  // loadEvalset both reads and validates (existsSync + JSON parse + ADK-shape
  // checks) — any failure throws the same four-field DxError callers of
  // evalset.mjs already get from `ge drive --record`; let it propagate.
  const normalized = loadEvalset(evalset);
  if (id !== undefined && !ID_SHAPE.test(String(id))) {
    throw new DxError(`invalid evalset id '${id}'`, {
      where: "ge evals import --id",
      why: "the id becomes a filename under .ge/behavioral, so it may only contain letters, digits, '_' and '-'",
      fix: "pass an id matching [a-zA-Z0-9_-]+ (or omit --id to derive one)",
    });
  }
  const hasOwnId = normalized.raw?.evalSetId !== undefined || normalized.raw?.eval_set_id !== undefined || normalized.raw?.id !== undefined;
  const derived = hasOwnId ? String(normalized.id) : slugFromPath(evalset);
  // A file-carried id is untrusted input the same way the filename is —
  // re-slug it rather than letting it name an arbitrary path.
  const resolvedId = id || (ID_SHAPE.test(derived) ? derived : slugFromPath(`${derived}.json`));
  const dir = out || statePath("behavioral");
  const outPath = `${dir}/${resolvedId}.evalset.json`;
  if (!force && existsSync(outPath)) {
    throw new DxError(`an evalset already exists at ${outPath}`, {
      where: "ge evals import",
      why: "importing would overwrite it (it may be a compiled suite from `ge evals compile`)",
      fix: `ge evals import --evalset ${evalset} --id <different-id> (or --force to overwrite)`,
    });
  }
  // Write the raw ADK JSON as loaded, not our internal { id, cases, turns }
  // wrapper — the on-disk contract is the ADK evalset itself (evalset.mjs's
  // round-trip-safe design: GE only ever appends/imports, never reshapes).
  writeJson(outPath, normalized.raw);
  const turns = normalized.cases.reduce((sum, kase) => sum + kase.turns.length, 0);
  return { id: resolvedId, out: outPath, cases: normalized.cases.length, turns, source: evalset };
}
