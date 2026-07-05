# WS4 — Remove blocking I/O from HTTP paths; finish the Hono strangler

**Status:** `[ ]` open
**Write-set:** `apps/presentation/src/server/factory-bridge.js` (the
`submitFactoryRun` function's `IS_PROD` branch only) · `apps/factory/src/server.js`
(the legacy if-ladder, ~line 1264-1386 as of 2026-07-05) · NEW
`apps/factory/src/routes/*.mjs` modules for whatever gets converted out of
the ladder · their tests
**Depends on:** nothing structurally. **Scheduled Wave 3 (last)** — largest
risk in the wave, deploy-adjacent, benefits from landing on ground WS1-3/5-6
have already settled. **Blocks:** nothing.

## Problem (verified 2026-07-05 — re-verify before editing; this is the
production request path, re-map line numbers with grep, do not trust stale
numbers)

Two related but separately-scoped findings: synchronous blocking calls
inside HTTP request handlers (latency/availability risk), and the
long-running Hono migration's last legacy branches (`apps/factory/src/server.js`
went from "~19 legacy branches" to ~4 regex-matched routes + `/api/chat` +
static fallback — most of the strangler is already done; this workstream
finishes the tail, it does not restart the migration).

### 4a. Blocking sync I/O + `execFileSync` in `submitFactoryRun`

`apps/presentation/src/server/factory-bridge.js`'s `submitFactoryRun`
(~line 492 onward), inside its `if (IS_PROD)` branch (~line 586-624):
- `mkdirSync(tempDir, { recursive: true })` (~586)
- `execFileSync("bun", cmdArgs, { stdio: "inherit", cwd: HARNESS_ROOT, env:
  generateEnv })` (~613) — runs the full `factory.mjs from-usecase`
  generator synchronously, blocking the event loop for the entire
  scaffolding run.
- `execFileSync("tar", ["-czf", tarPath, "-C", tempDir, "."])` (~620)
- `readFileSync(tarPath)` (~624) before uploading to GCS.

