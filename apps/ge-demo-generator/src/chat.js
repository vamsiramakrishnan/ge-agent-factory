import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

const SAFE_ID = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/;

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(value, null, 2), "utf8");
}

function chatDir(projectsRoot, projectId) {
  if (!SAFE_ID.test(projectId)) throw new Error("invalid project id");
  return join(projectsRoot, projectId, "chat");
}

function sessionsPath(projectsRoot, projectId) {
  return join(chatDir(projectsRoot, projectId), "sessions.json");
}

function sessionFilePath(projectsRoot, projectId, sessionId) {
  if (!SAFE_ID.test(sessionId) && !/^[a-z0-9-]+$/.test(sessionId)) throw new Error("invalid session id");
  return join(chatDir(projectsRoot, projectId), `${sessionId}.jsonl`);
}

export async function ensureChatDir(projectsRoot, projectId) {
  const dir = chatDir(projectsRoot, projectId);
  await mkdir(dir, { recursive: true });
  return dir;
}

export async function listSessions(projectsRoot, projectId) {
  const index = await readJson(sessionsPath(projectsRoot, projectId), { sessions: [] });
  const sessions = Array.isArray(index.sessions) ? index.sessions : [];
  sessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  return sessions;
}

export async function createSession(projectsRoot, projectId, title) {
  await ensureChatDir(projectsRoot, projectId);
  const now = Date.now();
  const session = {
    id: `chat-${randomUUID().slice(0, 8)}`,
    title: title || null,
    createdAt: now,
    updatedAt: now,
  };
  const path = sessionsPath(projectsRoot, projectId);
  const index = await readJson(path, { sessions: [] });
  if (!Array.isArray(index.sessions)) index.sessions = [];
  index.sessions.unshift(session);
  await writeJson(path, index);
  return session;
}

export async function deleteSession(projectsRoot, projectId, sessionId) {
  const path = sessionsPath(projectsRoot, projectId);
  const index = await readJson(path, { sessions: [] });
  if (!Array.isArray(index.sessions)) return;
  index.sessions = index.sessions.filter((s) => s.id !== sessionId);
  await writeJson(path, index);
  const file = sessionFilePath(projectsRoot, projectId, sessionId);
  if (existsSync(file)) await unlink(file);
}

export async function renameSession(projectsRoot, projectId, sessionId, title) {
  const path = sessionsPath(projectsRoot, projectId);
  const index = await readJson(path, { sessions: [] });
  if (!Array.isArray(index.sessions)) return null;
  const session = index.sessions.find((s) => s.id === sessionId);
  if (!session) return null;
  session.title = title;
  session.updatedAt = Date.now();
  await writeJson(path, index);
  return session;
}

export async function appendMessage(projectsRoot, projectId, sessionId, message) {
  await ensureChatDir(projectsRoot, projectId);
  const record = {
    id: message.id || `msg-${randomUUID().slice(0, 8)}`,
    role: message.role || "agent",
    content: message.content || "",
    toolName: message.toolName || undefined,
    toolDetail: message.toolDetail || undefined,
    runId: message.runId || undefined,
    createdAt: message.createdAt || Date.now(),
  };
  const file = sessionFilePath(projectsRoot, projectId, sessionId);
  const line = JSON.stringify(record) + "\n";
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, line, { flag: "a" });

  const path = sessionsPath(projectsRoot, projectId);
  const index = await readJson(path, { sessions: [] });
  if (Array.isArray(index.sessions)) {
    const session = index.sessions.find((s) => s.id === sessionId);
    if (session) {
      session.updatedAt = Date.now();
      await writeJson(path, index);
    }
  }
  return record;
}

export async function listMessages(projectsRoot, projectId, sessionId) {
  const file = sessionFilePath(projectsRoot, projectId, sessionId);
  let raw;
  try {
    raw = await readFile(file, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  return raw
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      try { return JSON.parse(line); }
      catch { return null; }
    })
    .filter(Boolean);
}
