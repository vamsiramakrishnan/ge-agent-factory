// OKF grounding artifacts for a generated agent workspace. Extracted from cmdTools
// (factory.mjs) verbatim. Two additive, non-fatal outputs:
//
//   app/knowledge/**.md         the agent's spec AS an OKF v0.1 Knowledge Bundle, so
//                               the DEPLOYED agent can read what it answers, how each
//                               query is tested, and its source documents.
//   artifacts/okf-coverage.json the canonical tool name each query/test mechanism
//                               needs, so the Antigravity refine step can verify the
//                               built agent covers every query and test.
//
// Both are grounding, not build gates: a failure leaves okfBundleDir null and never
// aborts generation. Byte output (2-space JSON + trailing newline) is identical to
// the former inline block.

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { writeJson } from "@ge/std/json-io";
import { buildBundle as buildOkfBundle } from "../../spec-to-okf.mjs";
import { renderConcept as renderOkfConcept } from "@ge/okf";
import { deriveAnswerableQueries, deriveTestMechanisms } from "../../lib/okf-capabilities.mjs";
import { canonicalIntentToolName } from "../tools/tool-naming.mjs";

// Write the OKF knowledge bundle + coverage sidecar. Returns the bundle directory
// (or null if there is no contract / the bundle conversion failed).
export async function writeOkfArtifacts({ dir, manifest, behaviorContract, generatedAt }) {
  if (!behaviorContract) return null;

  let okfBundleDir = null;
  try {
    const okfSpec = {
      id: manifest?.id || "generated",
      title: manifest?.useCaseSpec?.title || manifest?.id || "generated",
      subtitle: manifest?.useCaseSpec?.subtitle,
      persona: manifest?.useCaseSpec?.persona,
      department: manifest?.domain,
      kpis: manifest?.useCaseSpec?.kpis || [],
      architecture: manifest?.useCaseSpec?.architecture,
      generationSpec: {
        behaviorContract,
        sourceSystems: manifest?.systems || [],
        entities: manifest?.tables || [],
        documents: manifest?.documents || [],
      },
    };
    const concepts = buildOkfBundle(okfSpec);
    okfBundleDir = join(dir, "app", "knowledge");
    for (const concept of concepts) {
      const abs = join(okfBundleDir, `${concept.relPath}.md`);
      await mkdir(join(abs, ".."), { recursive: true }).catch(() => {});
      await writeFile(abs, renderOkfConcept(concept.fields, concept.body), "utf8");
    }
  } catch (error) {
    // Non-fatal: knowledge bundle is grounding, not a build gate.
    console.warn(`[okf-artifacts] failed to build OKF knowledge bundle: ${error?.message || error}`);
    okfBundleDir = null;
  }

  // OKF coverage sidecar: the canonical tool name each Query Capability and
  // each Eval Scenario's mechanisms require — so the Antigravity refine step
  // can verify the built agent COVERS every query (tools reachable) and that
  // every test's mechanisms are callable. Topology-independent (unlike the
  // agent-workflow sidecar, which only exists for multi-stage agents).
  try {
    const canon = (name) => {
      const intent = (behaviorContract.toolIntents || []).find((i) => i.name === name);
      return intent ? canonicalIntentToolName(intent, manifest?.tables || []) : name;
    };
    const queries = deriveAnswerableQueries(behaviorContract).map((q) => ({
      id: q.id,
      request: q.request,
      stage: q.stage,
      tools: (q.tools || []).map(canon).filter(Boolean),
    }));
    const tests = deriveTestMechanisms(behaviorContract).map((t) => ({
      id: t.id,
      validates: t.validates,
      mechanisms: (t.mechanisms || []).map(canon).filter(Boolean),
    }));
    if (queries.length || tests.length) {
      await mkdir(join(dir, "artifacts"), { recursive: true }).catch(() => {});
      await writeJson(join(dir, "artifacts", "okf-coverage.json"), {
        generatedAt,
        agentId: manifest?.id || "generated",
        queries,
        tests,
      });
    }
  } catch {
    // Non-fatal.
  }

  return okfBundleDir;
}
