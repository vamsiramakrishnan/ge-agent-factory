# GE Agent Factory Console — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** A web ops console (`apps/console`) that manages the full factory lifecycle — the visual twin of `ge` — with live, structured logs in both local and remote mode.

**Architecture:** New Vite+React+TS app. A Bun `server.js` (prod) and a Vite dev plugin (dev) both expose `/api/ge/*` backed by `tools/lib/factory-core.mjs` — "one core, three surfaces". A shared **NDJSON event/log bus** (one schema, two producers: the remote worker tees live to GCS; the local harness writes a run journal) powers a `<LogStream>` + artifact browser. Home is the Overview status board.

**Tech Stack:** React 19, Vite 6, Tailwind v4, motion, lucide-react (mirror `apps/presentation`). Bun runtime. `factory-core.mjs` over HTTP + SSE.

**Spec:** `docs/superpowers/specs/2026-06-02-console-app-design.md`

**Environment note:** The UI builds, type-checks, and dev-runs in the sandbox. `factory-core` read ops shell out to `gcloud`/`terraform` (CAA-blocked / absent here) — endpoints return clean error JSON and the UI renders the empty/error states; live data is on an authed host. Verify backend logic with `node --check` + unit tests on the pure pieces (exec-stream splitter, event schema, handler routing).

**Commit identity:** `git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit` — no `Co-Authored-By`.

---

## File Structure

| File | Responsibility |
|---|---|
| `tools/lib/exec-stream.mjs` (new) | Streaming exec helper: spawn piped, line-split stdout/stderr, env-normalize (PYTHONUNBUFFERED…), emit NDJSON `log` events + accumulate buffer. The single subprocess choke point. |
| `tools/lib/events.mjs` (new) | NDJSON event schema + `makeEvent()` helper + line splitter (handles `\r`/ANSI). Shared by producers + tests. |
| `tools/lib/factory-core.mjs` (mod) | Add `fleetStatus`, `tailLog`, `readArtifact` read ops; route `run` through exec-stream when a sink is passed. |
| `apps/ge-demo-generator/src/factory-worker.js` (mod) | `runCommand` tees NDJSON to the live GCS sink (remote producer). |
| `apps/ge-demo-generator/src/harness-runner.js` (mod) | Route chunk events → `.harness/runs/<runId>/<stage>.ndjson` + run index (local producer). |
| `apps/console/src/server/ge-api.mjs` (new) | The `/api/ge/*` handler (shared by server.js + vite plugin) — calls factory-core, streams SSE. |
| `apps/console/server.js` (new) | Bun prod server: SPA + `/api/ge/*` (model: `apps/presentation/server.js`). |
| `apps/console/vite.config.ts` (new) | Dev server + `ge-api` middleware plugin (model: presentation vite plugin). |
| `apps/console/src/services/geClient.ts` (new) | Typed fetch + SSE hooks over `/api/ge/*`. |
| `apps/console/src/App.tsx` + `components/shell/*` (new) | Shell: nav, top bar, ModeToggle, CommandPalette, router. |
| `apps/console/src/views/{Overview,Fleet,AgentDetail,Doctor,Activity}.tsx` (new) | The six views. |
| `apps/console/src/components/{PlaneCard,StatusPill,StagePipeline,FleetTable,DoctorReport,LogStream,ArtifactBrowser}.tsx` (new) | Reusable components. |

---

## Task 1: Event schema + line splitter (`tools/lib/events.mjs`)

**Files:** Create `tools/lib/events.mjs`; Test `tools/lib/events.test.mjs`

- [ ] **Step 1: Write the failing test**

