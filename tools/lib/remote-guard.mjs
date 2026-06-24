// Single choke point in front of every GCP-mutating operation. The local/remote
// boundary used to be enforced by scattered `if (mode === "local")` branches, so
// any new code path could silently provision billable cloud resources. Routing
// mutations through this guard makes the boundary explicit, testable, and
// impossible to skip by accident.
//
// Contract:
//   - mode must be "remote" (default is "local" — see config-schema.mjs)
//   - GE_DRY_RUN=1 → returns { dryRun: true } so the caller previews instead of mutating
//   - otherwise GE_CONFIRM=1 (or GE_YES=1) must be set to actually mutate
export function assertRemoteAuthorized(action, { mode, env = process.env } = {}) {
  const resolved = mode || "local";
  if (resolved !== "remote") {
    throw new Error(
      `${action} mutates real GCP resources and requires remote mode (current mode: ${resolved}). ` +
        `Re-run with --mode remote and GE_CONFIRM=1, or GE_DRY_RUN=1 to preview.`,
    );
  }
  const truthy = (v) => v !== undefined && v !== "" && v !== "0" && v !== "false";
  if (truthy(env.GE_DRY_RUN)) return { authorized: true, dryRun: true };
  if (truthy(env.GE_CONFIRM) || truthy(env.GE_YES)) return { authorized: true, dryRun: false };
  throw new Error(
    `${action} will mutate real, billable GCP resources. Re-run with GE_CONFIRM=1 to proceed, ` +
      `or GE_DRY_RUN=1 to preview the plan first.`,
  );
}
