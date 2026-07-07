import { describe, expect, test } from "bun:test";
import {
  PipelinePlanActionKindSchema,
  FleetActionKindSchema,
  DaemonNextActionSchema,
  GeCommandIdSchema,
  RiskLevelSchema,
  DispatchModeSchema,
  EXECUTABLE_ACTION_KINDS,
  FleetBlockerSchema,
  FleetActionPlanSchema,
  PipelinePlanSchema,
} from "./index";

// Drift guard: each z.enum's members, spelled out, must equal what the source
// declares. If a member is added/removed/renamed in action-kinds.ts without
// updating this list, the exact-membership assertion fails.
describe("action-kind enums — membership + parse behavior", () => {
  const cases: Array<[string, { options: readonly string[] }, string[], string]> = [
    [
      "PipelinePlanActionKindSchema",
      PipelinePlanActionKindSchema,
      [
        "start_interview",
        "review_spec",
        "run_pipeline",
        "build_agents",
        "generate_evals",
        "run_preview",
        "handoff_agents",
        "resume_pipeline",
        "resume_harness",
        "watch_runtime",
      ],
      "start_interview",
    ],
    [
      "FleetActionKindSchema",
      FleetActionKindSchema,
      ["handoff_agents", "none", "resume_pipeline", "resume_repair", "build_agents", "user_action", "repair_agent"],
      "repair_agent",
    ],
    [
      "DaemonNextActionSchema",
      DaemonNextActionSchema,
      ["none", "wait", "resume_repair", "inspect_blocker", "rerun_doctor", "rerun_task", "rerun_harness", "resume_pipeline"],
      "rerun_harness",
    ],
    [
      "RiskLevelSchema",
      RiskLevelSchema,
      ["mutates-cloud", "starts-workloads", "starts-local-workloads", "writes-repo", "read-only"],
      "read-only",
    ],
    ["DispatchModeSchema", DispatchModeSchema, ["navigate", "runTask", "resumeTask", "copyOnly"], "runTask"],
  ];

  for (const [name, schema, expected, sampleValid] of cases) {
    describe(name, () => {
      test("options match the source declaration exactly (order-independent)", () => {
        expect([...schema.options].sort()).toEqual([...expected].sort());
      });
      test("has no duplicate members", () => {
        expect(schema.options.length).toBe(new Set(schema.options).size);
      });
      test("accepts a declared value", () => {
        expect((schema as any).parse(sampleValid)).toBe(sampleValid);
      });
      test("rejects an undeclared value", () => {
        expect((schema as any).safeParse("__not_a_real_member__").success).toBe(false);
      });
      test("rejects a non-string value", () => {
        expect((schema as any).safeParse(42).success).toBe(false);
      });
    });
  }
});

describe("GeCommandIdSchema", () => {
  test("carries a non-trivial, duplicate-free command set", () => {
    expect(GeCommandIdSchema.options.length).toBeGreaterThan(40);
    expect(GeCommandIdSchema.options.length).toBe(new Set(GeCommandIdSchema.options).size);
  });
  test("includes representative command ids across namespaces", () => {
    for (const id of ["capture", "prove", "handoff", "pipeline.run", "passport.emit", "okf.customize", "console.deploy"]) {
      expect(GeCommandIdSchema.options).toContain(id);
      expect(GeCommandIdSchema.parse(id)).toBe(id);
    }
  });
  test("rejects an unknown command id", () => {
    expect(GeCommandIdSchema.safeParse("totally.made.up").success).toBe(false);
  });
});

describe("EXECUTABLE_ACTION_KINDS", () => {
  test("is the exact executable set the console declares", () => {
    expect([...EXECUTABLE_ACTION_KINDS].sort()).toEqual(
      [
        "start_interview",
        "review_spec",
        "watch_runtime",
        "resume_harness",
        "resume_pipeline",
        "run_pipeline",
        "run_preview",
        "build_agents",
        "handoff_agents",
        "resume_repair",
        "repair_agent",
      ].sort(),
    );
  });
  test("has no duplicates", () => {
    expect(EXECUTABLE_ACTION_KINDS.length).toBe(new Set(EXECUTABLE_ACTION_KINDS).size);
  });
});

describe("pipeline object schemas", () => {
  test("FleetBlockerSchema requires id + message strings", () => {
    expect(FleetBlockerSchema.safeParse({ id: "b1", message: "boom" }).success).toBe(true);
    expect(FleetBlockerSchema.safeParse({ id: "b1" }).success).toBe(false);
    expect(FleetBlockerSchema.safeParse({ id: 1, message: "boom" }).success).toBe(false);
  });

  test("FleetActionPlanSchema enforces required fields and types", () => {
    const valid = { kind: "run_pipeline", label: "Run", owner: "you", safeToRun: true, commands: ["ge pipeline run"] };
    expect(FleetActionPlanSchema.safeParse(valid).success).toBe(true);
    // safeToRun must be a boolean
    expect(FleetActionPlanSchema.safeParse({ ...valid, safeToRun: "yes" }).success).toBe(false);
    // commands must be an array of strings
    expect(FleetActionPlanSchema.safeParse({ ...valid, commands: "ge pipeline run" }).success).toBe(false);
    // missing required field
    expect(FleetActionPlanSchema.safeParse({ label: "Run", owner: "you", safeToRun: true, commands: [] }).success).toBe(false);
  });

  test("PipelinePlanSchema pins the kind literal", () => {
    const base = {
      kind: "ge.pipeline.plan",
      version: 1,
      id: "plan-1",
      mode: "full",
      targetStage: "handoff",
      input: { systems: [], ids: [] },
      status: "ready",
      counts: {},
      stages: [],
    };
    expect(PipelinePlanSchema.safeParse(base).success).toBe(true);
    expect(PipelinePlanSchema.safeParse({ ...base, kind: "ge.pipeline.other" }).success).toBe(false);
    // input.systems/ids are required arrays
    expect(PipelinePlanSchema.safeParse({ ...base, input: {} }).success).toBe(false);
  });
});