`tools/lib/events.test.mjs`:
```javascript
import { test, expect } from "bun:test";
import { makeEvent, splitLines } from "./events.mjs";

test("makeEvent fills schema fields", () => {
  const e = makeEvent({ runId: "r1", agentId: "a1", stage: "validate", type: "log", level: "info", line: "hi" });
  expect(e.runId).toBe("r1"); expect(e.type).toBe("log"); expect(typeof e.ts).toBe("string");
});

test("splitLines buffers partial lines and flushes on newline", () => {
  const s = splitLines();
  expect(s.push("foo")).toEqual([]);          // no newline yet
  expect(s.push("bar\nbaz\n")).toEqual(["foobar", "baz"]);
  expect(s.flush()).toEqual([]);              // nothing pending
});

test("splitLines treats carriage-return progress as a line update", () => {
  const s = splitLines();
  expect(s.push("10%\r20%\r30%\n")).toEqual(["30%"]); // \r collapses to last
});
```

- [ ] **Step 2: Run → fail.** `cd tools/lib && bun test events.test.mjs` → FAIL (module missing).

- [ ] **Step 3: Implement**

`tools/lib/events.mjs`:
```javascript
// NDJSON event schema shared by the remote worker + local harness producers.
// type: log | stage_started | stage_done | stage_failed | artifact | metric
export function makeEvent({ runId, agentId, stage, type = "log", level = "info", line, data, ts } = {}) {
  return { runId, agentId, stage, ts: ts || new Date().toISOString(), type, level, ...(line != null ? { line } : {}), ...(data != null ? { data } : {}) };
}

// Incremental line splitter: buffers partial chunks; on \r within a line keeps only
// the latest segment (progress bars); returns complete lines per push().
export function splitLines() {
  let buf = "";
  return {
    push(chunk) {
      buf += String(chunk);
      const out = [];
      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        let line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        const cr = line.lastIndexOf("\r");
        if (cr >= 0) line = line.slice(cr + 1);
        out.push(line);
      }
      return out;
    },
    flush() { const rest = buf.trim() ? [buf] : []; buf = ""; return rest; },
  };
}

export function inferLevel(stream, line) {
  if (stream === "stderr" && /\b(error|fatal|exception|traceback)\b/i.test(line)) return "error";
  if (/\bwarn(ing)?\b/i.test(line)) return "warn";
  return stream === "stderr" ? "warn" : "info";
}
```

- [ ] **Step 4: Run → pass.** `bun test events.test.mjs` → 3 pass.

- [ ] **Step 5: Commit**
```bash
git add tools/lib/events.mjs tools/lib/events.test.mjs
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(obs): NDJSON event schema + carriage-return-aware line splitter"
```

---

## Task 2: Streaming exec helper (`tools/lib/exec-stream.mjs`)

**Files:** Create `tools/lib/exec-stream.mjs`; Test `tools/lib/exec-stream.test.mjs`

- [ ] **Step 1: Write the failing test**
```javascript
import { test, expect } from "bun:test";
import { execStream } from "./exec-stream.mjs";

test("streams lines live and returns the full buffer + code", async () => {
  const lines = [];
  const r = await execStream("bash", ["-c", "echo one; echo two 1>&2; exit 3"], {
    onEvent: (e) => { if (e.type === "log") lines.push([e.data?.stream, e.line]); },
    meta: { runId: "r", agentId: "a", stage: "s" },
  });
  expect(r.code).toBe(3);
  expect(lines).toContainEqual(["stdout", "one"]);
  expect(lines).toContainEqual(["stderr", "two"]);
  expect(r.stdout).toContain("one");
});

test("injects PYTHONUNBUFFERED into child env", async () => {
  let seen = "";
  await execStream("bash", ["-c", "echo $PYTHONUNBUFFERED"], { onEvent: (e) => { if (e.line) seen += e.line; } });
  expect(seen).toBe("1");
});
```

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement**
```javascript
import { spawn } from "node:child_process";
import { makeEvent, splitLines, inferLevel } from "./events.mjs";

const STREAM_ENV = { PYTHONUNBUFFERED: "1", PYTHONIOENCODING: "utf-8", CLOUDSDK_CORE_DISABLE_PROMPTS: "1" };

// Spawn piped, stream stdout/stderr line-by-line as NDJSON `log` events via onEvent,
// while accumulating the full buffers for the final result. The single subprocess
// choke point so agents-cli/gcloud/antigravity all stream (they block-buffer otherwise).
export function execStream(command, args, { cwd, env = process.env, onEvent = () => {}, meta = {} } = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, env: { ...env, ...STREAM_ENV }, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "", stderr = "";
    const emit = (stream) => {
      const sp = splitLines();
      return (chunk) => {
        const text = String(chunk);
        if (stream === "stdout") stdout += text; else stderr += text;
        for (const line of sp.push(text)) onEvent(makeEvent({ ...meta, type: "log", level: inferLevel(stream, line), line, data: { stream } }));
      };
    };
    child.stdout.on("data", emit("stdout"));
    child.stderr.on("data", emit("stderr"));
    child.on("error", (e) => resolve({ code: 1, stdout, stderr: stderr + e.message }));
    child.on("close", (code, signal) => resolve({ code: code ?? 1, signal, stdout, stderr }));
  });
}
```

