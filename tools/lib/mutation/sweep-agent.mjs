// Mutation-sweep a real shipped OKF agent.
//
// Compiles an agent's OKF bundle to its behavioral evalset (the same suite
// `ge evals compile` / the proof gate use), then for every case that declares
// a behavioral expectation it synthesizes a compliant green cassette and runs
// the per-case mutation sweep. The aggregate answers, for a real agent:
//   • which cases have ornamental guards (a mutant survives the proof), and
//   • which behaviors the suite never guards at all (coverage gaps).
//
// Cassettes are synthesized to satisfy each case's own declared expectations,
// so the baseline is green by construction and every kill/survival is
// attributable to the mutation, not to baseline noise.
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";
import { writeJson } from "@ge/std/json-io";
// Relative package path for @ge/okf, matching tools/lib/okf-lifecycle.mjs —
// the repo-root workspace does not list @ge/okf as a dependency and tools/*
// is not its own package. @ge/evalkit resolves as an alias (see prove-live).
import { compileOkfBundle } from "../../../packages/okf/src/compile/index.mjs";
import { compileBehavioralSuite } from "@ge/evalkit/compiler";
import { emitAdkEvalset } from "@ge/evalkit/emitters";
import { runEvalMutants } from "./harness.mjs";
import { synthesizeCassetteRecords, syntheticTarget } from "./synthesize-cassette.mjs";
import { toNdjson } from "./cassette-mutations.mjs";

function hasGuards(expected = {}) {
  return Boolean((expected.mustCall || []).length || (expected.mustNotCall || []).length || (expected.mustCite || []).length);
}

export function collectCitationIdentityGaps(cases) {
  return cases.flatMap((entry) =>
    (entry.gaps || [])
      .filter((gap) => gap.guard === "mustCiteIdentity")
      .map((gap) => ({ caseId: entry.caseId, ...gap })),
  );
}

// Compile the bundle to its ADK evalset. Returns { agentId, evalset, errors }.
export async function compileAgentEvalset(bundleDir) {
  const { spec, errors } = await compileOkfBundle(bundleDir);
  const agentId = basename(bundleDir);
  const envelope = { id: agentId, title: spec.behaviorContract?.title || agentId, generationSpec: spec.generationSpec };
  const { graph, selection } = compileBehavioralSuite(envelope);
  const evalset = emitAdkEvalset(graph, selection.selected, { evalSetId: agentId });
  return { agentId, evalset, errors: errors || [] };
}

// Sweep one bundle. `proveLiveImpl` is injectable for tests.
export async function sweepAgentBundle(bundleDir, { proveLiveImpl } = {}) {
  const { agentId, evalset, errors } = await compileAgentEvalset(bundleDir);
  // A partial spec would yield a misleadingly-green sweep. Structured OKF
  // compile errors are fatal here, as they are on every other OKF surface.
  if (errors.length) {
    return {
      agentId,
      bundleDir,
      ok: false,
      compileErrors: errors,
      coverage: null,
      cases: [],
      ornamentalCases: [],
      noGuard: [],
      citationIdentityGaps: [],
      totals: { generated: 0, killed: 0, survived: 0 },
      ornamental: false,
      partialCoverage: false,
    };
  }
  const target = syntheticTarget(agentId);
  const work = mkdtempSync(join(tmpdir(), "ge-agent-sweep-"));
  try {
    const cases = [];
    const noGuard = [];
    for (const kase of evalset.evalCases) {
      const expected = kase.geMetadata?.expected || {};
      if (!hasGuards(expected)) {
        noGuard.push(kase.evalId);
        continue;
      }
      const turns = kase.conversation.map((invocation) => ({
        user: (invocation.userContent?.parts || []).map((part) => part.text).join(" "),
      }));
      const records = synthesizeCassetteRecords(turns, expected, { target, agentId: `agent-${agentId}` });
      const evalsetPath = join(work, `${kase.evalId}.evalset.json`);
      const cassettePath = join(work, `${kase.evalId}.ndjson`);
      writeJson(evalsetPath, { evalSetId: kase.evalId, evalCases: [kase] });
      writeFileSync(cassettePath, toNdjson(records));
      const result = await runEvalMutants({ evalset: evalsetPath, cassette: cassettePath }, { proveLiveImpl });
      cases.push({
        caseId: kase.evalId,
        expected,
        generated: result.score.generated,
        killed: result.score.killed,
        survived: result.survived.map((m) => ({ id: m.id, guard: m.guard })),
        gaps: result.gaps,
        ornamental: result.ornamental,
      });
    }

    const ornamentalCases = cases.filter((entry) => entry.ornamental);
    const citationIdentityGaps = collectCitationIdentityGaps(cases);
    const totals = cases.reduce(
      (acc, entry) => ({ generated: acc.generated + entry.generated, killed: acc.killed + entry.killed, survived: acc.survived + entry.survived.length }),
      { generated: 0, killed: 0, survived: 0 },
    );

    // Suite-level coverage: what fraction of cases guard each behavior at all.
    const total = evalset.evalCases.length;
    const declares = (key) => evalset.evalCases.filter((kase) => (kase.geMetadata?.expected?.[key] || []).length).length;
    const coverage = {
      totalCases: total,
      guardedCases: cases.length,
      unguardedCases: noGuard.length,
      mustCall: declares("mustCall"),
      mustNotCall: declares("mustNotCall"),
      mustCite: declares("mustCite"),
    };

    return {
      agentId,
      bundleDir,
      ok: true,
      compileErrors: errors,
      coverage,
      cases,
      ornamentalCases,
      noGuard,
      citationIdentityGaps,
      totals,
      ornamental: ornamentalCases.length > 0,
      partialCoverage: citationIdentityGaps.length > 0,
    };
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}
