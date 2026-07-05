// `ge evals coverage` core — read the coverage.json a prior `ge evals compile`
// wrote and add the derived view every caller (CLI, console, MCP) otherwise
// re-walks by hand: per-dimension totals, overall counts, and a flat gap list.
// Pure read-only — never writes, never compiles.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DxError } from "../errors/dx-error.mjs";
import { statePath, relativeToRepo } from "../state-paths.mjs";
import { loadEvalset } from "./evalset.mjs";

// `dir` is injectable so tests (and callers with their own state root) never
// depend on the module-load-time GE_STATE_ROOT resolution in state-paths.
export function evalsCoverage({ id, dir = statePath("behavioral") } = {}) {
  const coveragePath = join(dir, "coverage.json");
  if (!existsSync(coveragePath)) {
    throw new DxError(`coverage report not found: ${coveragePath}`, {
      where: coveragePath,
      why: "no compiled behavioral suite exists yet (ge evals compile writes coverage.json)",
      fix: "ge evals compile",
    });
  }
  const coverage = JSON.parse(readFileSync(coveragePath, "utf8"));
  const dimensions = coverage.dimensions || {};
  const perDimension = {};
  const totals = { required: 0, covered: 0, gaps: 0 };
  const gaps = [];
  for (const [dimension, entry] of Object.entries(dimensions)) {
    const required = entry.required?.length || 0;
    const covered = entry.covered?.length || 0;
    const gapCount = entry.gaps?.length || 0;
    perDimension[dimension] = { required, covered, gapCount };
    totals.required += required;
    totals.covered += covered;
    totals.gaps += gapCount;
    for (const gap of entry.gaps || []) gaps.push({ dimension, gap });
  }

  let evalset;
  if (id) {
    // Same id-shape rule as importEvalset: the id is a filename segment, so
    // path separators (or any other non-slug character) never reach join().
    if (!/^[a-zA-Z0-9_-]+$/.test(String(id))) {
      throw new DxError(`invalid evalset id '${id}'`, {
        where: "ge evals coverage --id",
        why: "the id names a file under .ge/behavioral, so it may only contain letters, digits, '_' and '-'",
        fix: "pass an id matching [a-zA-Z0-9_-]+",
      });
    }
    const evalsetPath = join(dir, `${id}.evalset.json`);
    if (!existsSync(evalsetPath)) {
      throw new DxError(`no evalset artifact for id: ${id}`, {
        where: evalsetPath,
        why: `neither a compiled nor imported evalset named "${id}" exists in ${relativeToRepo(dir)}`,
        fix: `ge evals compile --id ${id}   (or ge evals import --evalset <path> --id ${id})`,
      });
    }
    const loaded = loadEvalset(evalsetPath);
    evalset = { path: relativeToRepo(evalsetPath), cases: loaded.cases.length };
  }

  return {
    ...coverage,
    summary: { dimensions: perDimension, totals, gaps },
    ...(evalset ? { evalset } : {}),
  };
}