- [ ] **Step 4: Run → pass.**

- [ ] **Step 5: Commit**
```bash
git add tools/lib/exec-stream.mjs tools/lib/exec-stream.test.mjs
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(obs): streaming exec helper — line-tee + PYTHONUNBUFFERED (agents-cli/gcloud/antigravity)"
```

---

## Task 3: Remote producer — worker tees NDJSON to a live GCS sink

**Files:** Modify `apps/ge-demo-generator/src/factory-worker.js`

- [ ] **Step 1: Add an NDJSON append sink + route runCommand through execStream**

In `factory-worker.js`, import the helpers and add a sink that appends an NDJSON line to
`gs://<bucket>/runs/<runId>/items/<itemId>/<stage>.ndjson` (compose-append: download-append-upload,
or append via resumable upload offset; simplest reliable form = buffer per stage and PUT the growing
object every N lines / 1s). Add near the top:
```javascript
import { execStream } from "../../../tools/lib/exec-stream.mjs";
import { makeEvent } from "../../../tools/lib/events.mjs";

function logSink(payload) {
  if (!payload.artifactPrefix) return () => {};
  const { bucket, object } = parseGsUri(`${payload.artifactPrefix}/${payload.stage}.ndjson`);
  let pending = []; let flushing = false; let lastFlush = 0;
  const flush = async () => {
    if (flushing || !pending.length) return; flushing = true;
    const body = pending.join(""); pending = [];
    try { await appendGcsLines(bucket, object, body); } catch {}
    flushing = false; lastFlush = Date.now();
  };
  const tick = setInterval(flush, 1000);
  tick.unref?.();
  return (event) => { pending.push(JSON.stringify(event) + "\n"); if (Date.now() - lastFlush > 1000) flush(); };
}
```
Add `appendGcsLines(bucket, object, text)` using the JSON API: GET current object (404 → ""), concat, PUT via the media upload URL (the file already uses `https://storage.googleapis.com/upload/...`). Reuse `getAccessToken()` + `authedFetch`.

- [ ] **Step 2: Tee stage commands**

Change `runCommand` calls that execute stage commands (the loop in `runFactoryWorker`/`executeStage`,
around lines 549–660) to use `execStream` with `onEvent: sink`, where `sink = logSink(payload)`, and
`meta: { runId: payload.runId, agentId: payload.workspaceId, stage: payload.stage }`. Emit
`stage_started`/`stage_done`/`stage_failed` events through the same sink at the existing
`recordStageEvent` points. Keep the buffered `runCommand` for internal non-stage calls (token, tar).

- [ ] **Step 3: Verify.** `node --check apps/ge-demo-generator/src/factory-worker.js` → OK. (Live GCS append runs authed; unit-tested logic lives in exec-stream/events.)

