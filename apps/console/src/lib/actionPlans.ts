import type { FleetActionPlan } from "../services/geClient";
import { EXECUTABLE_ACTION_KINDS as EXECUTABLE_ACTION_KINDS_LIST, ACTION_DISPATCH_MODE } from "@ge/contracts";

// Sourced from @ge/contracts (the single shared vocabulary); kept as a Set here for callers.
// Byte-identical to the former local declaration — zero behavior change.
export const EXECUTABLE_ACTION_KINDS = new Set<string>(EXECUTABLE_ACTION_KINDS_LIST);

export function actionCommand(plan?: FleetActionPlan | null): string {
  return plan?.commands?.[0] || "";
}

export function routeForAction(plan?: FleetActionPlan | null, stageId = ""): string | null {
  if (!plan) return null;
  if (typeof plan.route === "string" && plan.route.startsWith("#/")) return plan.route;
  const command = actionCommand(plan);
  if (command.startsWith("Open #/")) return command.replace(/^Open\s+/, "");
  if (plan.kind === "watch_runtime" || command.startsWith("ge runtime events")) {
    return stageId === "interview" ? "#/interview" : "#/activity";
  }
  return null;
}

export function isExecutableAction(plan?: FleetActionPlan | null): boolean {
  return Boolean(plan && EXECUTABLE_ACTION_KINDS.has(plan.kind));
}

// reconcile-b: decide navigate-vs-execute by the canonical DispatchMode instead of the old
// "route-first for everything" heuristic, so a primary button never silently navigates when it
// should run work (and matches the affordance <Lifecycle> renders).
//   - navigate kinds -> the route to go to (or null if none resolvable)
//   - runTask / resumeTask / copyOnly -> null (caller executes/handles; NEVER navigates,
//     even if the plan carries a stray route — that was the inconsistency)
//   - unknown kinds -> legacy behavior: navigate if the plan resolves a route
export function planNavigates(plan?: FleetActionPlan | null, stageId = ""): string | null {
  if (!plan) return null;
  const mode = ACTION_DISPATCH_MODE[plan.kind];
  if (mode && mode !== "navigate") return null;
  const route = routeForAction(plan, stageId);
  if (route) return route;
  if (plan.kind === "start_interview") return "#/interview";
  return null;
}
