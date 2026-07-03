// The factory's binding of @ge/evalkit's eval-artifact renderers.
//
// The renderers themselves live in packages/evalkit (src/emitters/) — pure
// functions, byte-identical output to the formerly in-app family. What CANNOT
// live there is the generator's own naming/derivation spine:
// contract-schema.mjs, tool-naming.mjs, and lib/okf-capabilities.mjs are
// imported all over the factory (tools.py emission, sub-agent wiring, OKF
// artifacts), and a leaf package must never import apps/*. So this module is
// the seam: it injects those helpers into renderAgentsCliEvalSet and
// re-exports the rest untouched, keeping factory.mjs's call sites unchanged.
import { renderAgentsCliEvalSet as renderAgentsCliEvalSetPure } from "@ge/evalkit/emitters";
import { CONTRACT_TOOL_KINDS, inferEvalToolArgs } from "../core/contract-schema.mjs";
import { deriveTestMechanisms } from "../../lib/okf-capabilities.mjs";
import { canonicalExpectedToolCallName, canonicalIntentToolName, tableToolName } from "../tools/tool-naming.mjs";

export { renderGoldenEvals, renderEvalConfig, renderOptimizationConfig } from "@ge/evalkit/emitters";

/** renderAgentsCliEvalSet with the factory's canonical naming/derivation bound in. */
export function renderAgentsCliEvalSet(contract, manifest) {
  return renderAgentsCliEvalSetPure(contract, manifest, {
    contractToolKinds: CONTRACT_TOOL_KINDS,
    inferEvalToolArgs,
    deriveTestMechanisms,
    canonicalExpectedToolCallName,
    canonicalIntentToolName,
    tableToolName,
  });
}
