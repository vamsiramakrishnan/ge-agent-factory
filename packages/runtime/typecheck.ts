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
import type { ArtifactRef, Blocker } from "@ge/runtime/contract";

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

const event = normalizeRuntimeEvent({ type: "stage_log", level: "info", line: "x", data: { n: 1 } });
const plan = normalizeResumePlan(
  { state: "blocked", nextAction: "resume", safeToRun: true, reason: "quota", commands: ["ge run"] },
  { id: "t1", status: "blocked" },
);
const pres = runtimeTaskPresentation({ id: "t1", kind: "factory", status: "running" });
const task = normalizeRuntimeTask({
  id: "t1",
  kind: "factory",
  status: "running",
  artifactRefs: ["out.csv", { name: "pack", type: "dir", path: "/tmp/pack" }],
  blockers: ["disk full"],
  output: { items: [{ blockers: [{ id: "b1", message: "stuck" }] }] },
});

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
void event;
void plan;
void pres;
void task;
