// workspace-doctor — inspect/repair a single local generated workspace
// (`ge workspace doctor`/`ge workspace repair`). Verbatim extraction from
// factory-core.mjs (see AGENTS.md / REFACTOR-HANDOFF.md §9 methodology:
// verbatim move, dependency injection where needed, re-export from
// factory-core.mjs to preserve its public API contract). `run`/`genDir` are
// injected the same way factory-core wires them into the plane modules;
// resolveLocalWorkspaceId/localWorkspaceExists are stable leaf imports (same
// as provision.mjs/doctor.mjs already import from local-workspaces.mjs
// directly, no injection needed).

import { resolveLocalWorkspaceId, localWorkspaceExists } from "../local-workspaces.mjs";

function parseJsonObjects(text) {
  const objects = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (start < 0) {
      if (ch === "{") { start = i; depth = 1; inString = false; escaped = false; }
      continue;
    }
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === "\"") inString = false;
      continue;
    }
    if (ch === "\"") inString = true;
    else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        try { objects.push(JSON.parse(text.slice(start, i + 1))); } catch { /* best-effort: brace scan over mixed output; non-JSON spans are expected */ }
        start = -1;
      }
    }
  }
  if (!objects.length) throw new Error(`command did not emit JSON: ${text.slice(-500)}`);
  return objects[objects.length - 1];
}

function missingWorkspaceReport({ id, workspaceId, stage }) {
  return {
    kind: "ge.workspace_doctor",
    ok: false,
    blocked: true,
    workspace: workspaceId || id,
    stage,
    summary: { total: 1, passed: 0, failed: 1 },
    blockers: [{
      id: "workspace:missing",
      message: `No local generated workspace exists for ${id}. Run Factory build before using the workspace doctor.`,
      detail: { requestedId: id, resolvedWorkspaceId: workspaceId || null },
    }],
    repairTasks: [{
      id: "factory:build-local-workspace",
      command: `ge agents build --ids ${id} --local`,
      reason: "Workspace doctor can only inspect generated local workspaces. Factory must create this workspace first.",
      owner: "factory",
    }],
    evidence: {},
  };
}

export function createWorkspaceDoctorOps({ run, genDir }) {
  function workspaceDoctor(cfg, { id, stage = "preview" } = {}) {
    if ((cfg.mode || "local") !== "local") {
      return {
        ok: false,
        blocked: true,
        workspace: id,
        stage,
        blockers: [{ id: "console:mode", message: "Workspace doctor is available for local workspaces in this console path." }],
        repairTasks: [],
      };
    }
    const workspaceId = resolveLocalWorkspaceId(id);
    if (!localWorkspaceExists(workspaceId)) {
      return missingWorkspaceReport({ id, workspaceId, stage });
    }
    const result = run("node", ["src/cli.js", "workspace", "doctor", workspaceId, "--stage", stage], { cwd: genDir, allowFail: true });
    if (!result.out && !result.ok) {
      return {
        ok: false,
        blocked: true,
        workspace: workspaceId,
        stage,
        blockers: [{ id: "doctor:command", message: result.err || "workspace doctor command failed" }],
        repairTasks: [],
      };
    }
    return parseJsonObjects(result.out || result.err || "{}");
  }

  function workspaceRepair(cfg, { id, stage = "preview", attempts = 3, agent = "none", runPreview = false } = {}) {
    if ((cfg.mode || "local") !== "local") {
      return {
        ok: false,
        blocked: true,
        workspace: id,
        stage,
        finalDoctor: {
          blockers: [{ id: "console:mode", message: "Workspace repair is available for local workspaces in this console path." }],
        },
        attempts: [],
      };
    }
    const workspaceId = resolveLocalWorkspaceId(id);
    if (!localWorkspaceExists(workspaceId)) {
      const doctor = missingWorkspaceReport({ id, workspaceId, stage });
      return {
        kind: "ge.workspace_repair",
        ok: false,
        workspace: workspaceId,
        stage,
        attempts: [],
        finalDoctor: doctor,
        nextRepairTasks: doctor.repairTasks,
      };
    }
    const args = [
      "src/cli.js", "workspace", "repair", workspaceId,
      "--stage", stage,
      "--attempts", String(attempts),
      "--agent", agent,
      "--run-preview", runPreview ? "true" : "false",
    ];
    const result = run("node", args, { cwd: genDir, allowFail: true });
    if (!result.out && !result.ok) {
      return {
        ok: false,
        blocked: true,
        workspace: workspaceId,
        stage,
        finalDoctor: {
          blockers: [{ id: "repair:command", message: result.err || "workspace repair command failed" }],
        },
        attempts: [],
      };
    }
    return parseJsonObjects(result.out || result.err || "{}");
  }

  return { workspaceDoctor, workspaceRepair };
}
