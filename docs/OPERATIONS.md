---
title: Operations
nav_order: 6
layout: default
---

# GE Agent Factory — Operations

The canonical runbook for deploying the factory and shipping agents. Everything
is driven by `bun tools/ge.mjs` (`ge`). Config resolves: flags > env > `.ge.json`
> terraform outputs > gcloud discovery.

Use this page when the question is operational: how to stand up the platform,
what each cloud component owns, which stage failed, how local and remote mode
split responsibility, and how to recover without inventing a one-off path.

## Components

| Component | Cloud Run service | Role |
|---|---|---|
| Gateway | `ge-agent-factory-gateway` | Scaffolds each agent workspace in-process; enqueues the pipeline. Browser/UI entry (IAP-protected). |
| Worker | `ge-agent-factory-worker` | Runs non-release stages; dispatches release stages to Cloud Build. Invoked by Cloud Tasks (OIDC). |
| Builder image | `…/ge-agent-factory/ge-agent-factory-builder` | Shared toolchain (uv, gcloud, agents-cli) + warm uv cache, so per-agent builds skip installs. |

Supporting: Cloud Tasks queue `ge-agent-factory-stages`, Pub/Sub topic
`ge-agent-factory-events`, bucket `<project>-ge-agent-factory`, Firestore
(default DB), service accounts `ge-agent-factory-runner` / `-builder` /
`-runtime`, Artifact Registry repo `ge-agent-factory`.

## Stage graph (per agent)

`plan → generate_workspace → generate_data → package_data → harness_refine →
validate → preview → plan_deploy → load_data → deploy_runtime → poll_runtime →
register_tools → publish_enterprise → verify_live`

Release stages (`validate`, `preview`, `deploy_runtime`, `poll_runtime`,
`publish_enterprise`) run in Cloud Build via `cloudbuild.factory-stage.yaml`;
the rest run on the worker. `validate` runs the pytest smoke test and (default
on) `agents-cli eval` with an achievable, reference-free `eval_config.json`.

`harness_refine` runs **Antigravity review+refine** (with the best ADK skills) on
the generated workspace — the same pass local builds run — so cloud and local
produce identically-refined code, then re-gated by `validate`. It runs with
`--soft`, so a Vertex outage or harness error degrades to the deterministic code
instead of failing the run; it is never a hard dependency. On by default for all
363; opt out per run with `ge agents build --no-refine` (or `REFINE=0`).
`ge agents ship` resumes at `load_data` (already refined locally) and skips it.

## Lifecycle

```bash
# 1. Configure
export GEMINI_ENTERPRISE_APP_ID=projects/<num>/locations/global/collections/default_collection/engines/<app>
bun tools/ge.mjs init

# 2. Stand up infra + images + services (Terraform-managed)
bun tools/ge.mjs up            # = infra apply → build → re-apply(images) → init → doctor
#    …or piecemeal:
bun tools/ge.mjs images build builder # shared toolchain image (one-time / on toolchain change)
bun tools/ge.mjs images deploy all    # gateway + worker @ 8 vCPU / 32Gi

# 3. Verify before spending
bun tools/ge.mjs doctor        # every failure prints the exact fix command

# 4. Prove one agent, then the fleet
bun tools/ge.mjs agents build --canary
bun tools/ge.mjs agents status --watch
bun tools/ge.mjs agents logs <runId> --stage validate   # on failure
bun tools/ge.mjs agents build --all
bun tools/ge.mjs agents status --watch

# 5. Persist generated code
bun tools/ge.mjs agents sync --ids account-reconciliation-agent --local
bun tools/ge.mjs agents sync --ids account-reconciliation-agent --local --remote <git-url> --push
```

Run bare `ge` anytime for a status board (mode · planes ✓/○ · next command). Old
verbs (`provision`/`deploy`/`build`/`status`/`logs`/`sync`) still work as aliases.
All commands accept `--json` for scripting/CI; `agents build`/`status` accept
`--no-proxy` if you're already inside an authenticated network.

## Data + tool planes

Agents operate on real Google Cloud stores via two layers provisioned alongside
the factory. Run these once per project, before/with the fleet provision:

```bash
# Data plane — shared stores + per-agent IAM (GCS, BigQuery, AlloyDB, Bigtable, Firestore).
bun tools/ge.mjs data up        # terraform apply (stores + IAM) → merge coords into .ge.json
bun tools/ge.mjs data doctor    # bucket / AlloyDB DSN secret / Bigtable / BigQuery reachable

# Tool plane — MCP servers the agents call (see docs/MCP.md for the full model).
bun tools/ge.mjs mcp deploy     # 5 per-department Cloud Run MCP services (fleet-level, once)
bun tools/ge.mjs mcp doctor     # services Ready + Agent Registry API/CLI
```

