// @ge/okf compile — structured compile errors.
//
// The compiler NEVER silently drops a malformed concept: every problem becomes
// a structured `{ code, conceptPath, message, fix }` entry in the compile
// result's `errors` array. Callers that need to fail hard (the `ge okf
// compile` CLI) aggregate them into a DxError via `toDxError` so the standard
// what/where/why/fix renderer applies.

import { DxError } from "@ge/std/dx-error";

/** Every code the compiler can emit; keep this list exhaustive and stable. */
export const COMPILE_ERROR_CODES = Object.freeze({
  UNKNOWN_CONCEPT_TYPE: "OKF_UNKNOWN_CONCEPT_TYPE",
  INVALID_FIELD: "OKF_INVALID_FIELD",
  GROUNDING_EMPTY: "OKF_GROUNDING_EMPTY",
  GROUNDING_UNDECLARED_SYSTEM: "OKF_GROUNDING_UNDECLARED_SYSTEM",
  GROUNDING_UNKNOWN_TOOL: "OKF_GROUNDING_UNKNOWN_TOOL",
  TOOL_CONTRACT_UNKNOWN_TOOL: "OKF_TOOL_CONTRACT_UNKNOWN_TOOL",
  ERROR_PATH_UNKNOWN_TOOL: "OKF_ERROR_PATH_UNKNOWN_TOOL",
  CAPABILITY_UNKNOWN_SYSTEM: "OKF_CAPABILITY_UNKNOWN_SYSTEM",
  POLICY_UNKNOWN_ENTITY: "OKF_POLICY_UNKNOWN_ENTITY",
  BINDING_UNKNOWN_SYSTEM: "OKF_BINDING_UNKNOWN_SYSTEM",
  WORKFLOW_OVERRIDE_UNKNOWN_STEP: "OKF_WORKFLOW_OVERRIDE_UNKNOWN_STEP",
  VARIANT_BASE_MISSING: "OKF_VARIANT_BASE_MISSING",
  VARIANT_CYCLE: "OKF_VARIANT_CYCLE",
  SPEC_SCHEMA: "OKF_SPEC_SCHEMA",
});

/** Build one structured compile error. `fix` is required by policy (Elm rule). */
export function compileError(code, conceptPath, message, fix) {
  return {
    code,
    conceptPath: conceptPath || null,
    message,
    fix: fix || "run `ge okf audit <bundle>` for the full diagnosis",
  };
}

/**
 * Aggregate structured compile errors into one throwable DxError. The
 * individual errors ride along on `.errors` so JSON renderers can show all of
 * them, while the DxError fields summarize for the human renderer.
 */
export function toDxError(errors, bundlePath) {
  const first = errors[0];
  const err = new DxError(
    `OKF compile failed with ${errors.length} error${errors.length === 1 ? "" : "s"} (first: ${first.code})`,
    {
      where: first.conceptPath ? `${bundlePath}/${first.conceptPath}` : bundlePath,
      why: errors
        .slice(0, 5)
        .map((e) => `${e.code}${e.conceptPath ? ` at ${e.conceptPath}` : ""}: ${e.message}`)
        .join("; "),
      fix: first.fix,
    },
  );
  err.errors = errors;
  return err;
}
