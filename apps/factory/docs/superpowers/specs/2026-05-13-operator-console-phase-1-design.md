# Operator Console — Phase 1 Design

- **Date:** 2026-05-13
- **Status:** Approved (brainstorm complete; awaiting user spec review before plan)
- **Codebase:** `tmp/factory` (separate git repo from parent)
- **Branch (proposed):** `operator-console-phase-1` off local `main` HEAD after Step 0 below
- **Phase:** 1 of N (Phase 2/3 listed in §13)

## 1. Problem statement

Today the daemon is presented as "a chat backend with files." The backend already exposes the primitives of a local agent operating system — tasks, wakeups with coalescing, activity events, heartbeat policies, scoped secrets, runs with SSE — but the frontend hides them behind a chat-first home and a workspace-tile dashboard. An operator cannot answer "what work exists, who is working on it, what is running, what changed, what needs attention" without reading logs.

Phase 1 inverts the UX: **task is the primary object**, the active workspace gets a command-center overview, and the run inspector is the spine that connects task → agent → activity → logs.

Chat remains as an input affordance (demoted to a command bar), not the primary work surface.

## 2. Scope

### In scope (phase 1)

1. **Overview page** — workspace-scoped command center with five cards: Tasks summary, Active runs, Agents, Needs attention, Activity tail (live, last 25).
2. **Tasks page** — kanban board (open / in_progress / blocked / completed) with right-side detail drawer. Drawer contains description, blockers, scoped activity timeline, runs list, artifacts, versions, and the primary action **Wake Agent For Task**.
3. **Agent detail page** — profile, readiness checklist, heartbeat policy editor, scoped secrets binding, assigned tasks, recent runs.
4. **Run inspector drawer** (minimal; folded in from phase 2 per pushback) — opened from Active Runs card, task detail drawer, or activity row. Shows: status, agent/runtime, task link, wakeup reason, coalesced count, started/updated time, event stream, stderr/error rows, cancel button, event log path. No filters, no global runs page.
5. **Workspaces page at `#/workspaces`** — the existing tile home, demoted from default.
6. **Versions page (lightweight)** — a real route at `#/versions` that lists snapshots for the active workspace with promote/restore confirmations. No diff viewer; no global view. (Replaces an earlier proposal to redirect to inline view, which the user correctly flagged as messy.)
7. **Cross-cutting infrastructure**:
   - Hash router (`web/src/controllers/router.js`).
   - Single SSE client for `/api/activity/stream` — the **only** realtime primitive for activity events. Per-card bespoke event mechanisms are forbidden.
   - Shared `<ConfirmModal>` with Impact summary and optional type-to-confirm. Replaces every `window.confirm` in the new surfaces.
   - Hidden polling helper `pollOnVisible(fn, intervalMs)` — `setInterval` gated by `document.visibilityState === "visible"`. Used by tasks board and agent detail.

### Out of scope (deferred to Phase 2/3 — see §13)

- Full Runs page with history and filters
- Artifacts page
- Full filterable Activity page (the Overview tail and the per-task scoped timeline are sufficient for phase 1)
- Runtime/health page beyond the existing `/api/health` JSON
- Diff viewer for versions
- Cross-workspace aggregate views ("portfolio" rollups)
- Drag-to-reorder priorities on the tasks board
- Secrets at non-project scope

## 3. Information architecture & routing

Hash-based SPA. No router library — a small custom controller (~80 LOC). The current navigation shell is preserved; the body region swaps based on route.