Per-agent objects (BQ dataset `agent_<id>`, Firestore DB `agent-<id>`, Bigtable
table `agent_<id>`, GCS prefix `agents/<id>/`) are created at the `load_data`
stage. Each agent registers against its department MCP URL (`?agent=<id>`) in the
`register_tools` stage. Runtime tool backend is chosen by `GE_DATA_BACKEND`
(`fixtures` local / `mcp` cloud); agents authenticate with the Agent Runtime
**agent identity** (principalSet IAM; SA fallback). Ordering: `data up` →
`mcp deploy` → `provision`.

## Modes: local vs remote

`ge` has two first-class modes, set once with `ge mode local|remote` (persisted in
`.ge.json`, default `remote`) and overridable per command with `--local`/`--remote`.
Bare `ge` shows the active mode and what the client machine does.

There is a hard **build boundary**: everything up to validate/preview is pure
computation (runs anywhere); everything after touches GCP. Local mode does the
former on your machine and stops at the boundary.

| Stage | **local** (your machine) | **remote** (cloud factory) |
|---|---|---|
| plan → generate → package | client (deterministic) | Cloud Run worker |
| harness review/refine (Antigravity) | client (Vertex) | Cloud Run worker (Vertex) |
| validate · preview | client (agents-cli) | Cloud Build |
| ── build boundary ── | local stops here by default | |
| data plane (Terraform), MCP services | cloud-only | Terraform / Cloud Run |
| load_data · deploy_runtime · register · publish | optional via agents-cli (Vertex) | Cloud Build |

**Client requirements** — local: uv, python 3.11, agents-cli, Antigravity SDK,
shared uv cache, Vertex auth, git. remote: just gcloud auth + network (the cloud
builder image carries the toolchain).

