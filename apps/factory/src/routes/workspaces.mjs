// The full /api/workspaces/* surface: workspace CRUD, activity, tasks,
// secrets, files, terminal commands, wakeups, agents + sub-resources, chat
// sessions/messages, briefs, versions, promotion packets, workspace doctor
// & repair, and deploy/publish plans.
//
// Deliberately NOT included here (left on the legacy raw-http handler in
// server.js): the ADK preview lifecycle (previews/adk-web), adk-run, and
// adk-proxy routes. They spawn/track long-lived child processes and (for
// adk-proxy) pipe an upstream response body through byte-for-byte, and none
// of the three have any test coverage in server.test.js — see the
// "remaining work" notes in server.js for why they're deferred rather than
// migrated on faith.
import { Hono } from "hono";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  createProject,
  ensureProjectDir,
  getProject,
  listProjectFiles,
  listProjects,
  readProjectFile,
  removeProject,
} from "../projects.js";
import { validateAgentWorkspace } from "../agent-workspace-pipeline.js";
import { WORKSPACE_PATHS } from "../workspace-contract.js";
import { runWorkspaceDoctor } from "../workspace-doctor.js";
import {
  getAgentDb, insertAgentDb, updateAgentStageDb, updateAgentDb, deleteAgentDb,
  listArtifactsDb, STAGES,
  listConversationsDb, createConversationDb, deleteConversationDb, renameConversationDb,
  listMessagesDb, appendMessageDb,
  listVersionsDb, createVersionDb, getVersionDb, promoteVersionDb,
  listTasksDb, getTaskDb, insertTaskDb, updateTaskDb, deleteTaskDb,
  touchProjectDb, deleteProjectDb,
  listActivityEventsDb,
  getHeartbeatPolicyDb, upsertHeartbeatPolicyDb,
} from "../db.js";
import { saveBrief, readBrief } from "../versions.js";
import { createWorkspaceSnapshot, restoreWorkspaceSnapshot } from "../snapshots.js";
import { deleteSecret, listSecrets, upsertSecret } from "../secrets.js";

/**
 * @param {object} ctx - dependencies owned by server.js (module-scoped
 *   constants, the previews map, and helper functions that close over them).
 */