- [ ] **Step 4: Commit**
```bash
git add apps/ge-demo-generator/src/factory-worker.js
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(obs): worker tees stage logs to gs://.../<stage>.ndjson (remote producer)"
```

---

## Task 4: Local producer — harness run journal

**Files:** Modify `apps/ge-demo-generator/src/harness-runner.js`

- [ ] **Step 1: Write the journal**

The harness already reads `child.stdout/stderr` chunks (lines ~236–248). Add, alongside its existing
event emission, an NDJSON writer to `<.harness>/runs/<runId>/<stage>.ndjson` using `events.mjs`'s
`splitLines` + `makeEvent`, and append a one-line record to `<.harness>/runs/index.json`
(`{runId, agentId, stage, status, startedAt, endedAt}`) on start/finish. Resolve `runId`/`stage`/
`agentId` from the harness run context (the plan/def already has these; thread them in).
```javascript
import { mkdirSync, appendFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { makeEvent, splitLines } from "../../../tools/lib/events.mjs";
// journalPath = join(harnessRoot, "runs", runId, `${stage}.ndjson`);
// per stream: const sp = splitLines(); on chunk → for (line of sp.push(text)) appendFileSync(journalPath, JSON.stringify(makeEvent({runId,agentId,stage,type:"log",line,data:{stream}}))+"\n")
```

- [ ] **Step 2: Verify.** `node --check apps/ge-demo-generator/src/harness-runner.js` → OK. Smoke: run a harness stage locally (offline) → assert `.harness/runs/<id>/<stage>.ndjson` exists and is valid NDJSON.

- [ ] **Step 3: Commit**
```bash
git add apps/ge-demo-generator/src/harness-runner.js
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(obs): harness writes a local NDJSON run journal (local producer)"
```

---

## Task 5: factory-core read ops (`fleetStatus`, `tailLog`, `readArtifact`)

**Files:** Modify `tools/lib/factory-core.mjs`

- [ ] **Step 1: Implement** (additive; reuse `loadCatalog`, `readJson(STATE_PATH)`, `gcloud`):
```javascript
// Fleet roster: catalog × .ge-state.json × (cheap) run snapshot.
export async function fleetStatus(cfg) {
  const cat = (await loadCatalog());
  const state = readJson(STATE_PATH, { completed: {}, failed: {} });
  const agents = cat.map((u) => {
    const c = state.completed[u.id]; const f = state.failed[u.id];
    return { id: u.id, title: u.title, department: u.department, runId: c?.runId || null,
      status: c ? "submitted" : f ? "failed" : "none", error: f?.error || null };
  });
  const byDept = {}; const byStatus = {};
  for (const a of agents) { byDept[a.department] = (byDept[a.department] || 0) + 1; byStatus[a.status] = (byStatus[a.status] || 0) + 1; }
  return { total: agents.length, byDept, byStatus, agents };
}

// Read the NDJSON log for a run/stage. mode=local → .harness/runs; remote → GCS.
export function tailLog(cfg, { runId, stage, item }) {
  if ((cfg.mode || "remote") === "local") {
    const p = join(GEN_DIR, ".harness", "runs", runId, `${stage}.ndjson`);
    return { found: existsSync(p), source: p, ndjson: existsSync(p) ? readFileSync(p, "utf8") : "" };
  }
  const uri = `gs://${cfg.bucket}/runs/${runId}/items/${item || runId}/${stage}.ndjson`;
  const r = gcloud(["storage", "cat", uri], { allowFail: true });
  return { found: r.ok, source: uri, ndjson: r.ok ? r.out : "" };
}

