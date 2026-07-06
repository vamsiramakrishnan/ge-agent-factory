// tools/lib/improve.mjs — `ge improve`: the self-improvement loop.
//
// Closes the synth→spec→evals→audit→tweak cycle around one agent's OKF
// blueprint, deterministically and offline. Each iteration:
//   1. audit the spec (deterministic L0–L5 quality score + gap list)
//   2. generate an enrichment patch toward the target level (new fixture-backed
//      evals for the uncovered obligations — never fabricated tools/systems)
//   3. apply it (writes evals/fixtures into the OKF corpus)
//   4. verify the evals statically
//   5. re-audit — if the score moved forward, loop; if it stalled or the target
//      level is reached, stop.
//
// This is the tractable, convergent half of self-improvement — spec + evals —
// built entirely on tested okf-quality machinery, so it runs in CI with no
// model calls. The runtime half (build the agent, judge it live, feed failing
// cases back) is surfaced as the `next` step: once the blueprint converges,
// `ge agents build` + `ge prove`/`factory harness-judge` validate it for real.
//
// Dependency-injected (deps) so the loop logic is unit-testable without a real
// corpus; return/throw, no printing (the command renders).

import { DxError } from "./errors/dx-error.mjs";
import {
  auditSpec as auditSpecImpl,
  discoverOkfBundles as discoverOkfBundlesImpl,
  generateEnrichmentPatch as generateEnrichmentPatchImpl,
  applyEnrichmentPatch as applyEnrichmentPatchImpl,
  verifyOkfEvals as verifyOkfEvalsImpl,
} from "./okf-quality.mjs";

export const STATUS_ORDER = ["L0", "L1", "L2", "L3", "L4", "L5"];
export const statusRank = (status) => STATUS_ORDER.indexOf(status);

const DEFAULT_DEPS = {
  auditSpec: auditSpecImpl,
  discoverOkfBundles: discoverOkfBundlesImpl,
  generateEnrichmentPatch: generateEnrichmentPatchImpl,
  applyEnrichmentPatch: applyEnrichmentPatchImpl,
  verifyOkfEvals: verifyOkfEvalsImpl,
};

/**
 * Run the improvement loop for one spec.
 *
 * @param {object} opts
 * @param {string} opts.spec        - agent/spec id (or bundle dir) under the OKF root
 * @param {string} [opts.root]      - OKF corpus root (default "okf")
 * @param {string} [opts.target]    - target quality level (default "L4")
 * @param {number} [opts.maxIterations] - loop cap when writing (default 5)
 * @param {boolean} [opts.write]    - actually enrich the corpus; false = preview one batch
 * @param {number} [opts.maxEvalsPerIteration] - obligations to add per iteration (default 5)
 * @param {object} [opts.deps]      - injectable okf-quality functions (tests)
 */
export async function improveSpec({
  spec,
  root = "okf",
  target = "L4",
  maxIterations = 5,
  write = false,
  maxEvalsPerIteration = 5,
  deps = {},
} = {}) {
  const { auditSpec, discoverOkfBundles, generateEnrichmentPatch, applyEnrichmentPatch, verifyOkfEvals } = { ...DEFAULT_DEPS, ...deps };
  if (!spec) {
    throw new DxError("ge improve needs an agent/spec id", {
      where: "--id",
      why: "the loop enriches one blueprint's evals toward a target quality level",
      fix: "ge improve --id <agent-id>",
    });
  }
  if (statusRank(target) < 0) {
    throw new DxError(`unknown target level "${target}"`, {
      where: "--target",
      why: `quality levels are ${STATUS_ORDER.join(" < ")}`,
      fix: "ge improve --id <agent-id> --target L4",
    });
  }

  const [dir] = await discoverOkfBundles({ root, spec });
  if (!dir) {
    throw new DxError(`no OKF bundle found for "${spec}" under ${root}/`, {
      where: `${root}/${spec}`,
      why: "improve operates on a compiled OKF blueprint",
      fix: `ge okf compile --from spec --spec <path> --out ${root}/${spec}`,
    });
  }

  let report = await auditSpec(dir);
  const startStatus = report.currentStatus;
  const startScore = report.score.total;
  const iterations = [];
  let stalled = false;

  const runOnce = async () => {
    const scoreBefore = report.score.total;
    let patch;
    try {
      patch = await generateEnrichmentPatch({ spec, root, target, maxEvals: maxEvalsPerIteration });
    } catch (error) {
      return { n: iterations.length + 1, generated: 0, applied: 0, scoreBefore, scoreAfter: scoreBefore, statusAfter: report.currentStatus, note: `no patch: ${error.message}`, stop: true };
    }
    const files = patch?.adds?.files || [];
    if (!files.length) {
      return { n: iterations.length + 1, generated: 0, applied: 0, scoreBefore, scoreAfter: scoreBefore, statusAfter: report.currentStatus, note: "no further obligations to add", stop: true };
    }
    const applied = await applyEnrichmentPatch({ patch, write, root, force: true });
    let evalErrors = null;
    try {
      const verify = await verifyOkfEvals({ spec, root });
      evalErrors = verify?.summary?.errors ?? null;
    } catch {
      evalErrors = null; // static verify is informational; a failure here never blocks the loop
    }
    // Only a real write changes the corpus, so only then does re-auditing move.
    if (write) report = await auditSpec(dir);
    const scoreAfter = report.score.total;
    return {
      n: iterations.length + 1,
      generated: files.length,
      applied: write ? applied.writes.length : 0,
      dryRun: !write,
      scoreBefore,
      scoreAfter,
      statusAfter: report.currentStatus,
      evalErrors,
      addedEvals: (patch.adds.evals || []).map((entry) => entry.path),
      // Stop the write loop when a batch fails to move the score forward.
      stop: write ? scoreAfter <= scoreBefore : true,
    };
  };

  const cap = write ? Math.max(1, maxIterations) : 1;
  while (iterations.length < cap && statusRank(report.currentStatus) < statusRank(target)) {
    const iteration = await runOnce();
    const { stop, ...record } = iteration;
    iterations.push(record);
    if (stop) {
      // A write run that stopped without reaching the target is stalled.
      if (write && statusRank(report.currentStatus) < statusRank(target)) stalled = true;
      break;
    }
  }

  const reachedTarget = statusRank(report.currentStatus) >= statusRank(target);
  return {
    kind: "ge.improve.result",
    specId: report.slug,
    target,
    dryRun: !write,
    startStatus,
    startScore,
    endStatus: report.currentStatus,
    endScore: report.score.total,
    reachedTarget,
    stalled,
    converged: reachedTarget || stalled,
    iterations,
    remainingGaps: (report.gaps || []).slice(0, 20),
    // The runtime half of the loop — build + judge the converged blueprint —
    // is where spec quality meets real behavior.
    next: reachedTarget
      ? [`ge agents build --ids ${report.slug} --local`, `ge prove --spec ${report.slug} --local`]
      : write
        ? [`ge okf quality audit --spec ${report.slug}`, `ge improve --id ${report.slug} --write --target ${target}`]
        : [`ge improve --id ${report.slug} --write --target ${target}`],
  };
}
