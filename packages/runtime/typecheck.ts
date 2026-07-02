// Compile-time exercise of the @ge/runtime type surface. Never executed:
// the per-package `typecheck` script (`bunx tsc --noEmit -p .`) checks this
// file against the package's .d.ts declarations so the declared types stay
// honest — a .d.ts nobody compiles against is theater.

import {
  makeEvent,
  splitLines,
  inferLevel,
  normalizeBlocker,
  normalizeArtifactRef,
  normalizeRuntimeEvent,
  normalizeResumePlan,
  runtimeTaskPresentation,
  normalizeRuntimeTask,
} from "@ge/runtime";
import type { RuntimeEvent } from "@ge/runtime/events";
import type {
  ArtifactRef,
  Blocker,
  RuntimeEventShape,
  ResumePlanShape,
  RuntimeTaskPresentation,
  RuntimeTaskShape,
} from "@ge/runtime/contract";

// ── events ────────────────────────────────────────────────────────────────────
const ev: RuntimeEvent = makeEvent({ runId: "r1", stage: "build", type: "log", line: "hello" });
const splitter = splitLines();
const pushed: string[] = splitter.push("a\r\nb\n");
const flushed: string[] = splitter.flush();
const level: "error" | "warn" | "info" = inferLevel("stderr", "Error: boom");

// @ts-expect-error type and level are required on a RuntimeEvent
const badEvent: RuntimeEvent = { line: "no type or level" };

// ── contract normalizers ──────────────────────────────────────────────────────
const blocker: Blocker = normalizeBlocker("disk full");
const blockerFromObject: Blocker = normalizeBlocker({ code: "E42", error: "quota exceeded" });
const ref: ArtifactRef = normalizeArtifactRef("out/data.csv");
const refFromObject: ArtifactRef = normalizeArtifactRef({ id: "pack", resolvedPath: "/tmp/pack" });

const event: RuntimeEventShape = normalizeRuntimeEvent({
  type: "stage_log",
  level: "info",
  line: "x",
  data: { n: 1 },
});
const eventLine: string = event.line;

const plan: ResumePlanShape = normalizeResumePlan(
  { state: "blocked", nextAction: "resume", safeToRun: true, reason: "quota", commands: ["ge run"] },
  { id: "t1", status: "blocked" },
);
const planBlockers: Blocker[] = plan.blockers;
const planArtifacts: ArtifactRef[] = plan.artifacts;

const pres: RuntimeTaskPresentation = runtimeTaskPresentation({
  id: "t1",
  kind: "factory",
  status: "running",
});
const tone: "danger" | "success" | "default" = pres.statusTone;

const task: RuntimeTaskShape = normalizeRuntimeTask({
  id: "t1",
  kind: "factory",
  status: "running",
  artifactRefs: ["out.csv", { name: "pack", type: "dir", path: "/tmp/pack" }],
  blockers: ["disk full"],
  output: { items: [{ blockers: [{ id: "b1", message: "stuck" }] }] },
  graph: { nodes: [{ status: "blocked", blockers: [{ code: "E1", error: "stuck node" }] }] },
});
// The normalized task's rollups are real normalized shapes, not bags.
const taskRefs: ArtifactRef[] = task.artifactRefs;
const taskPlan: ResumePlanShape = task.resumePlan;
const taskPres: RuntimeTaskPresentation = task.presentation;

// The mistakes these types must catch:
// @ts-expect-error safeToRun is a boolean on a resume plan, not a string
normalizeResumePlan({ safeToRun: "yes" });
// @ts-expect-error commands is a string array, not a single string
normalizeResumePlan({ commands: "ge run" });
// @ts-expect-error "info" is not a statusTone (danger/success/default)
const badTone: RuntimeTaskPresentation["statusTone"] = "info";
// @ts-expect-error path is required on a normalized ArtifactRef (string | null, never omitted)
const badRef: ArtifactRef = { name: "x", type: "file", status: "unknown", metadata: {} };
// @ts-expect-error a normalized Blocker always carries a message
const badBlocker: Blocker = { id: "b1" };

// Referenced-but-unused sinks (this file only exists to be type-checked).
void ev;
void pushed;
void flushed;
void level;
void badEvent;
void blocker;
void blockerFromObject;
void ref;
void refFromObject;
void eventLine;
void planBlockers;
void planArtifacts;
void tone;
void taskRefs;
void taskPlan;
void taskPres;
void badTone;
void badRef;
void badBlocker;
