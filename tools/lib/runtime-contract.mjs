function compact(list) {
  return list.filter((item) => item !== null && item !== undefined);
}

function uniqueArtifacts(refs = []) {
  const seen = new Set();
  const out = [];
  for (const ref of refs.map(normalizeArtifactRef)) {
    const key = `${ref.name}\0${ref.type}\0${ref.path || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(ref);
  }
  return out;
}

function uniqueBlockers(blockers = []) {
  const seen = new Set();
  const out = [];
  for (const blocker of blockers.map(normalizeBlocker)) {
    const key = `${blocker.id}\0${blocker.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(blocker);
  }
  return out;
}

export function normalizeBlocker(blocker = {}) {
  if (typeof blocker === "string") return { id: "blocker", message: blocker };
  if (!blocker || typeof blocker !== "object") return { id: "blocker", message: "blocked" };
  return {
    ...blocker,
    id: blocker.id || blocker.code || blocker.name || "blocker",
    message: blocker.message || blocker.error || blocker.detail || blocker.id || blocker.code || "blocked",
    detail: blocker.detail ?? blocker.data ?? null,
  };
}

export function normalizeArtifactRef(ref = {}) {
  if (typeof ref === "string") {
    return {
      name: ref,
      type: "file",
      path: ref,
      status: "unknown",
      metadata: {},
    };
  }
  const path = ref.path || ref.resolvedPath || null;
  return {
    ...ref,
    name: ref.name || ref.id || path || "artifact",
    type: ref.type || "file",
    path,
    status: ref.status || "unknown",
    metadata: ref.metadata || {},
  };
}

export function normalizeRuntimeEvent(event = {}) {
  if (!event || typeof event !== "object") {
    return {
      type: "event",
      level: "info",
      line: String(event || ""),
      data: null,
    };
  }
  return {
    ...event,
    type: event.type || "event",
    level: event.level || "info",
    line: event.line || event.message || event.type || "",
    data: event.data ?? null,
  };
}

function taskArtifacts(task = {}) {
  const output = task.output || {};
  const summary = task.summary && typeof task.summary === "object" ? task.summary : {};
  const graphArtifacts = output.graph?.nodes?.flatMap((node) => node.artifacts || []) || task.graph?.nodes?.flatMap((node) => node.artifacts || []) || [];
  return uniqueArtifacts(compact([
    ...(task.artifactRefs || []),
    ...(summary.artifactRefs || []),
    ...(output.artifactRefs || []),
    ...graphArtifacts,
  ]));
}

function taskBlockers(task = {}) {
  const output = task.output || {};
  const summary = task.summary && typeof task.summary === "object" ? task.summary : {};
  const itemBlockers = (output.items || []).flatMap((item) => item.blockers || []);
  const graphBlockers = (output.graph?.nodes || task.graph?.nodes || [])
    .filter((node) => ["blocked", "failed"].includes(node.status) || (node.blockers || node.resumePlan?.blockers || []).length)
    .flatMap((node) => node.blockers || node.resumePlan?.blockers || []);
  return uniqueBlockers(compact([
    ...(task.blockers || []),
    ...(summary.resumePlan?.blockers || []),
    ...(output.blockers || []),
    ...itemBlockers,
    ...graphBlockers,
  ]));
}

export function normalizeResumePlan(plan = null, task = {}) {
  const artifactRefs = taskArtifacts(task);
  const blockers = Array.isArray(task.blockers) && task.blockers.length ? uniqueBlockers(task.blockers) : taskBlockers(task);
  const state = plan?.state || task.status || "unknown";
  return {
    state,
    nextAction: plan?.nextAction || "none",
    safeToRun: Boolean(plan?.safeToRun),
    reason: plan?.reason || "",
    commands: Array.isArray(plan?.commands) ? plan.commands : [],
    blockers: uniqueBlockers(plan?.blockers || blockers),
    artifacts: (plan?.artifacts || artifactRefs).map(normalizeArtifactRef),
  };
}

export function runtimeTaskPresentation(task = {}) {
  const summary = typeof task.summary === "string" ? task.summary : "";
  const title = summary || `${task.kind || "task"} ${task.id || ""}`.trim();
  const blocker = (task.blockers || [])[0];
  return {
    title,
    subtitle: blocker?.message || task.resumePlan?.reason || task.status || "",
    statusTone: ["failed", "blocked"].includes(task.status) ? "danger" : task.status === "done" ? "success" : "default",
    primaryAction: task.resumePlan?.safeToRun ? task.resumePlan.nextAction : "inspect",
    secondaryActions: task.resumePlan?.commands || [],
    artifactSummary: `${(task.artifactRefs || []).length} artifact(s)`,
    blockerSummary: blocker?.message || "",
  };
}

export function normalizeRuntimeTask(task = {}) {
  const output = task.output || {};
  const artifactRefs = taskArtifacts(task);
  const blockers = taskBlockers(task);
  const next = {
    ...task,
    id: task.id || "unknown-task",
    kind: task.kind || "unknown",
    status: task.status || "unknown",
    output,
    artifactRefs,
    blockers,
  };
  const resumePlan = normalizeResumePlan(task.resumePlan || output.resumePlan, next);
  const normalized = {
    ...next,
    resumePlan,
  };
  return {
    ...normalized,
    presentation: task.presentation || runtimeTaskPresentation(normalized),
  };
}