| Route                | Page                              | Phase  |
| -------------------- | --------------------------------- | ------ |
| `#/overview`         | Workspace command center          | 1      |
| `#/tasks`            | Tasks board (drawer closed)       | 1      |
| `#/tasks/:id`        | Tasks board with drawer open      | 1      |
| `#/agents`           | Agent list (existing, reused)     | 1      |
| `#/agents/:id`       | Agent detail                      | 1      |
| `#/runs/:id`         | Triggers run inspector drawer overlaid on current page (deep-link form) | 1 |
| `#/versions`         | Versions list for active workspace | 1     |
| `#/workspaces`       | Workspace tile home (demoted)     | 1      |
| `#/runs`             | Stub: "Phase 2 — full runs page"  | 1      |
| `#/artifacts`        | Stub: "Phase 2"                   | 1      |
| `#/runtime`          | Stub with `/api/health` + adapters JSON dump | 1 |
| `#/activity`         | Stub: "Phase 2"                   | 1      |

### Landing logic

- Boot: fetch `/api/projects`.
- If at least one workspace exists → redirect to `#/overview` (active workspace = last opened, persisted in `localStorage.activeWorkspace`).
- If zero workspaces → redirect to `#/workspaces` so the operator can create one.
- The top-nav workspace selector includes a **Manage workspaces** link to `#/workspaces`.

### Activity row deep-link mapping (stable contract)

Activity events deep-link by `entityType`. Every renderer MUST use this map; no ad-hoc routing in event renderers.

| `entityType` | Target                                          |
| ------------ | ----------------------------------------------- |
| `task`       | `#/tasks/:entityId`                             |
| `agent`      | `#/agents/:entityId`                            |
| `run`        | `#/runs/:entityId` (opens drawer; preserves underlying page) |
| `version`    | `#/versions` (anchor `#v-<entityId>` if cheap)  |
| `secret`     | `#/agents/<bound-agent-id>` (falls back to no-op if no binding) |
| `project`    | switches workspace, then `#/overview`           |

## 4. Page designs

### 4.1 Overview (`#/overview`)

Five cards laid out 2×2 + full-width activity tail. Workspace-scoped: every card filters by `activeWorkspaceId`.

| Card             | Source                                      | Refresh |
| ---------------- | ------------------------------------------- | ------- |
| Tasks summary    | `GET /api/projects/:id/tasks`               | poll on visible 5s + invalidate on `task.*` SSE |
| Active runs      | `GET /api/runs?projectId=:id&status=active` | poll on visible 2s + per-run SSE for elapsed |
| Agents           | `GET /api/projects/:id/agents` + readiness selector | poll 10s |
| Needs attention  | derived selector over the above + `/api/projects/:id/secrets` | derived |
| Activity tail    | `GET /api/activity?projectId=:id&limit=25` then `/api/activity/stream?projectId=:id` | live SSE |

The "Needs attention" card derives risks **on the frontend** from facts the backend exposes:
- task with `status=blocked`
- agent with `readiness.passing === false`
- secret name referenced by an agent's `heartbeat_policy.secretNames` but absent from `/api/projects/:id/secrets`
- workspace with `manifest.currentVersion < manifest.latestVersion`
- run with `status=failed` in last 24h

### 4.2 Tasks (`#/tasks`, `#/tasks/:id`)

Kanban with 4 columns. Each card shows title, priority pill, assignee agent name (if any), latest run status dot.

Clicking a task opens the right-side **task detail drawer** and updates the URL to `#/tasks/:id`. Drawer contents:

- Header: title, status pill, priority, assignee selector (PATCH on change)
- Description (markdown rendered)
- Goal field (editable)
- Blockers list (read-only in phase 1; editing deferred)
- **Wake Agent For Task** primary button (see §4.3 for behavior)
- Activity timeline filtered to this task
- Runs list (latest 5) — clicking opens the run inspector drawer (stacked; task drawer dims)
- Artifacts produced by runs of this task (links to file viewer; viewer reused from existing `file-tabs.js`)
- Versions created during runs of this task

### 4.3 Wake Agent For Task — behavior

The primary action POSTs to `/api/projects/:id/wakeups` with:

```json
{
  "reason": "on_demand",
  "taskId": "task_<id>",
  "selectedAgentId": "<task.assigneeAgentId>",
  "agentId": "<runtime adapter id, e.g. 'codex' or 'gemini'>"
}
```