export function createWorkspaceRoutes(ctx) {
  const {
    PROJECTS_ROOT,
    PROJECT_STORE,
    DATA_ROOT,
    REPO_ROOT,
    previews,
    ensureProjectInDb,
    appendActivity,
    wakeProjectAgent,
    runWorkspaceCommand,
    terminateChild,
    createPromotionPacket,
    repairWorkspaceArtifact,
    writeDeployPlanArtifact,
    writePublishPlanArtifact,
    getRegistrationStatus,
    ensureWorkspaceAgentRecord,
    persistWorkspaceStage,
    uniqueAgentDirName,
  } = ctx;

  const app = new Hono();
  // Match the legacy handler's outer catch: any thrown error becomes a 500
  // with { error: message }, not Hono's default plain-text response.
  app.onError((error, c) => c.json({ error: error instanceof Error ? error.message : String(error) }, 500));

  // ── Workspace collection ──
  app.get("/api/workspaces", async (c) => {
    const workspaces = await listProjects({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT });
    return c.json({ workspaces });
  });

  app.post("/api/workspaces", async (c) => {
    const body = await c.req.json();
    const workspace = await createProject({
      storePath: PROJECT_STORE,
      projectsRoot: PROJECTS_ROOT,
      name: typeof body.name === "string" ? body.name : "New Workspace",
      kind: typeof body.kind === "string" ? body.kind : "workspace",
      useCaseId: body.useCaseId || undefined,
      departmentId: body.departmentId || undefined,
    });
    ensureProjectInDb(workspace.id);
    appendActivity("workspace.created", {
      projectId: workspace.id,
      entityType: "workspace",
      entityId: workspace.id,
      payload: { name: workspace.name, kind: workspace.kind },
    });
    return c.json({ workspace });
  });

  app.delete("/api/workspaces/:pid", async (c) => {
    const pid = c.req.param("pid");
    const preview = previews.get(pid);
    terminateChild(preview?.child, "SIGTERM");
    previews.delete(pid);
    try { deleteProjectDb(pid); } catch { /* may not exist in db */ }
    await removeProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
    appendActivity("workspace.deleted", { projectId: pid, entityType: "workspace", entityId: pid });
    return c.json({ ok: true, deleted: pid });
  });

  // ── Activity ──
  app.get("/api/workspaces/:pid/activity", (c) => {
    const pid = c.req.param("pid");
    return c.json({ events: listActivityEventsDb({ projectId: pid, limit: c.req.query("limit") }) });
  });

  // ── Tasks ──
  app.get("/api/workspaces/:pid/tasks", async (c) => {
    const pid = c.req.param("pid");
    const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
    if (!project) return c.json({ error: "workspace not found" }, 404);
    ensureProjectInDb(pid);
    return c.json({ tasks: listTasksDb(pid, { status: c.req.query("status"), assigneeAgentId: c.req.query("assigneeAgentId") }) });
  });

  app.post("/api/workspaces/:pid/tasks", async (c) => {
    const pid = c.req.param("pid");
    const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
    if (!project) return c.json({ error: "workspace not found" }, 404);
    ensureProjectInDb(pid);
    const body = await c.req.json();
    const task = insertTaskDb(pid, body);
    appendActivity("task.created", { projectId: pid, entityType: "task", entityId: task.id, payload: { title: task.title, assigneeAgentId: task.assigneeAgentId } });
    if (task.assigneeAgentId) {
      const policy = getHeartbeatPolicyDb(task.assigneeAgentId);
      if (policy.wakeOnAssignment) {
        wakeProjectAgent(pid, {
          agentId: body.runtimeAgentId || "gemini",
          selectedAgentId: task.assigneeAgentId,
          reason: "assignment",
          taskId: task.id,
        }).catch((error) => appendActivity("wakeup.failed", { projectId: pid, entityType: "task", entityId: task.id, payload: { error: error.message } }));
      }
    }
    return c.json({ task }, 201);
  });

  app.get("/api/workspaces/:pid/tasks/:taskId", async (c) => {
    const { pid, taskId } = c.req.param();
    const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
    if (!project) return c.json({ error: "workspace not found" }, 404);
    ensureProjectInDb(pid);
    const task = getTaskDb(pid, taskId);
    if (!task) return c.json({ error: "task not found" }, 404);
    return c.json({ task });
  });

  app.patch("/api/workspaces/:pid/tasks/:taskId", async (c) => {
    const { pid, taskId } = c.req.param();
    const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
    if (!project) return c.json({ error: "workspace not found" }, 404);
    ensureProjectInDb(pid);
    const body = await c.req.json();
    const task = updateTaskDb(pid, taskId, body);
    if (!task) return c.json({ error: "task not found" }, 404);
    appendActivity("task.updated", { projectId: pid, entityType: "task", entityId: task.id, payload: body });
    return c.json({ task });
  });

  app.delete("/api/workspaces/:pid/tasks/:taskId", async (c) => {
    const { pid, taskId } = c.req.param();
    const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
    if (!project) return c.json({ error: "workspace not found" }, 404);
    ensureProjectInDb(pid);
    deleteTaskDb(pid, taskId);
    appendActivity("task.deleted", { projectId: pid, entityType: "task", entityId: taskId });
    return c.json({ ok: true });
  });

  // ── Secrets ──
  app.get("/api/workspaces/:pid/secrets", async (c) => {
    const pid = c.req.param("pid");
    const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
    if (!project) return c.json({ error: "workspace not found" }, 404);
    return c.json({ secrets: await listSecrets(DATA_ROOT) });
  });

  app.post("/api/workspaces/:pid/secrets", async (c) => {
    const pid = c.req.param("pid");
    const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
    if (!project) return c.json({ error: "workspace not found" }, 404);
    const body = await c.req.json();
    const secret = await upsertSecret(DATA_ROOT, body);
    appendActivity("secret.upserted", { projectId: pid, entityType: "secret", entityId: secret.name, payload: { name: secret.name, scope: secret.scope } });
    return c.json({ secret }, 201);
  });

  app.delete("/api/workspaces/:pid/secrets/:name", async (c) => {
    const { pid, name } = c.req.param();
    const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
    if (!project) return c.json({ error: "workspace not found" }, 404);
    await deleteSecret(DATA_ROOT, name);
    appendActivity("secret.deleted", { projectId: pid, entityType: "secret", entityId: name });
    return c.json({ ok: true });
  });

  // ── Wakeups ──
  app.post("/api/workspaces/:pid/wakeups", async (c) => {
    const pid = c.req.param("pid");
    const body = await c.req.json();
    const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
    if (!project) return c.json({ error: "workspace not found" }, 404);
    try {
      return c.json(await wakeProjectAgent(pid, body), 202);
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : String(error) }, 400);
    }
  });

  // ── Files ──
  app.get("/api/workspaces/:pid/files", async (c) => {
    const pid = c.req.param("pid");
    return c.json({ files: await listProjectFiles(PROJECTS_ROOT, pid) });
  });

  app.get("/api/workspaces/:pid/file", async (c) => {
    const pid = c.req.param("pid");
    return c.json({ file: await readProjectFile(PROJECTS_ROOT, pid, c.req.query("path")) });
  });

  // ── Terminal ──
  app.post("/api/workspaces/:pid/terminal", async (c) => {
    const pid = c.req.param("pid");
    const body = await c.req.json();
    return c.json({ result: await runWorkspaceCommand(pid, body.commandId) });
  });

  // NOTE: previews/adk-web (POST/GET/DELETE) and adk-run (POST) stay on the
  // legacy raw-http handler — see the file header comment.

  // ── Promotion packet ──
  app.post("/api/workspaces/:pid/promotion-packet", (c) => promotionPacket(c));
  app.get("/api/workspaces/:pid/promotion-packet", (c) => promotionPacket(c));
  async function promotionPacket(c) {
    const pid = c.req.param("pid");
    const workspaceDir = await ensureProjectDir(PROJECTS_ROOT, pid);
    const manifestPath = join(workspaceDir, "workspace.json");
    const gate = await runWorkspaceDoctor({
      workspaceDir,
      manifestPath,
      workspaceId: pid,
      repoRoot: REPO_ROOT,
      stage: "promote",
    });
    if (!gate.ok) return c.json({ ok: false, blocked: true, doctor: gate }, 422);
    const promotion = await createPromotionPacket({
      workspaceDir,
      manifestPath,
      projectId: pid,
      repoRoot: REPO_ROOT,
      source: c.req.method === "POST" ? "ui" : "api",
    });
    touchProjectDb(pid);
    return c.json(promotion);
  }

  // ── Workspace doctor ──
  app.post("/api/workspaces/:pid/workspace-doctor", (c) => workspaceDoctorHandler(c));
  app.get("/api/workspaces/:pid/workspace-doctor", (c) => workspaceDoctorHandler(c));
  async function workspaceDoctorHandler(c) {
    const pid = c.req.param("pid");
    const workspaceDir = await ensureProjectDir(PROJECTS_ROOT, pid);
    const body = c.req.method === "POST" ? await c.req.json() : {};
    const stage = body.stage || c.req.query("stage") || "validate";
    const report = await runWorkspaceDoctor({
      workspaceDir,
      manifestPath: join(workspaceDir, WORKSPACE_PATHS.workspaceManifest),
      workspaceId: pid,
      repoRoot: REPO_ROOT,
      stage,
    });
    return c.json(report, report.ok ? 200 : 422);
  }

  // ── Workspace repair ──
  app.post("/api/workspaces/:pid/workspace-repair", async (c) => {
    const pid = c.req.param("pid");
    const body = await c.req.json();
    const report = await repairWorkspaceArtifact(pid, {
      stage: body.stage || "preview",
      attempts: body.attempts || body.maxAttempts || 3,
      runPreview: body.runPreview !== false,
      target: body.target || "agent_runtime",
    });
    return c.json(report, report.ok ? 200 : 422);
  });

  // ── Deploy / publish plans ──
  app.post("/api/workspaces/:pid/plans/deploy", async (c) => {
    const pid = c.req.param("pid");
    const body = await c.req.json();
    const result = await writeDeployPlanArtifact(pid, body.target || "agent_runtime");
    if (result.blocked) return c.json(result, 422);
    return c.json(result);
  });
  app.post("/api/workspaces/:pid/plans/publish", async (c) => {
    const pid = c.req.param("pid");
    const body = await c.req.json();
    const result = await writePublishPlanArtifact(pid, body.appId || body.app_id || "<GEMINI_ENTERPRISE_APP_ID>");
    if (result.blocked) return c.json(result, 422);
    return c.json(result);
  });

  // ── Registration status ──
  app.get("/api/workspaces/:pid/registration", async (c) => {
    const pid = c.req.param("pid");
    return c.json({ registration: await getRegistrationStatus(pid) });
  });

  // ── Agents ──
  app.get("/api/workspaces/:pid/agents", (c) => {
    const pid = c.req.param("pid");
    ensureProjectInDb(pid);
    return c.json({ agents: ensureWorkspaceAgentRecord(pid), stages: STAGES });
  });

  app.post("/api/workspaces/:pid/agents", async (c) => {
    const pid = c.req.param("pid");
    ensureProjectInDb(pid);
    const body = await c.req.json();
    const proposedDir = body.dirName || body.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "agent";
    let dirName;
    try {
      dirName = uniqueAgentDirName(pid, proposedDir);
    } catch {
      return c.json({ error: "invalid agent directory" }, 400);
    }
    mkdirSync(join(await ensureProjectDir(PROJECTS_ROOT, pid), dirName), { recursive: true });
    const agent = insertAgentDb({ projectId: pid, name: body.name || "New Agent", useCaseId: body.useCaseId, departmentId: body.departmentId, dirName, brief: body.brief });
    if (body.heartbeatPolicy && typeof body.heartbeatPolicy === "object") upsertHeartbeatPolicyDb(agent.id, body.heartbeatPolicy);
    appendActivity("agent.created", { projectId: pid, entityType: "agent", entityId: agent.id, payload: { name: agent.name, dirName: agent.dirName } });
    return c.json({ agent }, 201);
  });

  app.get("/api/workspaces/:pid/agents/:aid", (c) => {
    const { pid } = c.req.param();
    ensureProjectInDb(pid);
    const agent = getAgentDb(c.req.param("aid"));
    if (!agent) return c.json({ error: "agent not found" }, 404);
    return c.json({ agent });
  });

  app.patch("/api/workspaces/:pid/agents/:aid", async (c) => {
    const { pid, aid } = c.req.param();
    ensureProjectInDb(pid);
    const body = await c.req.json();
    updateAgentDb(aid, body);
    appendActivity("agent.updated", { projectId: pid, entityType: "agent", entityId: aid, payload: body });
    return c.json({ agent: getAgentDb(aid) });
  });

  app.delete("/api/workspaces/:pid/agents/:aid", (c) => {
    const { pid, aid } = c.req.param();
    ensureProjectInDb(pid);
    deleteAgentDb(aid);
    appendActivity("agent.deleted", { projectId: pid, entityType: "agent", entityId: aid });
    return c.json({ ok: true });
  });

  app.patch("/api/workspaces/:pid/agents/:aid/stage", async (c) => {
    const { pid, aid } = c.req.param();
    ensureProjectInDb(pid);
    const body = await c.req.json();
    if (body.stage === "tested") {
      const workspaceDir = join(PROJECTS_ROOT, pid);
      const validation = await validateAgentWorkspace({
        workspaceDir,
        manifestPath: join(workspaceDir, "workspace.json"),
        workspaceId: pid,
        repoRoot: REPO_ROOT,
        testsRequested: false,
        source: "stage-patch",
      });
      if (!validation.ok) return c.json({ error: "validation failed", validation }, 422);
    }
    const agent = updateAgentStageDb(aid, body.stage);
    persistWorkspaceStage(pid, body.stage, { source: "stage-patch" });
    appendActivity("agent.stage_changed", { projectId: pid, entityType: "agent", entityId: aid, payload: { stage: body.stage } });
    return c.json({ agent });
  });

  app.get("/api/workspaces/:pid/agents/:aid/artifacts", (c) => {
    const { pid, aid } = c.req.param();
    ensureProjectInDb(pid);
    return c.json({ artifacts: listArtifactsDb(aid) });
  });

  app.get("/api/workspaces/:pid/agents/:aid/heartbeat-policy", (c) => {
    const { pid, aid } = c.req.param();
    ensureProjectInDb(pid);
    const agent = getAgentDb(aid);
    if (!agent) return c.json({ error: "agent not found" }, 404);
    return c.json({ policy: getHeartbeatPolicyDb(aid) });
  });

  app.patch("/api/workspaces/:pid/agents/:aid/heartbeat-policy", async (c) => {
    const { pid, aid } = c.req.param();
    ensureProjectInDb(pid);
    const agent = getAgentDb(aid);
    if (!agent) return c.json({ error: "agent not found" }, 404);
    const body = await c.req.json();
    const policy = upsertHeartbeatPolicyDb(aid, body);
    appendActivity("agent.heartbeat_policy_updated", { projectId: pid, entityType: "agent", entityId: aid, payload: policy });
    return c.json({ policy });
  });

  // ── Chat sessions ──
  app.get("/api/workspaces/:pid/chat/sessions", (c) => {
    const pid = c.req.param("pid");
    ensureProjectInDb(pid);
    const agentId = c.req.query("agentId") || null;
    const agent = agentId ? getAgentDb(agentId) : null;
    if (agentId && (!agent || agent.projectId !== pid)) return c.json({ error: "Agent not found" }, 404);
    return c.json({ sessions: listConversationsDb(pid, agentId) });
  });

  app.post("/api/workspaces/:pid/chat/sessions", async (c) => {
    const pid = c.req.param("pid");
    ensureProjectInDb(pid);
    const body = await c.req.json();
    const agentId = typeof body.agentId === "string" && body.agentId ? body.agentId : null;
    const agent = agentId ? getAgentDb(agentId) : null;
    if (agentId && (!agent || agent.projectId !== pid)) return c.json({ error: "Agent not found" }, 404);
    const session = createConversationDb(pid, body.title, agentId);
    return c.json({ session }, 201);
  });

  app.delete("/api/workspaces/:pid/chat/sessions/:sid", (c) => {
    const { pid, sid } = c.req.param();
    ensureProjectInDb(pid);
    deleteConversationDb(pid, sid);
    return c.json({ ok: true });
  });

  app.patch("/api/workspaces/:pid/chat/sessions/:sid", async (c) => {
    const { pid, sid } = c.req.param();
    ensureProjectInDb(pid);
    const body = await c.req.json();
    const session = renameConversationDb(pid, sid, body.title);
    return c.json({ session });
  });

  app.get("/api/workspaces/:pid/chat/sessions/:sid/messages", (c) => {
    const { pid, sid } = c.req.param();
    return c.json({ messages: listMessagesDb(pid, sid) });
  });

  app.post("/api/workspaces/:pid/chat/sessions/:sid/messages", async (c) => {
    const { pid, sid } = c.req.param();
    const body = await c.req.json();
    const message = appendMessageDb(pid, sid, body);
    return c.json({ message }, 201);
  });

  // ── Brief ──
  app.get("/api/workspaces/:pid/brief", async (c) => {
    const pid = c.req.param("pid");
    const brief = await readBrief(PROJECTS_ROOT, pid);
    return c.json({ brief });
  });

  app.post("/api/workspaces/:pid/brief", async (c) => {
    const pid = c.req.param("pid");
    const body = await c.req.json();
    const brief = await saveBrief(PROJECTS_ROOT, pid, body);
    return c.json({ brief }, 201);
  });

  // ── Versions ──
  app.get("/api/workspaces/:pid/versions", (c) => {
    const pid = c.req.param("pid");
    ensureProjectInDb(pid);
    return c.json(listVersionsDb(pid));
  });

  app.post("/api/workspaces/:pid/versions", async (c) => {
    const pid = c.req.param("pid");
    ensureProjectInDb(pid);
    const body = await c.req.json();
    const snapshot = await createWorkspaceSnapshot(PROJECTS_ROOT, pid, { message: `workspace version for ${pid}` });
    const version = createVersionDb(pid, {
      brief: body.brief || null,
      fileSnapshot: snapshot.fileSnapshot,
      snapshotRef: snapshot.commit,
    });
    touchProjectDb(pid);
    appendActivity("version.created", { projectId: pid, entityType: "version", entityId: String(version.version), payload: { snapshotRef: version.snapshotRef, fileCount: version.fileCount } });
    return c.json({ version }, 201);
  });

  app.get("/api/workspaces/:pid/versions/:vid{[0-9]+}", (c) => {
    const { pid, vid } = c.req.param();
    ensureProjectInDb(pid);
    const version = getVersionDb(pid, Number(vid));
    if (!version) return c.json({ error: "version not found" }, 404);
    return c.json({ version });
  });

  app.patch("/api/workspaces/:pid/versions/:vid{[0-9]+}/promote", async (c) => {
    const { pid, vid } = c.req.param();
    ensureProjectInDb(pid);
    const numericVid = Number(vid);
    const version = getVersionDb(pid, numericVid);
    if (!version) return c.json({ error: "version not found" }, 404);
    if (!version.snapshotRef) return c.json({ error: "version has no restorable snapshot" }, 409);
    await restoreWorkspaceSnapshot(PROJECTS_ROOT, pid, version.snapshotRef);
    const result = promoteVersionDb(pid, numericVid);
    appendActivity("version.promoted", { projectId: pid, entityType: "version", entityId: String(numericVid), payload: { snapshotRef: version.snapshotRef } });
    return c.json(result);
  });

  return app;
}
