// BehavioralGraph → agents-cli grading-dataset emitter.
//
// agents-cli eval grading wants flat prompt/expectation records, not the
// nested ADK invocation shape — so each case flattens to its user turns plus
// the machine-checkable expectations. The array is newline-delimited-friendly
// (each record is self-contained); the file form wraps it as { cases } so a
// single JSON document stays valid too.
import { writeJson } from "@ge/std/json-io";

/** Flatten selected cases into agents-cli grading records. */
export function emitAgentsCliDataset(graph, selectedCases) {
  return selectedCases.map((kase) => ({
    id: kase.id,
    prompt: kase.turns[0]?.user ?? "",
    turns: kase.turns.map((turn) => turn.user),
    expected: kase.expected,
    metadata: { coverage: kase.coverage, intent: kase.intent },
  }));
}

/** Emit and persist as { cases: [...] }; returns { path, caseCount }. */
export function writeAgentsCliDataset(path, graph, selectedCases) {
  const cases = emitAgentsCliDataset(graph, selectedCases);
  writeJson(path, { cases });
  return { path, caseCount: cases.length };
}