`make deps` (run by `make bootstrap`) creates a repo-local **`.venv`** via uv and
installs the Antigravity SDK into it — no `pip --break-system-packages` into a
PEP-668 system Python (the "airlock"). The harness driver auto-resolves its
interpreter to `.venv/bin/python` (override: `GE_HARNESS_PYTHON`; falls back to
`python3`, e.g. in the worker image). The per-agent uv venvs (for running each
agent's pytest/eval) are separate and unaffected.

```bash
ge mode local                  # switch; bare `ge` confirms it
ge doctor                      # mode-aware: local → toolchain-first; remote → factory-first
ge agents build --canary       # one agent in the active mode
ge agents build --all --warm   # local: --warm pre-fills the shared uv cache
ge agents build --remote --canary   # one-off override without switching mode
ge agents sync --ids account-reconciliation-agent --local
ge agents sync --ids account-reconciliation-agent --local --remote <git-url> --push
```

Local builds stop at the build boundary (`previewed`) and print the next (cloud)
step. Workspaces land in `.ge/factory/workspaces/` and are indexed by
`.ge/factory/workspaces.json`.

**Hand off to the cloud (`ge agents ship`).** Build locally, deploy remotely without
re-generating: `ship` tars + uploads each prebuilt workspace and submits a
deploy-only run that starts at `load_data` (→ deploy → register → publish),
consuming the prebuilt archive. So the cloud deploys exactly what you validated —
no duplicate generation or Antigravity cost.

```bash
ge agents build --local --canary   # build + validate on this machine
ge agents ship --canary            # cloud runs load_data → deploy → register → publish
ge agents ship --ids ws-a,ws-b     # specific local workspaces
ge agents ship --start-stage deploy_runtime   # skip load_data if stores already loaded
```

Fallback (zero setup): `ge agents build --remote --ids …` re-runs generation in the
cloud and deploys — simpler, but redoes the Antigravity refine and deploys the
cloud's artifact rather than your exact local one.

The generated agent code goes to a **dedicated repo** — set `agentsRepo` in
`.ge.json` (or `GE_AGENTS_REPO`, or `--remote <git-url>`). `agents sync` in local
mode clones that repo into `.agents-repo/`, drops the workspaces in (minus
`.venv`/`node_modules`), commits, and pushes — so the monorepo isn't pushed. With
no repo configured it falls back to `generated-agents/` in this repo.

From the console, Fleet bulk selection and Agent Detail's **Code sync** panel
drive the same `ge agents sync` path. The selected agent ids are passed through
to the CLI, so a one-agent sync never silently exports the entire local factory
workspace set.

## Local state

The canonical local state root is `.ge/`:

| Path | Purpose |
|---|---|
| `.ge/runtime/` | daemon task records, events, interaction responses, resume plans |
| `.ge/missions/` | mission graph workspaces, mock data, Snowfakery output, simulator overlays |
| `.ge/interviews/` | generated interview specs before/after registry review |
| `.ge/factory/workspaces/` | local generated agent workspaces |
| `.ge/factory/runs/` | local factory run metadata and logs |
| `.ge/skills/` | synced harness skill manifest |
| `.ge/cache/` | shared uv/Snowfakery/tool caches |
| `.ge/console/` | console job records |

Use `ge state paths` to inspect this layout. Use `ge state reset --yes` when you
want to clear generated local state and start clean; `make setup` recreates deps,
skills, caches, and the daemon.

Under the hood local mode delegates to `ge-harness factory plan` + `factory run
--vertex` (Antigravity SDK harness). Both surfaces — CLI and the MCP tools
(`factory_provision`/`factory_sync` with `local: true`) — share `factory-core`.

## Deploy contract (who builds, who deploys)

One rule: **Cloud Build builds images; Terraform owns Cloud Run config.**

- **Build images** — `ge images build` (or the optional `cloudbuild.yaml` push trigger)
  builds + pushes immutable tags to Artifact Registry. It does **not** deploy.
- **Bind + deploy** — `ge infra apply --gateway-image <tag> --worker-image <tag>`
  (run by `ge up`) points the Cloud Run services at those tags. Terraform is the only
  owner of env vars, ingress, service account, scaling, CPU/memory, and IAM.
- **Where env vars live** — Terraform (`cloud_run.tf`), never `gcloud run deploy
  --set-env-vars`. A push no longer clobbers Terraform-managed env.
- **Emergency deploy** — `ge images deploy` rebuilds + binds in one step; for a pure
  rollback use Cloud Run revision traffic (`gcloud run services update-traffic`).

## Auth model

Gateway/worker are `--no-allow-unauthenticated`. `ge` auto-runs
`gcloud run services proxy` for the duration of a gateway call, so you don't mint
tokens by hand. Cloud Tasks → worker uses OIDC as `ge-agent-factory-runner`
(needs `run.invoker` on the worker — `doctor` checks this). This domain blocks SA
impersonation, so programmatic IAP access uses the proxy, not minted tokens.

## Access posture (ingress + auth)

Two tiers, both **external ingress, never `allUsers`**:

- **gateway + worker** — `INGRESS_TRAFFIC_ALL` but **authenticated-only** via IAM/OIDC,
  **no IAP**. Cloud Tasks invokes the worker with an OIDC token as the runner SA;
  the `ge` CLI reaches the gateway via the auto-managed `run.invoker` proxy. (The
  worker must stay IAP-free or Cloud Tasks breaks.) `allUsers` is granted only behind
  the explicit `allow_public_gateway=true` escape hatch (off by default).
- **console + presentation (the human UIs)** — **direct Cloud Run IAP**
  (`enable_iap=true`): external, but only IAP-authenticated principals in
  `iap_members` (default `["domain:google.com"]` — all Googlers) may reach them.
  Set `console_image` / `presentation_image` to create the services
  (`installer/terraform/ui_services.tf`); IAP enables `iap_enabled` on the service,
  grants the IAP service agent `run.invoker`, and grants each member
  `roles/iap.httpsResourceAccessor`. No load balancer, OAuth client, cert, or DNS.

  ```hcl
  # values.tfvars
  enable_iap         = true
  iap_members        = ["domain:google.com"]            # or ["group:my-team@google.com"]
  console_image      = "us-central1-docker.pkg.dev/<proj>/ge-agent-factory/console:<sha>"
  presentation_image = "us-central1-docker.pkg.dev/<proj>/ge-agent-factory/presentation:<sha>"
  ```

**Legacy LB+IAP** (`iap_lb.tf`) is opt-in via `enable_iap_lb=true` + `domain` if you
need a custom hostname; most setups don't. For programmatic runs, keep platform IAP
off the gateway/worker (IAM/OIDC, not IAP) — `doctor` warns if it's on and prints `--no-iap`.

## Live rename cutover (ge-factory → ge-agent-factory)

The hosted demo is hand-managed. Rename the live stack by standing up the
new-named services **in parallel**, then cutting over — never rename in place.

> **Shortcut:** `ge cutover` automates steps 1–3 (new SAs + IAM + queue/topic/AR
> repo, then build/deploy/wire). Plan-by-default — `ge cutover` prints the exact
> gcloud for your project; `ge cutover --apply` runs it; then `ge doctor` verifies
> and prints fixes for anything left. Steps 5–6 (IAP/DNS cutover, deleting the old
> stack + repo) stay manual.

1. **New identities/infra** (additive): create `ge-agent-factory-runner` /
   `-builder` / `-runtime` SAs, the `ge-agent-factory-stages` queue, the
   `ge-agent-factory-events` topic, and the `ge-agent-factory` AR repo. Grant the
   new runner SA `run.invoker` on the (soon) new worker + Cloud Tasks enqueuer.
2. **Build images** into the new repo: `ge build builder` then `ge build`.
3. **Deploy new services** `ge deploy all` with `GE_AGENT_FACTORY_*` env pointing
   at the new queue/bucket/worker URL.
4. **Verify** `ge doctor` against the new stack (fresh `.ge.json`).
5. **Cut over IAP/DNS** to the new gateway backend/NEG; keep old until verified.
6. **Delete old** services, SAs, queue, topic, IAP LB, trigger, and the old
   Cloud Source repo after a clean soak.

Data is preserved: the bucket is already `<project>-ge-agent-factory` and
Firestore is unchanged — point the new stack at them. Drain in-flight runs before
cutover (the OIDC audience + queue change breaks them); run the 363 *after*, on
the new stack.

## Troubleshooting (failure modes we've actually hit)

| Symptom | Cause | Fix |
|---|---|---|
| Container fails to start, `Cannot find module ./src/server/iap-jwt.js` | Dockerfile didn't copy a server module | ensure `Dockerfile` copies it; redeploy |
| `Missing required environment variable: GE_AGENT_FACTORY_WORKER_URL` | Cloud Run env not bound by Terraform | `ge infra apply` (Terraform owns env now; Cloud Build is builds-only) |
| 503 / `Memory limit exceeded` | gateway too small for in-process scaffolding | `ge deploy gateway` (8/32 default) |
| `Invalid IAP credentials: JWT 'email' claim isn't a string` | platform IAP on the service | `gcloud run services update <svc> --no-iap` (use the proxy) |
| stuck at `queued` | Cloud Tasks → worker failing | check worker IAP/`run.invoker`; `ge logs` |
| `pytest: file or directory not found: tests/test_smoke.py` | scaffolder didn't emit the smoke test | fixed in `factory from-usecase` |
| `Extra 'eval' is not defined` | missing `eval` extra in `pyproject.toml` | fixed in scaffolder |
| eval `extra_forbidden … metadata` / `string indices` | evalset not ADK-schema-conformant | fixed; contract metadata lives in `evals/golden.json` |
| `Legacy configuration detected in pyproject.toml` | no `agents-cli-manifest.yaml` | fixed; scaffolder emits the manifest |
| `npm ci … requires package-lock.json` | worker image used `npm ci`, repo is bun | worker Dockerfile uses `npm install` |

`ge logs <runId> --stage <stage>` pretty-prints the persisted stage result
(stderr, exit code, Cloud Build log URL) — start there for any failed stage.

## Console

The **third surface** over `factory-core` (CLI · MCP · Console). A web ops console
in `apps/console` for observing the factory and executing bulk operations — fleet
builds, status monitoring, agent-level detail with live logs, doctor checks, and
activity audit.

Run locally with `bun --cwd apps/console run dev` (port 18260) or `bun --cwd
apps/console run start` (production server). The backend serves `/api/ge/*`
endpoints (`status`, `doctor`, `fleet`, `agents/:id`, `logs` SSE) over
`factory-core`; the React frontend opens to the Overview status board (mode ·
planes · fleet progress · next step), with Fleet (bulk build/ship/sync), Agent
detail (stage pipeline + live LogStream + downloadable artifacts), Doctor, and
Activity views.

Live logs come from the NDJSON bus (`tools/lib/events.mjs`): remote workers tee
stage events to GCS, local factory runs write `.ge/factory/factory-events.jsonl`
plus per-run logs under `.ge/factory/runs/`, and daemon tasks write event streams
under `.ge/runtime`. The API gateway fans out SSE streams to connected clients;
console components consume them for real-time progress.

In production, deploy the console read-only via `GE_CONSOLE_READONLY=1` — agent
actions (build/ship/sync) delegate to the cloud gateway instead of running
in-process. For builds, run `bun --cwd apps/console run build` then copy
`dist/` + `src/server/` to the deploy container (Dockerfile pending; current
dev-only mode doesn't ship to Cloud Run yet).