Two-id model (matches the existing daemon contract — see `src/server.js` line ~640 wakeup handler):
- `selectedAgentId` — the DB row from the `agents` table (the configured agent with a heartbeat policy and assigned tasks).
- `agentId` — the runtime adapter that will execute the run (`codex`, `gemini`, `claude`, `mock`, etc.). Comes from the active workspace's adapter selection.

Coalescing keys on the pair `(agentId, selectedAgentId)`; both must match an active run for it to merge.

If the response includes `coalesced: true`:
- The button label changes to **"Merged into active run"** for ~2s.
- The run inspector drawer auto-opens for `response.run.id`.

If a 4xx error returns (e.g. policy disables on_demand):
- Inline error under the button: "On-demand wakeups are disabled for this agent. Edit policy → /agents/:id".

If success and not coalesced:
- Toast: "Run started" with link to inspector.
- Task status optimistically transitions to `in_progress` (server already does this; UI mirrors).

### 4.4 Run inspector drawer

Opened by route `#/runs/:id` or programmatically from a card/row. Renders as a right-side drawer overlay (z-index above task drawer). Contents:

- Header: run id (truncated), status pill, runtime adapter, agent name, **Cancel** button (only when status=active)
- Wakeup metadata: reason, coalesced count, started, updated, elapsed
- Task link (if `taskId` set) — back to `#/tasks/:taskId`
- Event stream — connects to `GET /api/runs/:id/events` (existing SSE). Displays structured events first, raw text below.
- Stderr / error rows — filtered subset of the event stream
- Event log path — copy-to-clipboard on click; shown verbatim
- Footer: "Open in new tab" link to `#/runs/:id` (in case operator stacked drawers and wants to focus)

The drawer must work standalone (deep-linkable) and stacked (over task drawer or overview). When stacked, the parent drawer dims but stays mounted; closing the run drawer reveals it.

### 4.5 Agent detail (`#/agents/:id`)

Two-column layout:

- **Left column:** Profile (name, runtime adapter, workdir, stage); Readiness checklist (6 items derived from `/api/agents/:id/readiness`); Scoped secrets (list of names from heartbeat policy + status from `/api/projects/:id/secrets`; "+ Bind secret" form adds a name to the policy); Assigned tasks (links to drawer).
- **Right column:** Heartbeat policy editor — fieldset of toggles + numeric inputs (interval, timeout, grace), with **Save** button. Renders next-wake / last-wake / failure-count read-only block beneath when policy is enabled.

Secrets UX clarification (per pushback): the secrets panel reads "Secrets attached to this agent's policy." A secret object lives at the project level; the panel lists names referenced by `heartbeat_policy.secretNames`. Unbinding removes the name from the policy, never the secret itself. Deleting the secret entirely is done from the secrets-management surface (deferred — the existing project-secrets API is enough for phase 1, accessed only via the agent binding form).

### 4.6 Versions (`#/versions`)

Simple list scoped to active workspace. Existing data from `GET /api/projects/:id/versions`. Each row: version number, snapshot ref short SHA, file count, created time, source (brief/task/run id when available), Promote button. Promote uses `<ConfirmModal>` with impact:

> "Restoring v3 will reset the workspace working tree to snapshot abc1234. Files generated since v3 that are not in that snapshot will be removed."

Type-to-confirm: `promote v3`.

### 4.7 Workspaces (`#/workspaces`)

The existing `screens/home.js` content moved here verbatim, minus the "Latest workspace" hero card. Adds a small "Switch to overview" affordance per tile.

## 5. Backend additions

All five additions land in the daemon (`tmp/factory/src/`). No DB schema changes; in-process pub/sub; SQLite remains the source of truth.

