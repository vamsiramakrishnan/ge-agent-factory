---
title: The factory line
parent: Concepts
nav_order: 1
layout: default
---

# The factory line

The factory is an **assembly line**. A business use case enters one end; a
generated, tested, deployed, and published agent comes out the other. Each
station does one job, writes one set of artifacts, and hands the workspace to the
next station. Nothing is magic and nothing is hidden — every stage leaves a
trail you can inspect.

## The stages

The stage graph is defined declaratively in
[`apps/factory/src/factory-orchestration.js`](https://github.com/vamsiramakrishnan/ge-agent-factory)
(`FACTORY_STAGE_GRAPH`). The line, in order:

| Stage | What it produces | Owner |
|---|---|---|
| `plan` | the factory plan | control plane |
| `generate_workspace` | the ADK workspace (`app/agent.py`, `app/tools.py`, `pyproject.toml`, manifest) | Cloud Run worker |
| `generate_data` | fixtures + a Snowfakery recipe | Cloud Run worker |
| `package_data` | the data package index, cloud data manifest, `mcp-tools.json` | Cloud Run worker |
| `harness_refine` | Antigravity review + refine reports | Cloud Run worker |
| `validate` | the validation report (pytest + lint) | Cloud Build |
| `preview` | a preview/smoke report | Cloud Build |
| `plan_deploy` | the deploy plan + cloud topology | control plane |
| `load_data` | per-agent stores loaded; load report | Cloud Run worker |
| `deploy_runtime` → `poll_runtime` | the deployed Agent Runtime + deployment metadata | Cloud Build / Cloud Tasks |
| `register_tools` | Agent Registry registration | Cloud Run worker |
| `publish_enterprise` | Gemini Enterprise registration | Cloud Build |
| `verify_live` | a live-verification report | Cloud Run worker |

Conceptually the line is three movements:

```
  AUTHOR & BUILD            VALIDATE & REFINE              RELEASE
  ───────────────           ─────────────────              ───────
  plan                      harness_refine (Antigravity)   plan_deploy
  generate_workspace        validate (pytest + lint)       load_data
  generate_data             preview (smoke)                deploy_runtime → poll_runtime
  package_data                                             register_tools
                                                           publish_enterprise
                                                           verify_live
        └──────── the "build boundary" ────────┘
```

## The build boundary: local build vs remote release

The **build boundary** is the conceptual line between *making* an agent and
*releasing* it to the cloud.

- **Local mode** (`make mode-local`, `make provision-local CANARY=1`) runs the
  build-and-validate movement **on your machine**, up to and including `preview`.
  No cloud credentials are needed — the agent is generated, its data is
  synthesized, it is refined by the Antigravity harness, and it is gated by
  pytest and `agents-cli eval` against fixtures. This is the everyday loop.
- **Release stages** touch *your* Google Cloud project and therefore run
  differently. In
  [`factory-worker.js`](https://github.com/vamsiramakrishnan/ge-agent-factory) a
  small set is marked `RELEASE_STAGES` (`validate`, `preview`, `deploy_runtime`,
  `poll_runtime`, `publish_enterprise`) and is dispatched to **Cloud Build** via
  `cloudbuild.factory-stage.yaml` for build logs, provenance, and long-running
  toolchain isolation. Operators do not run deploy or publish by hand; the worker
  dispatches them.

The same workspace flows across the boundary unchanged — local fixtures simply
give way to the cloud data and tool planes (see
[Agents and ADK](./agents-and-adk.html) for the `GE_DATA_BACKEND` switch).

## The durable control plane

Early on, a build was a long-lived process on a laptop — if it died, the run
died. The factory now runs on a **durable control plane** (ADR 0001) so a run
survives restarts, can be followed live, and resumes itself stage by stage.

```
            ┌──────────────┐   enqueue next stage   ┌──────────────┐
            │  Cloud Tasks │ ─────────────────────▶ │   worker     │
            │  (per-stage  │   OIDC-authed HTTP      │ (Cloud Run / │
            │   queue)     │ ◀───────────────────── │  Cloud Build)│
            └──────────────┘   schedule +30s/+120s   └──────┬───────┘
                                                            │ records every event
                                                            ▼
                                                   ┌──────────────────┐
                                                   │ Firestore        │  ← console subscribes
                                                   │ run ledger       │    (onSnapshot, live)
                                                   │ factoryRuns/{id} │
                                                   └──────────────────┘
                                                   + GCS artifacts/logs, Pub/Sub fanout
```

The key ideas:

- **One stage at a time, self-advancing.** A worker runs *one* stage, records the
  result, and **enqueues the next stage as a new Cloud Task** (only if it is at or
  before the run's `targetStage`). Long cloud operations (a Cloud Build, an Agent
  Runtime deploy) are not blocked on — the worker submits the operation, records a
  `waiting`/`submitted` event, and schedules a poll task (`+30s`, `+120s`) that
  re-enters the same stage to check status. This is why a run is durable: its state
  lives in the queue and the ledger, never in a process.
- **Every event is recorded twice.** Each stage writes to the Firestore **run
  ledger** (`factoryRuns/{runId}/items/{itemId}/stages/{stage}` plus a run-level
  `events` stream) *and* publishes to Pub/Sub. The console subscribes to the
  ledger with `onSnapshot` for live status, and Phase 3 mirrors streamed stdout as
  throttled `stage_log` frames so the Run Drawer shows live command output even for
  remote runs.
- **Artifacts are immutable.** Each stage tars the workspace and uploads it (plus a
  result JSON and NDJSON logs) to a GCS bucket; the next stage restores that
  archive. The workspace is the unit that flows down the line.
- **Identity is least-privilege.** Cloud Tasks delivers to the worker with an OIDC
  token minted for the runner service account; the worker carries a bounded set of
  roles. See [Security and the Agent Gateway](./security-and-the-agent-gateway.html).

The retry metadata on each stage (`RETRY_POLICIES`) describes how a stage *may*
safely be retried by an operator — it is **metadata, not an automatic retry
engine**. Nothing re-executes a stage from those values today.

## Where to drive it from

- **`make` targets** are the human entry points: `make console` opens the operator
  UI; `make mode-local` + `make provision-local CANARY=1` builds one agent locally
  to the boundary; `make bootstrap CANARY=1` stands up the planes and proves one
  agent end to end. Run `make help` for the grouped menu or `make next` for a
  status-based recommendation.
- The **console** is the day-to-day UI (Pipeline · Fleet · Activity · Doctor) with
  a live Run Drawer over the same ledger.

See the [Reference](../reference/) for the full `make` and `ge` command surface,
and the [Cookbooks](../cookbooks/) for "build a canary" and "ship to the cloud".