export function readArtifact(cfg, { runId, item, name }) {
  const uri = `gs://${cfg.bucket}/runs/${runId}/items/${item}/${name}`;
  const r = gcloud(["storage", "cat", uri], { allowFail: true });
  return { found: r.ok, source: uri, content: r.ok ? r.out : "" };
}
```
(`GEN_DIR` already exists in the module; confirm it's the `apps/ge-demo-generator` root.)

- [ ] **Step 2: Verify.** `node --check tools/lib/factory-core.mjs` → OK.

- [ ] **Step 3: Commit**
```bash
git add tools/lib/factory-core.mjs
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(ge): factory-core fleetStatus + tailLog + readArtifact (console read ops)"
```

---

## Task 6: `/api/ge/*` handler (shared by server + vite)

**Files:** Create `apps/console/src/server/ge-api.mjs`; Test `apps/console/src/server/ge-api.test.mjs`

- [ ] **Step 1: Write the failing test** (routing + JSON shape; mock factory-core):
```javascript
import { test, expect } from "bun:test";
import { handleGeApi } from "./ge-api.mjs";

test("GET /api/ge/status returns statusBoard JSON", async () => {
  const core = { loadConfig: () => ({ project: "p", region: "r", mode: "remote" }), statusBoard: () => ({ mode: "remote", planes: [], next: "ge up" }) };
  const res = await handleGeApi({ method: "GET", path: "/api/ge/status", query: {}, body: null }, core);
  expect(res.status).toBe(200); expect(res.json.next).toBe("ge up");
});

test("unknown route → 404", async () => {
  const res = await handleGeApi({ method: "GET", path: "/api/ge/nope", query: {}, body: null }, {});
  expect(res.status).toBe(404);
});
```

- [ ] **Step 2: Run → fail.**

- [ ] **Step 3: Implement** `handleGeApi(req, core)` returning `{status, json}` for JSON routes and a
sentinel `{stream: "logs"|"events", runId, stage}` for SSE (the transports wire SSE themselves).
Map: `GET status|doctor|fleet|agents/:id|logs/:runId|artifacts/...` and `POST mode|up|mcp/deploy|agents/build|agents/ship|agents/sync`. Each calls the matching `core.*` with `core.loadConfig(query)`.
Respect `GE_CONSOLE_READONLY` — POST infra/mutating routes → 403 when set. Pure function (core injected) so it's unit-testable and reused by both transports.

- [ ] **Step 4: Run → pass.**

- [ ] **Step 5: Commit**
```bash
git add apps/console/src/server/ge-api.mjs apps/console/src/server/ge-api.test.mjs
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(console): /api/ge/* handler over factory-core (routing + readonly gate)"
```

---

## Task 7: Scaffold `apps/console` (Vite + server + dev plugin)

**Files:** Create `apps/console/{package.json,index.html,vite.config.ts,tsconfig.json,server.js,src/main.tsx,src/index.css,src/design-tokens.ts}`

- [ ] **Step 1: `package.json`** — copy `apps/presentation/package.json`, rename to `console`, keep
the same deps (react 19, vite 6, tailwind v4, motion, lucide-react), scripts `dev`/`start`/`build`/`lint` (port 18260).

- [ ] **Step 2: `vite.config.ts`** — model the presentation plugin, but the middleware delegates to
`handleGeApi` (Task 6) for `/api/ge/*`, wiring SSE for the `{stream}` sentinel using `core.tailLog`
polling (re-read NDJSON, emit new lines) / `watchRunEvents` passthrough. `import * as core from "../../tools/lib/factory-core.mjs"`.

- [ ] **Step 3: `server.js`** — model `apps/presentation/server.js` (Bun serve, SECURITY_HEADERS,
optional IAP) but route `/api/ge/*` through `handleGeApi` + SSE. Serve `dist/`.

- [ ] **Step 4: tailwind/index.css/design-tokens** — copy `apps/presentation/src/index.css` +
`design-tokens.ts`; `index.html` with `<div id="root">`; `main.tsx` renders `<App/>`.

- [ ] **Step 5: Verify.** `cd apps/console && bun install && bun run build` → dist built;
`bun run lint` (tsc) → clean (App is a stub returning `<div>console</div>` for now).

- [ ] **Step 6: Commit**
```bash
git add apps/console
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(console): scaffold apps/console (Vite+React+Tailwind, server + /api/ge dev plugin)"
```

---

## Task 8: `geClient.ts` (typed fetch + SSE hooks)

**Files:** Create `apps/console/src/services/geClient.ts`

- [ ] **Step 1: Implement** typed wrappers + hooks:
```typescript
export interface Plane { name: string; up: boolean; detail: string }
export interface StatusBoard { mode: "local" | "remote"; project: string | null; app: string | null; region: string; planes: Plane[]; next: string; clientDoes: string }
export interface Check { name: string; status: "pass" | "warn" | "fail"; detail: string; fix: string | null }
export interface DoctorSection { name: string; checks: Check[]; fails: number }
export interface FleetAgent { id: string; title: string; department: string; status: string; runId: string | null; error: string | null }

async function j<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, { headers: { "content-type": "application/json" }, ...init });
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 200)}`);
  return r.json();
}
export const ge = {
  status: () => j<StatusBoard>("/api/ge/status"),
  doctor: (scope = "all") => j<{ sections: DoctorSection[]; fails: number }>(`/api/ge/doctor?scope=${scope}`),
  fleet: () => j<{ total: number; byDept: Record<string, number>; byStatus: Record<string, number>; agents: FleetAgent[] }>("/api/ge/fleet"),
  agent: (id: string) => j(`/api/ge/agents/${encodeURIComponent(id)}`),
  setMode: (mode: string) => j("/api/ge/mode", { method: "POST", body: JSON.stringify({ mode }) }),
  up: (planes?: string[]) => j("/api/ge/up", { method: "POST", body: JSON.stringify({ planes }) }),
  build: (b: any) => j("/api/ge/agents/build", { method: "POST", body: JSON.stringify(b) }),
  ship: (b: any) => j("/api/ge/agents/ship", { method: "POST", body: JSON.stringify(b) }),
};
// SSE: returns an unsubscribe. onLine receives parsed NDJSON events.
export function streamLogs(runId: string, stage: string, onEvent: (e: any) => void): () => void {
  const es = new EventSource(`/api/ge/runs/${encodeURIComponent(runId)}/logs?stage=${encodeURIComponent(stage)}&follow=1`);
  es.onmessage = (m) => { try { onEvent(JSON.parse(m.data)); } catch {} };
  return () => es.close();
}
```

- [ ] **Step 2: Verify.** `bun run lint` → clean.
- [ ] **Step 3: Commit** `feat(console): geClient typed API + SSE log stream`.

---

## Task 9: Shell — nav, top bar, ModeToggle, CommandPalette, router

**Files:** Create `apps/console/src/App.tsx`, `components/shell/{Sidebar,TopBar,CommandPalette}.tsx`, `components/{ModeToggle,StatusPill}.tsx`

- [ ] **Step 1: Implement** a hash-router (`#/overview|fleet|agent/:id|doctor|activity`) in `App.tsx`
with a left `Sidebar` (the five views, lucide icons), a `TopBar` (ModeToggle bound to `ge.status()`/
`ge.setMode()`, project/app, ⌘K opens `CommandPalette`), and a content `<main>` switching views.
`StatusPill` maps pass/warn/fail/up/down → token colors. `ModeToggle` calls `ge.setMode` and refetches status.

- [ ] **Step 2: Verify.** `bun run build` + `bun run lint` clean; dev-run shows the shell with empty views.
- [ ] **Step 3: Commit** `feat(console): app shell — sidebar, top bar, mode toggle, command palette`.

---

## Task 10: Overview (status board home)

**Files:** Create `apps/console/src/views/Overview.tsx`, `components/PlaneCard.tsx`

- [ ] **Step 1: Implement** — fetch `ge.status()` + `ge.fleet()` (+ poll 10s). Render: mode + project/app
header; three `PlaneCard`s (factory/data/tool from `status.planes`) each with detail + inline *Doctor*
(→ `#/doctor`) and *Stand up* (`ge.up([plane])`, mutating → toast + refetch); a fleet progress bar
(`byStatus`); the **Next step** CTA (`status.next`) as a button; and an Activity strip (last N from a
shared activity hook in Task 13). Empty/error states render when the API errors (sandbox).
- [ ] **Step 2: Verify.** build + lint clean; dev-run renders Overview (planes show ○ / error detail).
- [ ] **Step 3: Commit** `feat(console): Overview status board (planes, fleet progress, next step)`.

---

## Task 11: Fleet (table + filters + bulk actions)

**Files:** Create `apps/console/src/views/Fleet.tsx`, `components/FleetTable.tsx`

- [ ] **Step 1: Implement** — `ge.fleet()` → searchable table (columns: id, department, status pill,
run). Filters: text, department `<select>`, status `<select>`. Row → `#/agent/:id`. Header checkbox +
per-row select → bulk bar with **Build** (`ge.build({ids, local: mode==='local'})`), **Ship**
(`ge.ship({ids})`), **Sync** — each → toast + refetch. Virtualize if >200 rows (simple windowing).
- [ ] **Step 2: Verify.** build + lint clean; dev-run renders the table from `/api/ge/fleet` (363 from the catalog even offline, since `fleetStatus` reads the local catalog).
- [ ] **Step 3: Commit** `feat(console): Fleet view — table, filters, bulk build/ship/sync`.

---

## Task 12: Agent detail — StagePipeline + LogStream + ArtifactBrowser

**Files:** Create `apps/console/src/views/AgentDetail.tsx`, `components/{StagePipeline,LogStream,ArtifactBrowser}.tsx`

- [ ] **Step 1: LogStream** — props `{ runId, stage }`. On mount, `streamLogs(runId, stage, …)`;
keep a ring buffer (cap 5000 lines), render virtualized rows with line numbers, ANSI→span color
(small ANSI parser), level tint, a search box (filter), and a follow-tail toggle (auto-scroll). Handles
`type:"log"` (append), `stage_*` (divider rows), `metric`/`artifact` (badge rows).
- [ ] **Step 2: StagePipeline** — the factory stage graph as a horizontal stepper; current/failed
states from `ge.agent(id)`; clicking a stage sets the LogStream's `stage`. (Reuse the stage list from
`factory-orchestration`'s graph shape; hard-code the ordered labels to avoid importing server code.)
- [ ] **Step 3: ArtifactBrowser** — list known artifacts per stage; click → `GET /api/ge/artifacts/...`
→ JSON/text preview pane.
- [ ] **Step 4: AgentDetail** — compose: header (id/title/dept/status + actions build/ship), StagePipeline,
then a split pane LogStream | ArtifactBrowser.
- [ ] **Step 5: Verify.** build + lint clean; dev-run: with no live run, LogStream shows "waiting for
logs", StagePipeline renders the graph, ArtifactBrowser shows the empty state.
- [ ] **Step 6: Commit** `feat(console): Agent detail — stage pipeline + live LogStream + artifact browser`.

---

## Task 13: Doctor + Activity

**Files:** Create `apps/console/src/views/Doctor.tsx`, `components/DoctorReport.tsx`, `apps/console/src/views/Activity.tsx`, `src/hooks/useActivity.ts`

- [ ] **Step 1: DoctorReport + Doctor view** — `ge.doctor(scope)`; render sections (toolchain·factory·
data·tool) with `Check` rows, status pill, and a **copy-fix** button per non-pass; scope filter chips;
a re-run button. Total fail count banner.
- [ ] **Step 2: Activity** — `useActivity` subscribes to the run-events SSE (the gateway's existing
`/api/ge/runs/:id/events` passthrough, or a fleet-wide events endpoint); render a reverse-chron feed of
stage transitions with agent/stage/status + link to `#/agent/:id`. Overview's strip reuses this hook.
- [ ] **Step 3: Verify.** build + lint clean; dev-run renders Doctor (sections from API or error state) + Activity (empty until events).
- [ ] **Step 4: Commit** `feat(console): Doctor report (copy-fix) + Activity feed`.

---

## Task 14: End-to-end verification + docs

**Files:** Modify `docs/OPERATIONS.md`, `tools/README.md`; (no code)

- [ ] **Step 1: Full build/typecheck sweep**
```bash
cd apps/console && bun run lint && bun run build && echo CONSOLE_OK
cd /home/user/fde-agent-factory && node --check tools/lib/exec-stream.mjs && node --check tools/lib/events.mjs && node --check tools/lib/factory-core.mjs && node --check apps/ge-demo-generator/src/factory-worker.js && node --check apps/ge-demo-generator/src/harness-runner.js && echo BACKEND_OK
```
Expected: `CONSOLE_OK`, `BACKEND_OK`.

- [ ] **Step 2: Backend unit tests**
```bash
cd tools/lib && bun test events.test.mjs exec-stream.test.mjs
cd /home/user/fde-agent-factory/apps/console/src/server && bun test ge-api.test.mjs
```
Expected: all pass.

- [ ] **Step 3: Dev-run smoke** — `cd apps/console && (bun run dev &) ; sleep 3 ; curl -s localhost:18260/api/ge/fleet | head -c 200 ; curl -s localhost:18260/api/ge/status | head -c 200` → fleet returns 363 from the catalog; status returns JSON (or a clean error if no gcloud). Kill the dev server.

- [ ] **Step 4: Docs** — add a "Console" section to `docs/OPERATIONS.md` (run `bun --cwd apps/console run dev` locally; deployed = `ge-agent-factory-console` Cloud Run, read-mostly + `GE_CONSOLE_READONLY`) and a pointer in `tools/README.md` ("third surface: the web console").

- [ ] **Step 5: Commit** `docs(console): operations + tools README; e2e verification`.

---

## Coordination notes
- **Planes/Stand-up view** (spec view #4) is **merged into Overview** for v1: the three `PlaneCard`s
  carry the *Stand up* + *Doctor* actions. The standalone view with the stage-graph + build-boundary
  visual is deferred (add as a 6th sidebar entry later).
- **Per-tool flags + structured extraction** (gcloud `--verbosity=info`, `gcloud builds log --stream`,
  `agents-cli` non-interactive, JSON→`metric`/`artifact` events) are applied where stage commands are
  built in Task 3; the buffering keystone (`PYTHONUNBUFFERED` + line-tee in Task 2) is what makes
  streaming work and is the must-have. Treat the flags as in-Task-3 polish.
- Tasks 3–4 touch `factory-worker.js` / `harness-runner.js` (shared with the data/tool-plane + ship work) — additive (log tee + journal), low collision, but rebase-aware.
- The remote GCS-append sink (Task 3) and `gcloud storage cat` reads (Task 5) run authed; sandbox verifies routing/splitter/handler via unit tests + `node --check`, and the UI via build/lint/dev-run against the local catalog.
- Deferred (spec Tier 2/3): inline Cloud Build/Run/Agent-Runtime log tails, run control, eval/quality + Cloud Trace telemetry.

## Verification summary
1. `bun test` green for `events`, `exec-stream`, `ge-api`.
2. `node --check` clean for all touched `.mjs`/`.js`.
3. `apps/console`: `bun run lint` + `bun run build` clean; dev-run serves `/api/ge/fleet` (363) + the shell + six views.
4. Spec coverage: bus (T1,T2) · producers (T3 remote, T4 local) · read ops (T5) · API (T6) · app+views (T7–T13) · subprocess streaming (T2 env + T3/T4 wiring).