| # | Endpoint / change                                          | File                          |
| - | ---------------------------------------------------------- | ----------------------------- |
| 1 | `GET /api/activity?projectId=&limit=&since=` (project-scoped already exists; allow `since=<ms>` and remove project requirement so `projectId` is optional → omitting returns global) | `src/server.js`, `src/db.js`  |
| 2 | `GET /api/activity/stream?projectId=&limit=25` — SSE. Emits last `limit` events from DB on connect, then live events. Honors `Last-Event-ID`. | `src/server.js`, new `src/activity-bus.js` |
| 3 | `GET /api/agents/:id/readiness?projectId=:pid` — synthesized facts (returns booleans + reason strings; the UI does the wording) | new `src/readiness.js`        |
| 4 | Confirm `runs.statusBody()` includes `wakeupReason`, `coalescedCount`, `taskId`. Add if missing. | `src/run-service.js`          |
| 5 | `appendActivity()` publishes to the new `activityBus` after the DB insert. | `src/db.js`                   |

### `src/activity-bus.js` shape

Single in-process `EventEmitter`. `publish(event)` notifies all subscribers. Subscribers get an unsubscribe handle. Server's SSE endpoint:

1. On connect, query `listActivityEventsDb({ projectId, limit })` and write each as `id: <event.id>\ndata: <json>\n\n`.
2. If client sent `Last-Event-ID`, replay events with `id > Last-Event-ID` matching the project filter.
3. Subscribe to the bus; for each event, if it matches the project filter (or no filter), write to the response.
4. On `req.close`, unsubscribe.

Caveat (already accepted by user): events emitted before this daemon process started exist only in the DB; the replay-on-connect step covers them.

### Readiness contract

```json
{
  "agentId": "codex",
  "checks": [
    { "id": "adapter_available", "ok": true,  "detail": "codex-cli detected at /usr/local/bin/codex" },
    { "id": "workdir_valid",     "ok": true,  "detail": "/path/to/workspace" },
    { "id": "policy_valid",      "ok": true,  "detail": null },
    { "id": "secrets_present",   "ok": false, "detail": "missing: GEMINI_KEY" },
    { "id": "last_run_ok",       "ok": true,  "detail": "succeeded 14:32:01" },
    { "id": "snapshot_present",  "ok": true,  "detail": "v3 abc1234" }
  ],
  "passing": false
}
```

The frontend chooses display strings; backend supplies facts.

## 6. Frontend component inventory

```
web/src/screens/
  overview.js                 # composes 5 cards
  tasks-board.js              # 4 columns, click-to-open drawer
  versions.js                 # list + promote
  workspaces.js               # demoted home tiles
  agent-detail.js
  stub.js                     # for #/runs, #/artifacts, #/activity, #/runtime

web/src/ui/
  cards/tasks-summary-card.js
  cards/active-runs-card.js
  cards/agents-card.js
  cards/risks-card.js
  cards/activity-tail-card.js
  task-drawer.js
  run-inspector-drawer.js
  agent-readiness-checklist.js
  heartbeat-policy-form.js
  agent-secrets-binding.js
  wake-button.js              # handles coalesced response, error display
  confirm-modal.js            # shared
  activity-row.js             # shared event renderer with stable deep-link map
  activity-feed.js            # subscribe + render

web/src/controllers/
  router.js                   # hash router; entity-route mapping table lives here
  activity-stream.js          # single SSE client; fan-out to subscribers
  workspace-context.js        # active workspace persistence + change events

web/src/lib/
  poll-on-visible.js          # setInterval gated by document.visibilityState
  readiness-display.js        # selector: backend facts → display strings
  api.js                      # extended with new endpoints
```

### Files demoted / deleted

- `screens/home.js` → renamed to `screens/workspaces.js` (content largely intact; remove the "next actions" auto-suggester that assumes chat is the entry point).
- `ui/workspace-dashboard.js` → split into the new cards. Delete after migration.
- `controllers/run.js` chat flow stays for the existing command bar but becomes secondary; no changes needed in phase 1 beyond ensuring it doesn't drive the default route.

