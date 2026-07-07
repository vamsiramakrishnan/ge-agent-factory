// improveSpec loop-control contract, exercised with injected okf-quality deps
// so the convergence/stall/preview logic is tested without a real corpus.
import { describe, expect, test } from "bun:test";
import { improveSpec, statusRank } from "./improve.mjs";

// A fake corpus whose score climbs by `step` each time a patch is applied
// (write only), advancing L0<L2<L3<L4 at score thresholds mirroring
// computeStatus (score<60→L2, <75→L3, else L4).
function fakeDeps({ startScore = 24, step = 20, patchFiles = 4 } = {}) {
  let score = startScore;
  const statusFor = (s) => (s < 60 ? "L2" : s < 75 ? "L3" : "L4");
  const calls = { generate: 0, apply: 0, verify: 0 };
  return {
    calls,
    deps: {
      discoverOkfBundles: async () => ["okf/fake-agent"],
      auditSpec: async () => ({ slug: "fake-agent", currentStatus: statusFor(score), score: { total: score }, gaps: [{ code: "OKF-EVAL-004", message: "no multi-turn" }] }),
      generateEnrichmentPatch: async () => {
        calls.generate += 1;
        return { adds: { files: Array.from({ length: patchFiles }, (_, i) => ({ path: `okf/fake-agent/tests/e${i}.md` })), evals: [{ path: "okf/fake-agent/tests/e0.md" }] } };
      },
      applyEnrichmentPatch: async ({ write }) => {
        calls.apply += 1;
        if (write) score += step; // only a real write moves the corpus
        return { writes: [{ path: "x" }] };
      },
      verifyOkfEvals: async () => {
        calls.verify += 1;
        return { summary: { errors: 0 } };
      },
    },
  };
}

describe("improveSpec", () => {
  test("write loop converges to the target and stops as soon as it is reached", async () => {
    const { deps, calls } = fakeDeps({ startScore: 24, step: 20 }); // 24→44→64→84 (L2→L2→L3→L4)
    const r = await improveSpec({ spec: "fake-agent", write: true, target: "L4", maxIterations: 10, deps });
    expect(r.startStatus).toBe("L2");
    expect(r.endStatus).toBe("L4");
    expect(r.reachedTarget).toBe(true);
    expect(r.converged).toBe(true);
    expect(r.iterations).toHaveLength(3); // stops the moment L4 is reached, not maxIterations
    expect(calls.apply).toBe(3);
  });

  test("write loop stalls (and stops) when a batch stops moving the score", async () => {
    const { deps } = fakeDeps({ startScore: 24, step: 0 }); // never improves
    const r = await improveSpec({ spec: "fake-agent", write: true, target: "L4", maxIterations: 5, deps });
    expect(r.reachedTarget).toBe(false);
    expect(r.stalled).toBe(true);
    expect(r.converged).toBe(true); // stalled counts as converged (can't do more)
    expect(r.iterations).toHaveLength(1); // detected the stall on the first non-moving batch
  });

  test("preview (no --write) generates exactly one batch and never mutates", async () => {
    const { deps, calls } = fakeDeps({ startScore: 24, step: 20 });
    const r = await improveSpec({ spec: "fake-agent", write: false, target: "L4", deps });
    expect(r.dryRun).toBe(true);
    expect(r.iterations).toHaveLength(1);
    expect(r.iterations[0].dryRun).toBe(true);
    expect(r.startScore).toBe(r.endScore); // preview never re-audits a changed corpus
    expect(calls.apply).toBe(1); // apply is called in dry-run mode (write:false → no writes)
    expect(r.next[0]).toContain("--write");
  });

  test("honors maxIterations as the loop cap", async () => {
    const { deps } = fakeDeps({ startScore: 10, step: 5 }); // climbs slowly, never reaches L4 in 2
    const r = await improveSpec({ spec: "fake-agent", write: true, target: "L4", maxIterations: 2, deps });
    expect(r.iterations).toHaveLength(2);
    expect(r.reachedTarget).toBe(false);
  });

  test("surfaces a verifyOkfEvals failure instead of swallowing it", async () => {
    const { deps } = fakeDeps({ startScore: 24, step: 20 });
    deps.verifyOkfEvals = async () => { throw new Error("fixture INV-1 has an unresolvable coverage link"); };
    const r = await improveSpec({ spec: "fake-agent", write: true, target: "L4", maxIterations: 1, deps });
    expect(r.iterations[0].evalVerifyError).toContain("unresolvable coverage link");
  });

  test("rejects an unknown target level and a missing id", async () => {
    const { deps } = fakeDeps();
    await expect(improveSpec({ spec: "x", target: "L9", deps })).rejects.toThrow(/unknown target/);
    await expect(improveSpec({ deps })).rejects.toThrow(/needs an agent/);
  });

  test("statusRank orders the quality levels", () => {
    expect(statusRank("L2")).toBeLessThan(statusRank("L4"));
    expect(statusRank("L9")).toBe(-1);
  });
});
