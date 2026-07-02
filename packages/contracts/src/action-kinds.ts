// Action-kind vocabularies for the GE console/deck, lifted VERBATIM from the five sources
// that mint or consume them. This is a byte-faithful NAMING of strings already on the wire —
// NO merging, NO behavior change. The reconciliation that collapses these into one canonical
// dispatch is a later, behavior-changing wave (see
// docs/design-specs/specs/2026-06-14-console-presentation-unification.md).
//
// zod-backed: each vocabulary is a z.enum (runtime-validatable) with the type inferred, so the
// exported type names + members are unchanged for consumers.
import { z } from "zod";

// (a) Minted by tools/lib/journey-plan.mjs action() — what the journey plan emits.
export const JourneyPlanActionKindSchema = z.enum([
  "start_interview",
  "review_spec",
  "run_mission",
  "build_agents",
  "generate_evals",
  "run_preview",
  "ship_agents",
  "resume_mission",
  "resume_harness",
  "watch_runtime",
]);
export type JourneyPlanActionKind = z.infer<typeof JourneyPlanActionKindSchema>;

// (b) Minted by tools/lib/doctor/fleet-health.mjs actionPlanFor() — now plural build_agents (unified).
export const FleetActionKindSchema = z.enum([
  "ship_agents",
  "none",
  "resume_mission",
  "resume_autopilot",
  "build_agents",
  "user_action",
  "repair_agent",
]);
export type FleetActionKind = z.infer<typeof FleetActionKindSchema>;

// (c) Emitted by tools/lib/runtime-daemon.mjs resumePlanFor()/taskSummary + mission-plan.mjs.
//     The daemon emits `rerun_harness`, NEVER `resume_harness` (that lives only in the UI vocab).
//     The generic safe-resume fallback is `rerun_${TaskKind}` (runtime-daemon.mjs).
export const DaemonNextActionSchema = z.enum([
  "none",
  "wait",
  "resume_autopilot",
  "inspect_blocker",
  "rerun_doctor",
  "rerun_task",
  "rerun_harness",
  "resume_mission",
]);
export type DaemonNextAction = z.infer<typeof DaemonNextActionSchema>;

// (d) CLI command ids from tools/lib/ge-command-registry.mjs (a separate namespace).
//     Completeness is enforced structurally — tools/contracts-registry-parity.test.mjs
//     fails when a GE_COMMANDS entry is added without extending this enum.
export const GeCommandIdSchema = z.enum([
  "up",
  "data.up",
  "mcp.deploy",
  "agents.build",
  "agents.build.local",
  "mission.run",
  "agents.ship",
  "agents.sync",
  "daemon.start",
  "usecases.list",
  "doctor",
  "status",
  "logs",
  "mcp.doctor",
]);
export type GeCommandId = z.infer<typeof GeCommandIdSchema>;

// (e) Risk levels encoded by GE_COMMANDS entries (used for confirm-gating).
//     Same parity test keeps this a superset of the registry's risks;
//     apps/console/src/services/geClient.ts types GeCommand.risk from here
//     instead of hand-mirroring the union.
export const RiskLevelSchema = z.enum([
  "mutates-cloud",
  "starts-workloads",
  "starts-local-workloads",
  "writes-repo",
  "read-only",
]);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

// The set the console treats as executable, EXACTLY as apps/console/src/lib/actionPlans.ts
// declared it. Const-asserted so it cannot silently drift.
export const EXECUTABLE_ACTION_KINDS = [
  "start_interview",
  "review_spec",
  "watch_runtime",
  "resume_harness",
  "resume_mission",
  "run_mission",
  "run_preview",
  "build_agents",
  "ship_agents",
  // reconcile-e: promoted from fleet-only out-of-band handling to shared executable kinds
  // so Journey/AgentDetail/<Lifecycle> dispatch them like any other action.
  "resume_autopilot",
  "repair_agent",
] as const;
export type ExecutableActionKind = (typeof EXECUTABLE_ACTION_KINDS)[number];

// Known divergences between the five vocabularies, recorded as DATA (nothing reads this yet) —
// the explicit target list for the reconcile wave.
export const ACTION_KIND_ALIASES = {
  // UI mints resume_harness; the daemon emits rerun_harness for the same intent (POST /resume).
  resume_harness: { daemon: "rerun_harness", intent: "re-launch a blocked harness.run" },
  // RECONCILED: both journey plan and fleet-health now mint plural build_agents (singular retired).
  build_agents: { intent: "build selected agents" },
  // run_preview advertises an autopilot --stage preview command but the UI routes it through
  // mission.run via startJourney.
  run_preview: { advertised: "autopilot --stage preview", actual: "mission.run via startJourney" },
} as const;

// Descriptive mirror of how the console dispatches each kind today (routeForAction-first in
// Journey.runStageAction / AgentDetail.runPlan). NOT switched on yet — a typed target so a shared
// <Lifecycle> can render the right affordance once consumers honor it (reconcile-b).
export const DispatchModeSchema = z.enum(["navigate", "runTask", "resumeTask", "copyOnly"]);
export type DispatchMode = z.infer<typeof DispatchModeSchema>;
export const ACTION_DISPATCH_MODE: Record<string, DispatchMode> = {
  start_interview: "navigate",
  review_spec: "navigate",
  watch_runtime: "navigate",
  run_mission: "runTask",
  run_preview: "runTask",
  build_agents: "runTask",
  ship_agents: "runTask",
  resume_mission: "resumeTask",
  resume_harness: "resumeTask",
  resume_autopilot: "resumeTask",
  repair_agent: "runTask",
  generate_evals: "copyOnly",
};

// Orphans: kinds minted/known but with no executable runner today (documentation-only).
export const ORPHAN_ACTION_KINDS = {
  generate_evals: "copyOnly — minted by journey-plan; not executable, no registry id, not a daemon SUPPORTED_TASK_KIND",
  user_action: "terminal no-op sentinel (needs user input)",
  none: "terminal no-op sentinel",
  inspect_blocker: "daemon-only, read-only; no journey mint",
  // reconcile-e: resume_autopilot + repair_agent are no longer orphans — promoted to
  // EXECUTABLE_ACTION_KINDS and dispatched in the shared runStageAction/runPlan paths.
} as const;
