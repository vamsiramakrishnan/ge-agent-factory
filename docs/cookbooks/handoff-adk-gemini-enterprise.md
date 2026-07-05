---
title: Hand off to ADK Agent Engine / Gemini Enterprise
parent: Guides
nav_order: 11
layout: default
description: Ship a proven workspace with ge handoff agents-cli — the post-boundary release stages deploy it to Agent Engine, register its tools, and publish it into Gemini Enterprise.
---

# Hand off to ADK Agent Engine / Gemini Enterprise

**Scope:** cloud — every stage in this guide mutates your Google Cloud
project.

`ge handoff agents-cli` deploys a proven workspace to the runtime and the
end-user surface — the same workspace you proved, with no regeneration and
no re-refine (see [Handoff targets](../concepts/handoff-targets.html)). It
uploads each locally-built, proven workspace and runs the post-boundary
release stages in your Google Cloud project (GCP) —
`load_data → deploy_runtime → poll_runtime → register_tools → publish_enterprise`,
with `verify_live` as the final stage of the graph.

<p align="center">
  <img src="../assets/diagrams/factory-line.svg" alt="The factory line: Author and Build stages, then Validate and Refine ending at preview (the local build boundary), then the Release stages that touch your GCP project — the part only a remote run performs" width="700">
</p>

## When to use this

- A workspace has [passed its proof](prove-an-agent.html) and you want it
  live in ADK Agent Engine and discoverable in Gemini Enterprise.
- You built locally (cheap, provable) and want the cloud to do only the
  release half.
- You need to re-release after a contract change and recompile.

## Input artifact

One or more proven local workspaces under `.ge/factory/workspaces/`
(built with `ge agents build --local`). Prerequisites:

- The cloud planes stood up — the factory services plus the data and tool
  infrastructure layers; see
  [Provision the platform](../operations/provision-the-platform.html).
  Verify with `ge doctor`.
- A Gemini Enterprise app id configured: `geAppId` in `.ge.json` or

  ```bash
  export GEMINI_ENTERPRISE_APP_ID=projects/<num>/locations/global/collections/default_collection/engines/<app>
  ```

- `gcloud` authenticated against the target project.

## Steps

1. **Confirm the workspaces you're shipping are proven.** The deploy stage
   enforces the promotion gate: a workspace whose validation report,
   spec-to-code trace, or harness verdicts haven't passed is refused with a
   list of blockers.

   > The override (`--force` on the factory deploy, or
   > `GE_ALLOW_UNPROMOTED=1`) exists so that using it is a visible,
   > deliberate act — it is logged as overridden, never silent.
   {: .warning }

   On top of the promotion gate, `ge handoff` runs the
   [admission gate](../reference/admission.html) per workspace before
   uploading anything: a recorded decision over the workspace's signed
   [Agent Passport](../concepts/agent-passport-and-proof-pack.html)
   (`ge passport emit` mints one — see
   [Admit an agent](admit-an-agent.html)). Audit mode by default; denials
   refuse the release once `promotion.gates.admission.required` is `true`,
   and `--force` / `GE_ADMISSION_BREAK_GLASS=1` is the recorded break-glass.

2. **Ship.**

   ```bash
   ge handoff agents-cli                   # all locally-built workspaces
   ge handoff agents-cli --ids ws-a,ws-b   # specific workspaces
   ```

   Flags: `--ids <a,b>` (default: all built locally), `--start-stage`
   (default `load_data`), `--target-stage` (default `publish_enterprise`),
   `--concurrency <n>` (default 2), `--no-proxy` (call the gateway directly
   over HTTPS instead of the gcloud run proxy tunnel).

   Each workspace is tarred, uploaded, and submitted as a deploy-only run
   starting past the build boundary. Useful variants:

   ```bash
   ge handoff agents-cli --start-stage deploy_runtime   # skip load_data if stores already loaded
   ge handoff agents-cli --target-stage verify_live     # extend through the live smoke check
   ```

   What the stages do: `load_data` creates the per-agent stores (BigQuery
   dataset `agent_<id>`, Firestore DB `agent-<id>`, Bigtable table
   `agent_<id>`, GCS prefix `agents/<id>/`); `deploy_runtime` runs
   `agents-cli deploy` against the workspace's manifest
   (`deployment_target: agent_runtime`); `poll_runtime` waits for the Agent
   Engine runtime to be ready; `register_tools` registers the agent against
   its department MCP service; `publish_enterprise` publishes it into your
   Gemini Enterprise app; `verify_live` sends a live prompt and records the
   result.

