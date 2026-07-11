---
name: standing-up-the-platform
description: Brings the factory's cloud planes up and green — factory/data/tool planes via ge up / data up / mcp deploy — and reads ge doctor to remediate readiness failures before any build or release. Use when doctor reports blockers, a plane is down, remote mode needs the platform stood up first, or an MCP/data dependency is missing.
---

# Standing Up The Platform

Use this skill before building or releasing when the platform isn't ready: the factory plane, the data plane (GCS/BigQuery/AlloyDB/Firestore/Bigtable), and the tool plane (per-department MCP services) must exist and pass readiness.

In plain language: read `ge doctor`'s structured checks, bring up only the planes that are down, and re-doctor until green. Don't start a remote build against an unready platform — it will block downstream.

## Assembly-Line Slot

- **First step:** run `ge doctor` and read the structured checks (id/status/detail) — do not guess plane state.
- **Plays a role in:** preflight for everything; gates remote builds and releases.
- **Input:** current mode (local/remote), `.ge.json` config, and the doctor report.
- **Output:** planes up + doctor green, or a precise list of remaining blockers.
- **Next step:** hand a ready platform to `planning-missions` / `running-factory`; hand persistent failures to `triaging-runs`.

## Workflow

1. `ge doctor` (or `--local`) → group failures by plane. For remote work, also
   read `ge daemon cloud --json`; doctor readiness does not prove worker,
   queue, and workspace-cache readiness.
2. Before standing anything up, consult `guarding-the-factory` (these are cloud mutations).
3. Bring up only what's down — factory plane, then data, then tool plane.
4. Confirm the builder image exists, the worker references it, and local,
   worker, and builder installs use `apps/factory/agents-cli-version.txt`.
5. Confirm the builder service account has its runtime roles, including the
   narrow Identity IAM Binder role needed by agents-cli deploy.
6. Re-run doctor and cloud-daemon status until the relevant scope is green;
   never declare ready from a *started* operation.
7. If a check stays red after remediation, hand it to `triaging-runs` with the doctor detail.

Console/API plane status is an observer, not a separate readiness model. It
must call the shared async status board, run independent Cloud Run/storage
probes concurrently, and coalesce identical in-flight reads. Synchronous
`gcloud` calls in the request thread make healthy planes look like a hung UI.

## Commands

```bash
bun tools/ge.mjs doctor              # cloud readiness (APIs, IAM, IAP, memory, health)
bun tools/ge.mjs doctor --local      # local toolchain readiness
bun tools/ge.mjs daemon cloud --json # worker, task queue, and cache readiness
bun tools/ge.mjs up                  # factory plane (terraform apply → build → re-apply → init)
bun tools/ge.mjs images build builder # release-stage runtime image
bun tools/ge.mjs data up             # data plane (GCS/BigQuery/AlloyDB/Firestore/Bigtable)
bun tools/ge.mjs mcp deploy          # tool plane (5 per-department MCP services)
bun tools/ge.mjs mcp doctor          # tool plane + Agent Registry readiness
```

## Common mistakes

- Standing up planes that are already green (wasteful, risks churn) — bring up only what doctor flags.
- Starting a remote build before the tool plane is deployed (agents end up with no tools).
- Declaring ready without re-running doctor.
- Treating the builder image as optional after release stages depend on
  `ge-factory-run-stage`; build it and make sure the worker has
  `GE_AGENT_FACTORY_BUILDER_IMAGE`.
- Giving Cloud Build/storage roles to the builder service account but forgetting
  the runtime roles release stages need (`aiplatform.user`,
  `discoveryengine.editor`, and service-usage consumer).
- Granting a broad project role when agents-cli only needs the Terraform-owned
  Identity IAM Binder permissions (`projects.get/getIamPolicy/setIamPolicy`).
- Treating the model location and runtime region as the same setting. Gemini,
  Antigravity, and Vertex GenAI use `global`; Cloud Run, data, and Reasoning
  Engine remain regional.
- Adding a second console-specific plane model to hide slow status calls; fix
  the shared probe path and keep CLI/console/API results identical.

## Done when

`ge doctor` is green for the scope you need and `ge daemon cloud --json` is
healthy for remote work, or the remaining blockers are handed to
`triaging-runs` with their structured detail.

## References

- Read `references/example-session.md` when doctor is red and it's unclear which plane to bring up — a worked session (scoped doctor → guard → `mcp deploy` → re-doctor → report), plus the remote-guard refusal variant and how to react to it.
- Read `../triaging-runs/references/remote-canary-failure-ladder.md` after doctor is green but a remote canary still fails — it separates readiness gaps from Cloud Build/YAML/IAM/workload failures.