## 7. Realtime architecture

| Concern                  | Mechanism                                                 |
| ------------------------ | --------------------------------------------------------- |
| Activity events          | Single SSE: `/api/activity/stream`. Frontend client `controllers/activity-stream.js` is the only consumer. Cards subscribe via `activityStream.on(filterFn, handler)`. **No per-card bespoke streams.** |
| Run event stream         | Per-run SSE: existing `/api/runs/:id/events`. Used only by run inspector drawer. |
| Tasks list               | `pollOnVisible(load, 5000)`; invalidate immediately when an `activity-stream` event with `entityType=task` is received. |
| Active runs list         | `pollOnVisible(load, 2000)`; per-row elapsed counter is a local interval (no API calls). |
| Agents list / readiness  | `pollOnVisible(load, 10000)`. |
| Daemon status pill       | Existing implementation; no change. |

`pollOnVisible(fn, intervalMs)`:

```js
export function pollOnVisible(fn, intervalMs) {
  let timer = null;
  const tick = () => { if (document.visibilityState === "visible") fn(); };
  const start = () => { if (timer) return; tick(); timer = setInterval(tick, intervalMs); };
  const stop  = () => { if (timer) { clearInterval(timer); timer = null; } };
  document.addEventListener("visibilitychange", () => document.visibilityState === "visible" ? start() : stop());
  start();
  return stop;
}
```

## 8. Guardrails

Every destructive or hard-to-reverse action goes through `<ConfirmModal>`. No new `window.confirm` calls in any new file. Existing `window.confirm` usages in unchanged files are not migrated in phase 1.

| Action                                | Impact summary shown                                   | Type-to-confirm |
| ------------------------------------- | ------------------------------------------------------ | --------------- |
| Delete workspace (existing flow, migrated) | "Removes N files, M agents, K runs, L versions"  | `delete <name>` |
| Promote non-latest version            | "Resets working tree to snapshot <sha>; new files lost" | `promote v<n>` |
| Delete a task with runs               | "Deletes task and unlinks N runs (runs preserved)"     | none            |
| Unbind a secret from an agent's policy| "Agent will not receive <NAME> on next run"            | none            |

## 9. Testing strategy

### node:test (unit-ish)

- `router.test.js` — parse, build, redirect rules, fallback for unknown routes
- `readiness-display.test.js` — backend facts → strings; passing rollup logic
- `activity-row.test.js` — entity type → href map (the table in §3); fallback when entity unknown
- `wake-response.test.js` — pure function that turns wakeup API response into UI directives (button label, drawer open, error)
- `poll-on-visible.test.js` — uses fake timers + a mock `document.visibilityState`

### Playwright (smoke / e2e — keep small)

Two tests max:

1. **Overview renders** — boot daemon with a seeded workspace, visit `#/overview`, assert all 5 cards mount, no console errors, activity SSE connects.
2. **Wake flow** — create a task via API, open drawer, click Wake; assert task transitions to `in_progress`, run inspector drawer auto-opens, run shows status `active` then `succeeded` (uses the mock-agent runtime).

### Integration (existing harness)

- New test: `tests/wakeup-policy.test.js` — POST wakeup with policy disabling `on_demand` returns 400 with policy error; coalesce path returns `coalesced: true` with run id.

## 10. Process / branch / worktree plan

### Step 0 — secure backend primitives in the worktree base (CRITICAL)

The current `tmp/factory/` working tree contains untracked work that the design depends on (`src/`, `scripts/`, `tests/`, `mock_systems/`, `docs/`, `.gemini/`). Local `main` is also behind `origin/main` by 10 commits, so a naive `git worktree add` from `origin/main` would lose both the local commits and the untracked work.

Before creating the worktree:

