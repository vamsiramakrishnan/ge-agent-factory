import { describe, expect, test } from "bun:test";
import { describeGap } from "./spec-gaps.mjs";

describe("describeGap", () => {
  // ── exact-match codes from agent-spec-registry.js validateGenerationSpec() ──
  test("missing_generation_spec", () => {
    const result = describeGap("missing_generation_spec");
    expect(result.code).toBe("missing_generation_spec");
    expect(result.message).toMatch(/generation spec/i);
    expect(result.severity).toBe("error");
  });

  test("missing_source_systems", () => {
    const result = describeGap("missing_source_systems");
    expect(result.message).toMatch(/source systems/i);
    expect(result.message).not.toBe("missing_source_systems");
  });

  test("missing_row_policy", () => {
    const result = describeGap("missing_row_policy");
    expect(result.message).toMatch(/row policy/i);
  });

  test("behavior_missing_evidence_requirements (real message, not fallback)", () => {
    const result = describeGap("behavior_missing_evidence_requirements");
    expect(result.message).toMatch(/evidence requirements/i);
    expect(result.severity).toBe("error");
  });

  test("behavior_tool_intents_thin", () => {
    const result = describeGap("behavior_tool_intents_thin");
    expect(result.message).toMatch(/tool intents/i);
    expect(result.severity).toBe("warning");
  });

  test("validation_assertions_thin", () => {
    const result = describeGap("validation_assertions_thin");
    expect(result.message).toMatch(/assertion/i);
  });

  // ── behavior_missing_${field} dynamic-suffix family ──
  test("behavior_missing_role interpolates the field label", () => {
    const result = describeGap("behavior_missing_role");
    expect(result.message).toMatch(/role/i);
    expect(result.message).not.toBe("behavior_missing_role");
  });

  test("behavior_missing_primaryObjective interpolates a readable label", () => {
    const result = describeGap("behavior_missing_primaryObjective");
    expect(result.message).toMatch(/primary objective/i);
  });

  test("behavior_missing_goldenEvals interpolates a readable label", () => {
    const result = describeGap("behavior_missing_goldenEvals");
    expect(result.message).toMatch(/golden evals/i);
  });

  // ── validateCatalogParity() codes ──
  test("missing_subtitle", () => {
    const result = describeGap("missing_subtitle");
    expect(result.message).toMatch(/subtitle/i);
  });

  test("kpis_thin", () => {
    const result = describeGap("kpis_thin");
    expect(result.message).toMatch(/kpi/i);
  });

  test("kpi_missing_before_after:1 interpolates the index suffix", () => {
    const result = describeGap("kpi_missing_before_after:1");
    expect(result.code).toBe("kpi_missing_before_after:1");
    expect(result.message).toMatch(/KPI #1/);
  });

  // ── colon-suffixed templated codes ──
  test("entity_missing_pk:orders interpolates the entity name", () => {
    const result = describeGap("entity_missing_pk:orders");
    expect(result.message).toMatch(/orders/);
    expect(result.message).toMatch(/primary key/i);
  });

  test("entity_unknown_source_system:orders interpolates the entity name", () => {
    const result = describeGap("entity_unknown_source_system:orders");
    expect(result.message).toMatch(/orders/);
    expect(result.message).toMatch(/source system/i);
  });

  test("source_system_missing_name:sap interpolates the system id", () => {
    const result = describeGap("source_system_missing_name:sap");
    expect(result.message).toMatch(/sap/i);
    expect(result.message).toMatch(/display name/i);
  });

  test("tool_intent_missing_kind:query_orders interpolates the tool name", () => {
    const result = describeGap("tool_intent_missing_kind:query_orders");
    expect(result.message).toMatch(/query_orders/);
    expect(result.message).toMatch(/kind/i);
  });

  test("document_missing_title:doc-1 interpolates the doc id", () => {
    const result = describeGap("document_missing_title:doc-1");
    expect(result.message).toMatch(/doc-1/);
    expect(result.message).toMatch(/title/i);
  });

  test("api_missing_method:get-orders interpolates the api id", () => {
    const result = describeGap("api_missing_method:get-orders");
    expect(result.message).toMatch(/get-orders/);
    expect(result.message).toMatch(/HTTP method/i);
  });

  test("anomaly_missing_description:anom-1 interpolates the anomaly id", () => {
    const result = describeGap("anomaly_missing_description:anom-1");
    expect(result.message).toMatch(/anom-1/);
    expect(result.message).toMatch(/description/i);
  });

  // ── audit-usecase-specs.mjs-only codes ──
  test("missing_explicit_generation_spec", () => {
    const result = describeGap("missing_explicit_generation_spec");
    expect(result.message).toMatch(/explicit generation spec/i);
  });

  test("missing_action_or_api_intents", () => {
    const result = describeGap("missing_action_or_api_intents");
    expect(result.message).toMatch(/action/i);
  });

  test("entity_rows_too_low:orders interpolates the entity name (audit-only templated code)", () => {
    const result = describeGap("entity_rows_too_low:orders");
    expect(result.message).toMatch(/orders/);
    expect(result.message).toMatch(/rows/i);
    expect(result.severity).toBe("warning");
  });

  test("workflow_tool_not_in_toolIntents:send_email interpolates the tool name", () => {
    const result = describeGap("workflow_tool_not_in_toolIntents:send_email");
    expect(result.message).toMatch(/send_email/);
    expect(result.message).toMatch(/toolIntents/);
  });

  test("behavior_missing_workflow (audit warning code)", () => {
    const result = describeGap("behavior_missing_workflow");
    expect(result.message).toMatch(/workflow/i);
    expect(result.severity).toBe("warning");
  });

  // ── fallback path for unrecognized / future codes ──
  test("an entirely unknown code falls back to a prettified rendering, not a crash", () => {
    const result = describeGap("some_totally_new_future_gap_code");
    expect(result.code).toBe("some_totally_new_future_gap_code");
    expect(result.message).toBe("Some totally new future gap code");
    expect(result.severity).toBe("warning");
  });

  test("an unknown colon-suffixed code still falls back gracefully", () => {
    const result = describeGap("brand_new_check:widget-42");
    expect(result.code).toBe("brand_new_check:widget-42");
    expect(result.message).toBe("Brand new check");
  });

  test("an unknown behavior_missing_ field still falls back gracefully", () => {
    const result = describeGap("behavior_missing_someFutureField");
    expect(result.code).toBe("behavior_missing_someFutureField");
    // No FIELD_LABELS entry for someFutureField -> prettify fallback, not a throw.
    expect(result.message.length).toBeGreaterThan(0);
    expect(result.message).not.toBe("behavior_missing_someFutureField");
  });

  test("never throws on null, undefined, or empty input", () => {
    expect(() => describeGap(null)).not.toThrow();
    expect(() => describeGap(undefined)).not.toThrow();
    expect(() => describeGap("")).not.toThrow();
    expect(describeGap("").message.length).toBeGreaterThan(0);
  });
});
