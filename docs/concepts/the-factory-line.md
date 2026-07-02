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

### Stations vs. milestones — two stage vocabularies, one line

You will meet **two different stage name sets** and they are both correct —
they name different things. The table above lists **stations** (verbs — the
work a stage *does*), from `FACTORY_STAGE_GRAPH` in
`apps/factory/src/factory-orchestration.js`. Everything that reports
*progress* — `ge agents status`, `ge ledger plan`, the run ledger, the
pipeline state machine — uses **milestones** (past-tense states an item has
*reached*), from `LEDGER_STAGES` in `packages/run-ledger/src/store.mjs`.
Reading `generate_workspace` here and then seeing `created` in
`ge agents status` is the same item, described from the other side:

| Station (does the work) | Milestone recorded (what status reports) |
|---|---|
| `plan` | `planned` |
| `generate_workspace`, `generate_data` | `created` |
| `package_data` | `data_packaged` |
| `harness_refine` | `harness_reviewed`, then `harness_refined` |
| `validate` | `validated` |
| `preview` | `previewed` — the **build boundary** in both vocabularies |
| `plan_deploy` | `deploy_planned` |
| `load_data` | (no dedicated milestone — release-movement prep) |
| `deploy_runtime`, `poll_runtime` | `deploying`, then `deployed` |
| `register_tools` | `registered` |
| `publish_enterprise` | `publish_planned`, then `published` |
| `verify_live` | (no dedicated milestone — verification report artifact) |

Milestones are listed in the ledger's canonical order (its reducer only ever
advances an item forward through that list); station order above is the cloud
line's execution order — the two orderings differ slightly in the middle
movement, which is expected, not drift.

Conceptually the line is three movements, with the **build boundary** sitting
between the first two and the third — everything above it is pure computation;
everything in **Release** touches your Google Cloud project. Stages shaded
green run in Cloud Build rather than on the worker directly.

<p align="center">
  <img src="../assets/diagrams/factory-line.svg" alt="The factory line: Author and Build, Validate and Refine, Release, with the build boundary between them" width="700">
</p>

## The build boundary: local build vs remote release

The **build boundary** is the conceptual line between *making* an agent and
*releasing* it to the cloud.

- **Local mode** (`mise run mode-local`, `CANARY=1 mise run provision-local`) runs the
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

<p align="center">
  <img src="../assets/diagrams/durable-control-plane.svg" alt="The durable control plane: CLI to gateway to Cloud Tasks to worker to the Firestore/AlloyDB ledger, looping until the run completes" width="700">
</p>

The console subscribes to the ledger live (`onSnapshot`); GCS holds artifacts
and logs, and Pub/Sub fans the same events out to other subscribers.

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

- **`mise run` tasks** are the human entry points: `mise run console` opens the operator
  UI; `mise run mode-local` + `CANARY=1 mise run provision-local` builds one agent locally
  to the boundary; `CANARY=1 mise run bootstrap` stands up the planes and proves one
  agent end to end. Run `mise run help` for the grouped menu or `mise run next` for a
  status-based recommendation.
- The **console** is the day-to-day UI (Pipeline · Fleet · Activity · Doctor) with
  a live Run Drawer over the same ledger.

See the [Reference](../reference/) for the full `mise` and `ge` command surface,
and the [Cookbooks](../cookbooks/) for "build a canary" and "ship to the cloud".