1. From `tmp/factory/`: stage and commit the daemon work to local `main` (split into reasonable commits: db schema + tasks/wakeups/activity-bus primitives + secrets + heartbeat policies + scripts + tests + docs/.gemini). Do not push.
2. Resolve the `main vs origin/main` divergence (likely a rebase onto `origin/main` or a merge — to be decided when we see the 10 commits).
3. Create the worktree from local `main` HEAD: `git worktree add ../wt/operator-console-phase-1 -b operator-console-phase-1`.

Step 0 is its own sub-spec; it is the first item in the implementation plan, with explicit user approval before any commit.

### Branch & merge

- Branch: `operator-console-phase-1`
- Base: local `main` HEAD after Step 0
- Merge: single PR to `main` at end of phase. Squash or merge-commit to be decided per project convention.

### Commit author

Per `MEMORY.md`: no Co-Authored-By trailer; author email `vamsiramakrishnan@gmail.com`.

## 11. Risks & open questions

- **Step 0 is non-trivial.** Committing untracked subsystems requires understanding what's intended to be in main vs. local-only. Mitigation: present a commit plan for user approval before executing.
- **`runs.statusBody()` may not include `coalescedCount` / `taskId`.** Verify in implementation; trivial to add if missing.
- **SSE behind reverse proxies.** Local-only daemon, so not an issue in phase 1; flag for production hardening later.
- **`Last-Event-ID` reconnect requires DB queries by id-range.** `activity_events` has no PK ordering guarantee unless we use `created_at`. Plan: use `created_at` as the SSE event id (string). Acceptable resolution mismatch (1ms collisions) is fine for replay.

## 12. Acceptance criteria

Phase 1 is "done" when:

- All routes in §3 navigate without errors.
- Overview renders 5 cards with live data on a seeded workspace.
- Tasks board renders 4 columns, drawer opens on click and on deep-link, Wake action starts a run or coalesces correctly.
- Run inspector drawer opens from Active Runs, task drawer, activity row, and `#/runs/:id` deep-link; cancel button works for active runs.
- Agent detail page edits heartbeat policy and secret bindings; readiness checklist reflects backend facts.
- Versions page lists snapshots and promotes with confirmation.
- Workspaces page replaces the old home; landing logic in §3 works.
- Both Playwright smoke tests pass headless.
- No `window.confirm` calls in any file under `web/src/screens/`, `web/src/ui/cards/`, `web/src/ui/task-drawer.js`, `web/src/ui/run-inspector-drawer.js`, `web/src/ui/agent-*.js`, or `web/src/ui/confirm-modal.js`.
- No per-card SSE streams for activity events; all subscribe via `controllers/activity-stream.js`.

## 13. Out of scope — phase 2 / phase 3 backlog

- **Phase 2:** Full Runs page with history & filters; full Activity page with filters and entity-type chips; Artifacts page with provenance; Runtime/health page with adapter contracts and preview process list; cross-workspace counts in workspace selector.
- **Phase 3:** Diff viewer for versions; secrets at non-project scope; budget/cost surfaces; per-task wakeup automation rules; drag-to-reorder on the tasks board; multi-select on the tasks board; export of activity events as audit log.

## 14. Glossary

- **Wakeup** — a request to start (or coalesce into) a run on a specific agent for a specific reason.
- **Coalesced** — a wakeup that merged into an already-active run for the same `(agentId, selectedAgentId)` pair; no new process spawned.
- **`selectedAgentId`** — id of the configured agent in the `agents` DB table (has policy, assigned tasks, scoped secrets).
- **`agentId`** — id of the runtime adapter (`codex`, `gemini`, `claude`, `mock`); the executable that runs the agent.
- **Heartbeat policy** — per-agent rules: scheduled interval, which wakeup reasons are enabled, timeout/grace, scoped secret names.
- **Readiness** — derived "is this agent configured to work" rollup of 6 facts.
- **Activity event** — append-only audit row written by the daemon for every state-changing action.
- **Operator** — the user; the phase-1 UI is built for them, not for the agents.