3. **Watch the runs.**

   ```bash
   ge agents status --watch            # re-polls every 15s until all runs are terminal
   ge runs events <id> --follow        # stream one run's events live
   ge agents logs <runId> --stage <stage>   # a failed stage's result, stderr, Cloud Build log URL
   ```

4. **Fallback (zero local setup):** `ge agents build --remote --ids <a,b>`
   re-runs generation in the cloud and deploys — simpler, but it redoes the
   refine step and deploys the cloud's artifact rather than your exact
   proven one.

## Expected output

- `ge handoff agents-cli` prints `Shipped <n>  failed 0  (load_data → publish_enterprise, remote)`
  with one run id per workspace.
- `ge agents status --watch` ends with all runs terminal and none failed.
- The agent is live in ADK Agent Engine (its runtime id lands in the
  workspace's `deployment_metadata.json`), its tools are registered, and it
  appears in your Gemini Enterprise app. A `verify_live` run records the
  live exchange in `artifacts/agents-cli-verify-live.json`.

## Console view

- **Fleet** — bulk ship/sync across workspaces; **Repair Queue** if a
  release stage blocks. See
  [Fleet and repair](../console/fleet-and-repair.html).
- **Runs** — stage-by-stage progress of each ship run, with the live event
  stream. See [Pipeline and runs](../console/pipeline-and-runs.html).

## Generated files

- Cloud-side, per agent: the `agent_<id>` BigQuery dataset, `agent-<id>`
  Firestore database, `agent_<id>` Bigtable table, and `agents/<id>/` GCS
  prefix (created at `load_data`); the Agent Engine runtime; the MCP tool
  registration; the Gemini Enterprise listing.
- In the workspace: `deployment_metadata.json` (runtime id) and
  `artifacts/agents-cli-verify-live.json` (live check report) — parts of
  the [agent passport](../concepts/agent-passport-and-proof-pack.html).
- A record of the ship run in the durable ledger (the persistent run
  history) — inspect with `ge ledger runs` / `ge runs list`.

## Common failures

- **`geAppId unset`** — add it to `.ge.json` or set
  `GEMINI_ENTERPRISE_APP_ID`.
- **`no local workspaces at .ge/factory/workspaces`** — run
  `ge agents build --local` first; ship consumes prebuilt workspaces only.
- **Promotion gate blocked — refusing to deploy** — the run lists the
  blockers; resolve them via [repair](repair-failed-proof.html), or
  override deliberately (`GE_ALLOW_UNPROMOTED=1`).
- **`admission denied: GEADM…`** — the admission gate refused the
  workspace; each blocker names its fix (usually `ge prove` then
  `ge passport emit <id>` — see the
  [blocker-code table](../reference/admission.html)), or break-glass
  deliberately (`ge handoff --force`).
- **Run stuck at `queued`** — Cloud Tasks → worker invocation failing;
  check the worker's `run.invoker` binding and run `ge doctor`.
- **A release stage failed** — `ge agents logs <runId> --stage <stage>`
  prints the persisted stage result including the Cloud Build log URL;
  start there.

## Repair

- Retry from the ledger: `ge agents resume` in remote mode plans the exact
  ship/advance actions to reach `published`; `--run` executes them.
- Re-ship from a later stage once the cause is fixed, e.g.
  `ge handoff agents-cli --ids <id> --start-stage deploy_runtime`.
- Pre-boundary failures (validation, harness) belong to
  [Repair a failed proof](repair-failed-proof.html) — converge locally,
  then ship again.

## Next step

Put governed access in front of the live agent —
[Deploy the Agent Gateway](../operations/agent-gateway.html) — and keep the
release evidence at hand:
[Agent passport & proof pack](../concepts/agent-passport-and-proof-pack.html).
