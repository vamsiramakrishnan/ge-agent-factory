import { describe, expect, test } from "bun:test";
import { normalizeGatewaySnapshot } from "./remote-run-ops.mjs";

describe("remote run status projection", () => {
  test("projects failures from generation and package stages in canonical order", () => {
    const snapshot = normalizeGatewaySnapshot({
      run: { status: "submitted", runId: "run-package" },
      artifacts: {
        package_data: { status: "failed", error: "cloud package missing" },
        harness_refine: { status: "done", nextStage: "validate" },
      },
    });

    expect(snapshot).toMatchObject({
      status: "failed",
      currentStage: "package_data",
      error: "cloud package missing",
    });
  });

  test("derives failed stage status from legacy gateway artifact snapshots", () => {
    const snapshot = normalizeGatewaySnapshot({
      ok: true,
      run: { status: "submitted", runId: "run-1", targetStage: "publish_enterprise" },
      artifacts: {
        harness_refine: { status: "done", nextStage: "validate" },
        validate: {
          status: "failed",
          error: "bad substitution",
          classification: "cloud_build_config",
          firstError: "substitutions too large",
          fixHint: "shorten substitutions",
          logUrl: "https://logs.example",
          stageResultUri: "gs://bucket/runs/run-1/items/ws/factory-validate-result.json",
        },
      },
    });

    expect(snapshot).toMatchObject({
      status: "failed",
      currentStage: "validate",
      error: "bad substitution",
      classification: "cloud_build_config",
      firstError: "substitutions too large",
      fixHint: "shorten substitutions",
      logUrl: "https://logs.example",
      stageResultUri: "gs://bucket/runs/run-1/items/ws/factory-validate-result.json",
    });
  });

  test("uses the next stage from completed artifacts while a submitted run is still active", () => {
    const snapshot = normalizeGatewaySnapshot({
      ok: true,
      run: { status: "submitted", runId: "run-1", startStage: "harness_refine" },
      artifacts: {
        harness_refine: { status: "done", nextStage: "validate" },
      },
    });

    expect(snapshot).toMatchObject({
      status: "running",
      currentStage: "validate",
    });
  });
});
