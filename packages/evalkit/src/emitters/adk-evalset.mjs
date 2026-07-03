// BehavioralGraph → ADK evalset emitter.
//
// Emits the same on-disk shape tools/lib/evals/evalset.mjs normalizes: ADK
// camelCase (evalSetId/evalCases/userContent), one invocation per user turn.
// GE-owned context (capability/persona/world/coverage/expected) rides in a
// geMetadata sidecar per case — an unknown field to ADK, which its loaders
// and our round-trip policy preserve untouched.
import { writeJson } from "@ge/std/json-io";

/** Emit an ADK-shaped evalset object for the selected cases. */
export function emitAdkEvalset(graph, selectedCases, { evalSetId } = {}) {
  const id = evalSetId || `${graph.subject.agentId}-behavioral`;
  return {
    evalSetId: id,
    name: `${graph.subject.title} — compiled behavioral suite`,
    evalCases: selectedCases.map((kase) => ({
      evalId: kase.id,
      conversation: kase.turns.map((turn, index) => ({
        invocationId: `${kase.id}-${index}`,
        userContent: { role: "user", parts: [{ text: turn.user }] },
      })),
      geMetadata: {
        capabilityId: kase.capabilityId,
        personaId: kase.personaId,
        worldId: kase.worldId,
        intent: kase.intent,
        coverage: kase.coverage,
        expected: kase.expected,
      },
    })),
  };
}

/** Emit and persist; returns { path, evalSetId, caseCount }. */
export function writeAdkEvalset(path, graph, selectedCases, options = {}) {
  const evalset = emitAdkEvalset(graph, selectedCases, options);
  writeJson(path, evalset);
  return { path, evalSetId: evalset.evalSetId, caseCount: evalset.evalCases.length };
}
