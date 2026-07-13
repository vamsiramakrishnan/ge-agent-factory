---
title: Hand off to ADK Agent Engine / Gemini Enterprise
parent: Guides
nav_order: 11
layout: default
description: Hand a proven workspace to Agent Engine, register its tools, and publish it in Gemini Enterprise without regenerating it.
---

# Hand off to ADK Agent Engine / Gemini Enterprise

**Scope:** cloud — platform provisioning and `ge handoff agents-cli` mutate
your Google Cloud project. The planning and status commands are read-only.

Finish with the exact workspace you proved running in Google Agent Development
Kit (ADK) Agent Engine and available in Gemini Enterprise. `ge handoff
agents-cli` uploads that workspace without regenerating or refining it again
(see [Handoff targets](../concepts/handoff-targets.html)). By default it runs
`load_data → deploy_runtime → poll_runtime → register_tools → publish_enterprise`.
Live verification is an explicit final stage, not part of the default handoff.

<p align="center">
  <img src="../assets/diagrams/factory-line.svg" alt="The factory line: Author and Build stages, then Validate and Refine ending at preview (the local build boundary), then the Release stages that touch your GCP project — the part only a remote run performs" width="700">
</p>

## When to use this

- A workspace has [passed its proof](prove-an-agent.html) and you want it
  live in ADK Agent Engine and discoverable in Gemini Enterprise.
- You proved locally and want the cloud to perform only the release work.
- You changed a contract, re-proved it, and need to hand off the new artifact.

## Input artifact

One or more proven local workspaces under `.ge/factory/workspaces/`
(built or refreshed with `ge prove`). Prerequisites:

- Run `ge up` to provision the factory services plus the data and tool
  infrastructure layers; see [Provision the
  platform](../operations/provision-the-platform.html). Verify them with
  `ge doctor`.
- Configure a Gemini Enterprise app id as `geAppId` in `.ge.json` or

  ```bash
  export GEMINI_ENTERPRISE_APP_ID=projects/<num>/locations/global/collections/default_collection/engines/<app>
  ```

- `gcloud` authenticated against the target project.

## Steps

1. **Preview the handoff without touching the cloud.**

   ```bash
   ge handoff plan --ids <workspace-id>
   ```

   The plan reports the workspace digest, release-stage range, and admission
   decision. It does not upload files, submit a run, or write to the run
   record.

   The real handoff enforces the promotion gate: a workspace whose validation
   report, spec-to-code trace, or review verdicts have not passed is refused
   with a list of blockers.

   > The override (`--force` on `ge handoff agents-cli`, or
   > `GE_ALLOW_UNPROMOTED=1`) exists so that using it is a visible,
   > deliberate act — it is logged as overridden, never silent.
   {: .warning }

   `ge handoff` also runs the
   [admission gate](../reference/admission.html) per workspace before
   uploading anything: a recorded decision over the workspace's signed
   [Agent Passport](../concepts/agent-passport-and-proof-pack.html).
   `ge passport emit` mints one; see [Admit an agent](admit-an-agent.html).
   Audit mode is the default. A denial blocks release when
   `promotion.gates.admission.required` is `true`; `--force` or
   `GE_ADMISSION_BREAK_GLASS=1` records the break-glass decision.

2. **Hand off the proven workspaces.**

   ```bash
   ge handoff agents-cli                   # every locally proven workspace
   ge handoff agents-cli --ids ws-a,ws-b   # selected workspaces
   ```

   Flags: `--ids <a,b>` (default: all built locally), `--start-stage`
   (default `load_data`), `--target-stage` (default `publish_enterprise`),
   `--concurrency <n>` (default `8`, or `GE_REMOTE_SUBMIT_CONCURRENCY`), and
   `--no-proxy` (call the gateway directly over HTTPS instead of using the
   gcloud run proxy tunnel).

   Each workspace is archived, uploaded, and submitted as a release-only run
   that starts after the build boundary. Useful variants:

   ```bash
   ge handoff agents-cli --start-stage deploy_runtime   # use data that is already loaded
   ge handoff agents-cli --target-stage verify_live     # include the live verification stage
   ```

   `load_data` creates the per-agent stores (BigQuery dataset `agent_<id>`,
   Firestore database `agent-<id>`, Bigtable table `agent_<id>`, and Google
   Cloud Storage (GCS) prefix `agents/<id>/`). `deploy_runtime` runs
   `agents-cli deploy` against the workspace manifest
   (`deployment_target: agent_runtime`).
   `poll_runtime` waits for Agent Engine, `register_tools` registers the agent
   with its department Model Context Protocol (MCP) service,
   `publish_enterprise` publishes it in the configured Gemini Enterprise app,
   and optional `verify_live` sends a live prompt and records the result.

