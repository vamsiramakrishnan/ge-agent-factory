// Declarative reconcile (ADR 0001, phase 5).
//
// `ge apply <manifest>` declares the desired platform + fleet; this computes the
// drift between desired and actual and emits an ordered plan of steps — gateway →
// data → tool plane → agents — so "deploy from local" stops being a remembered
// ritual and becomes "apply; the controller sequences it." Pure and testable;
// the actual-state gather + execution live in factory-core / the CLI.

// Platform planes in dependency order (each must be up before the next is useful).
export const PLANE_ORDER = ["infra", "data", "mcp"];
const PLANE_COMMAND = { infra: "ge up --infra", data: "ge data up", mcp: "ge mcp deploy" };
const PLANE_LABEL = { infra: "factory gateway", data: "data plane", mcp: "tool plane" };

// Normalize a raw manifest. Platform planes are opt-in (declare what you want up);
// fleet defaults to building every agent to the build boundary, locally.
export function normalizeManifest(raw = {}) {
  const platform = raw.platform || {};
  const fleet = raw.fleet || {};
  return {
    platform: {
      infra: platform.infra === true,
      data: platform.data === true,
      mcp: platform.mcp === true,
    },
    fleet: {
      target: fleet.target || "previewed",
      mode: fleet.mode || "local",
      agents: fleet.agents || "all",
    },
  };
}

// Compute the reconcile plan.
//   manifest — desired state (raw or normalized).
//   actual   — { planes: { infra, data, mcp } booleans (up?), plan: [ledgerPlan items] }.
// Returns { inSync, steps[], drift: { platform[], fleet[] }, manifest }.
export function planReconcile(manifest, actual = {}) {
  const m = normalizeManifest(manifest);
  const planes = actual.planes || {};
  const steps = [];
  const platformDrift = [];

  for (const plane of PLANE_ORDER) {
    if (m.platform[plane] && !planes[plane]) {
      platformDrift.push(plane);
      steps.push({
        id: `platform:${plane}`,
        kind: "platform",
        plane,
        command: PLANE_COMMAND[plane],
        reason: `${PLANE_LABEL[plane]} declared but not deployed`,
      });
    }
  }

  const wanted = m.fleet.agents === "all"
    ? null
    : new Set((m.fleet.agents || []).map((a) => (typeof a === "string" ? a : a.id)));
  const fleetDrift = [];
  for (const item of actual.plan || []) {
    if (wanted && !wanted.has(item.useCaseId)) continue;
    if (item.action && item.action !== "none") fleetDrift.push(item.useCaseId);
  }
  if (fleetDrift.length) {
    const local = m.fleet.mode !== "remote";
    steps.push({
      id: "fleet:build",
      kind: "fleet",
      agents: fleetDrift,
      command: `ge agents build --ids ${fleetDrift.slice(0, 25).join(",")}${fleetDrift.length > 25 ? ` …(+${fleetDrift.length - 25} more)` : ""}${local ? " --local" : ""}`,
      reason: `${fleetDrift.length} agent(s) not at target ${m.fleet.target}`,
    });
  }

  return {
    inSync: steps.length === 0,
    steps,
    drift: { platform: platformDrift, fleet: fleetDrift },
    manifest: m,
  };
}