This function is reached from an HTTP POST handler (verify the exact route
binding at call time — it's the workspace-run-submission endpoint). Every
one of these calls blocks the whole Node process for the duration of a
full agent-workspace scaffold + tar + read, not just this one request.

### 4b. 25+ sync fs calls in `apps/factory/src/server.js` route handlers

The audit's citation (`server.js:239-243, :419-513, :985-1150`) predates
this session's Hono strangler progress — re-grep
`readFileSync\|writeFileSync\|mkdirSync\|execFileSync\|existsSync` inside
route-handler bodies (not module-load-time config reads, which are fine)
at implementation time; the exact line ranges above may already be
partially converted by the strangler routes
(`apps/factory/src/routes/catalog.mjs`, `routes/workspaces.mjs`,
`routes/runs.mjs`) — verify what's left in the legacy ladder specifically,
since that's this workstream's actual ground (4c), vs. what's already
inside the converted Hono route modules (a different, already-async
concern — don't duplicate work the strangler already did).

### 4c. The Hono strangler's last ~6 branches

`apps/factory/src/server.js:1157` mounts a Hono `apiApp` covering
`/api/health`, `/api/daemon/status`, `/api/systems`, `/api/departments`,
`/api/use-cases`, `/api/agents`, plus `createCatalogRoutes`/
`createWorkspaceRoutes`/`createRunRoutes` (full CRUD/tasks/secrets/wakeups/
files/terminal surface, per the comment at ~line 1245-1252). The raw
`http.createServer` handler falls through to Hono first (`honoResp` at
~line 1233-1240), using a `NO_ROUTE_MATCHED` sentinel header to distinguish
"no converted route matched" (fall through to legacy) from "a converted
route matched and legitimately returned 404" (return as-is) — read that
comment block (~line 1204-1213) in full, it explains a real correctness
subtlety you must preserve. What remains in the legacy ladder (~line
1264-1386 per the comment at ~1254-1263): `projectPreviewMatch`
(`/api/workspaces/:id/previews/adk-web`, POST/GET/DELETE), plus (per the
same comment block) `adkRunMatch`, `adkProxyMatch`, `runEventsMatch`,
`/api/chat`, and the static-file fallback. The comment explicitly says
these "still own SSE/streaming and upstream-proxying routes that are too
risky to strangle in this pass" — that "this pass" was a previous
workstream; this workstream IS the next pass.

## Target

`submitFactoryRun`'s prod path either runs off the request-handling thread
(job-runner pattern, matching how the rest of this repo handles
long-running work — see `tools/lib/factory-core.mjs`'s job-runner if one
exists, or the console's job-sentinel pattern in `ge-api.mjs`) or uses
async fs/`execFile` (non-blocking) equivalents throughout. The Hono
`apiApp` covers every remaining route except ones with a stated, verified
reason not to convert (e.g. genuinely stateful SSE that Hono in this
codebase's version can't yet stream — verify this claim, don't assume it,
before leaving anything behind again).

## Step 1 — verification net first

Neither 4a nor 4c has an existing behavior-parity oracle for "the response
this route returns is unchanged." Build one before changing anything:
- For `submitFactoryRun`: a test that drives the function with a mocked
  `IS_PROD=true` environment (stub `execFileSync`/`writeGcsFile`/
  `getAccessToken` — check `apps/presentation/src/server/factory-bridge.test.js`
  for the existing mocking pattern, reuse it) and asserts the exact
  `runRecord` shape / GCS writes / tar contents produced today, BEFORE any
  async conversion. This is your regression net.
- For the Hono conversion: a request-parity test per converted route
  (status code, headers, body) run against BOTH the old raw-http path and
  the new Hono route for every existing invocation shape (GET/POST/DELETE
  for `previews/adk-web`, the ADK run/proxy routes, `runEventsMatch`'s SSE
  framing, `/api/chat`, and the static fallback) — mirror whatever pattern
  `routes/catalog.mjs`'s or `routes/workspaces.mjs`'s own tests already use
  for their converted routes (read one before writing new ones; don't
  invent a new test style for this file).

## Step 2 — 4a: `submitFactoryRun` off the blocking path (`BEHAVIOR-CHANGE`)

Convert the `IS_PROD` branch's `mkdirSync`/`execFileSync`/`readFileSync`
calls to their async equivalents (`node:fs/promises`'s `mkdir`, `execFile`
promisified or `node:child_process`'s `execFile` with a callback→promise
wrapper, `readFile`). If the scaffold-generate-tar-upload sequence is
long-running enough that even async execution on the request thread is
undesirable (it likely is — `execFileSync("bun", cmdArgs, {stdio:
"inherit"...})` runs the FULL generator), prefer moving it behind whatever
job-runner/queue primitive the rest of the codebase already uses for
long-running work (grep for one before inventing a new one — the console's
`{ job: ... }` sentinel pattern in `apps/console/src/server/ge-api.mjs` is
the precedent to look at first, even though this is a different app).
State which approach you took and why in the PR description; this is
explicitly `BEHAVIOR-CHANGE` (the audit's own note: "not purely
behavior-preserving — flag it," carried over from `REFACTOR-HANDOFF.md`'s
queued-work item 3) — land it as its own commit.

## Step 3 — 4c: convert the remaining ~6 branches

For each of `projectPreviewMatch`/`adkRunMatch`/`adkProxyMatch`/
`runEventsMatch`/`/api/chat`/static-fallback: read what it actually does
today (streaming? proxying? both?) before converting. Add a new
`apps/factory/src/routes/*.mjs` module per logical group (mirror the
existing `routes/catalog.mjs`/`routes/workspaces.mjs`/`routes/runs.mjs`
split — group by resource, not by conversion order), `apiApp.route("/",
create*Routes({...}))` it into `server.js`'s existing Hono mount point
(~line 1195-1198), and delete the now-dead legacy branch from the
if-ladder. Preserve the `NO_ROUTE_MATCHED` sentinel discipline for any
route that can legitimately 404 (a converted route returning its own 404
must still set the header correctly if it re-uses `apiApp.notFound`, or
must NOT be caught by that fallback if it's a genuine "not found" from the
route's own logic — re-read the existing comment at ~1204-1213, this is
the one subtlety every prior conversion pass had to get right).

If any of the 6 branches turns out to have a REAL blocker (e.g. Hono's
streaming API in this repo's pinned version genuinely cannot express
`runEventsMatch`'s SSE framing without a rewrite of the SSE helper itself)
— verify the blocker concretely (write the failing attempt, note the exact
API gap), then convert what you can and leave that one behind with an
UPDATED comment explaining the specific, current blocker (not a copy of the
old "too risky to strangle in this pass" language, which is no longer
informative after this pass). Report the deviation; do not silently ship a
partial conversion as if it were complete.

## Definition of done

- [ ] `submitFactoryRun`'s regression test (Step 1) passes unchanged after
      Step 2's conversion (same `runRecord`, GCS writes, tar contents).
- [ ] `grep -n "execFileSync\|readFileSync\|mkdirSync\|writeFileSync" apps/presentation/src/server/factory-bridge.js`
      inside `submitFactoryRun`'s `IS_PROD` branch returns zero matches (or,
      if the job-runner approach was taken, the calls have moved out of the
      request-handling function entirely — verify by call-graph, not just
      grep).
- [ ] Every route-parity test from Step 1 passes for both old and new
      paths before the legacy branch is deleted, and passes against the
      NEW Hono-only path after deletion.
- [ ] `apps/factory/src/server.js`'s legacy if-ladder (~1264-1386 originally)
      contains only branches with a documented, current (not stale)
      technical blocker — count and name them in the PR description; if
      the count is 0, the ladder itself can be deleted (verify nothing else
      depends on the raw `http.createServer` wrapper existing before
      removing it).
- [ ] Full gate + `bun run test:gated` green.
- [ ] PR description states explicitly: "runtime-verified" only for
      whatever you actually drove end-to-end in this sandbox (likely
      nothing that touches real GCS/gcloud — this is deploy-adjacent, house
      rule 4 applies) vs. "parse/unit-verified."

## Forbidden

- Claiming runtime verification of the `IS_PROD` GCS-upload path or any
  `gcloud`/Agent Registry interaction — parse/unit-verify only, per house
  rule 4.
- Converting `/api/chat` or the SSE route "while we're at it" in a way that
  changes their wire format — byte-identical response shape is the bar,
  not an improvement.
- Deleting the raw `http.createServer` wrapper itself unless you've
  verified nothing (WebSocket upgrade, some other non-Hono-expressible
  concern) still needs it.
- Touching `apps/console/src/server/ge-api.mjs`'s `ROUTES` table — that's
  WS2's ground, a different app's route table.
- Starting this workstream before Wave 2 (WS2/WS3/WS6) has merged — it is
  scheduled last deliberately; if you're picking this up out of order,
  stop and confirm with the orchestrator first.

---
Worker protocol (inherited from `00-orchestration.md`): worktree forks from
origin/main with Waves 1-2 already merged; commit incrementally with the
repo's trailer convention; never push, never stash; final report is raw
data — branch, `git log --oneline`, each DoD item with its actual output,
deviations each justified in one line. A separate reviewer re-runs the DoD
before merge — for this workstream specifically, the reviewer should
independently re-drive at least one converted route's parity test from a
clean checkout, not just re-read the diff.