3. **Watch the handoff to completion.**

   ```bash
   ge agents status --watch                  # poll until every run is terminal
   ge runs events <run-id> --remote --follow # stream one remote run's events
   ge agents logs <run-id> --stage <stage>   # inspect a failed stage and its Cloud Build URL
   ```

4. **Build in the cloud instead, when needed.**

   `ge agents build --remote --ids <a,b>` regenerates and releases through the
   cloud factory. Use it when there is no local proven workspace to preserve;
   it does not hand off the exact artifact produced by a local proof.

## Expected output

- `ge handoff agents-cli` reports the submitted and failed counts, the stage
  range, and one run id per workspace.
- `ge agents status --watch` ends with all runs terminal and none failed.
- The agent is live in ADK Agent Engine, its runtime id is recorded in
  `deployment_metadata.json`, its tools are registered, and it appears in
  your Gemini Enterprise app. When you target `verify_live`, that stage
  records the live exchange in `artifacts/agents-cli-verify-live.json`.

## Console view

- **Fleet** — bulk handoff and sync across workspaces; **Repair Queue** if a
  release stage blocks. See
  [Fleet and repair](../console/fleet-and-repair.html).
- **Runs** — stage-by-stage progress of each handoff run, with the live event
  stream. See [Pipeline and runs](../console/pipeline-and-runs.html).

## Generated files

- Cloud-side, per agent: the `agent_<id>` BigQuery dataset, `agent-<id>`
  Firestore database, `agent_<id>` Bigtable table, and `agents/<id>/` GCS
  prefix (created at `load_data`); the Agent Engine runtime; the MCP tool
  registration; the Gemini Enterprise listing.
- In the workspace: `deployment_metadata.json` (runtime id) and, when the
  target includes `verify_live`, `artifacts/agents-cli-verify-live.json`
  (live check report) — parts of the [agent
  passport](../concepts/agent-passport-and-proof-pack.html).
- A record of the handoff run in the durable ledger (the persistent run
  history) — inspect with `ge ledger runs` / `ge runs list`.

## Common failures

- **`geAppId unset`** — add it to `.ge.json` or set
  `GEMINI_ENTERPRISE_APP_ID`.
- **`no local workspaces at .ge/factory/workspaces`** — run `ge prove`; handoff
  consumes prebuilt, proven workspaces only.
- **Promotion gate blocked — refusing to deploy** — the run lists the
  blockers; resolve them via [repair](repair-failed-proof.html), or
  override deliberately (`GE_ALLOW_UNPROMOTED=1`).
- **`admission denied: GEADM…`** — the admission gate refused the
  workspace; each blocker names its fix (usually `ge prove` then
  `ge passport emit <id>` — see the
  [blocker-code table](../reference/admission.html)), or break-glass
  deliberately (`ge handoff agents-cli --force`).
- **Run stuck at `queued`** — Cloud Tasks → worker invocation failing;
  check the worker's `run.invoker` binding and run `ge doctor`.
- **A release stage failed** — `ge agents logs <runId> --stage <stage>`
  prints the persisted stage result including the Cloud Build log URL;
  start there.

## Repair

- Resume the failed release from the run record with
  `ge agents resume --remote --run --ids <id>`.
- Hand off from a later stage once the cause is fixed, e.g.
  `ge handoff agents-cli --ids <id> --start-stage deploy_runtime`.
- Pre-boundary failures (validation, harness) belong to
  [Repair a failed proof](repair-failed-proof.html) — converge locally,
  then hand off again.

## Next step

Put governed access in front of the live agent —
[Deploy the Agent Gateway](../operations/agent-gateway.html) — and keep the
release evidence at hand:
[Agent passport & proof pack](../concepts/agent-passport-and-proof-pack.html).
