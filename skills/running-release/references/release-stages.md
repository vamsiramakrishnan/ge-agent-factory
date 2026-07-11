# Release Stages

These stages touch cloud resources or publishing surfaces.

## Boundary Contract

There are two supported entries into release:

- A generated remote build starts at `package_data`. That stage creates the
  stable workspace archive consumed by every later Cloud Build stage.
- A local or otherwise prebuilt workspace uses `ge handoff` and may start at
  `load_data`, but only after its package artifacts already exist.

Before `load_data`, verify `workspace.tar.gz` contains at least:

```text
mock_data/cloud/load-to-google-cloud.sh
mock_data/cloud/cloud-data-manifest.json
mock_data/cloud/mcp-tools.json
```

Treat that archive as the cross-stage package contract. Do not reconstruct a
different workspace independently in the worker, gateway, or console.

## Stage Meanings

- `plan_deploy`: prepare deploy topology and required resources.
- `load_data`: load per-agent cloud data.
- `deploy_runtime`: hand the generated agent to agents-cli and deploy its
  Reasoning Engine runtime.
- `poll_runtime`: wait for runtime readiness.
- `register_tools`: register MCP/tool records.
- `publish_enterprise`: publish/register in Gemini Enterprise.
- `verify_live`: run live status/smoke verification.

## Rules

- Do not skip deploy plan.
- Do not claim publish success from plan artifact alone.
- Do not run local repair against remote-only state.
- For local builds, use `ge handoff` to hand off post-boundary work.
- For remote builds, observe factory stage artifacts and run state.
- Remote release stages run in Cloud Build. The worker submits/polls them; it
  does not inline release logic in Cloud Run request handlers.
- `cloudbuild.factory-stage.yaml` is a small dispatcher. The actual stage logic
  lives in the shared builder image script, `ge-factory-run-stage`.
- The builder service account executes the release stage. Give it the runtime
  permissions needed by the stage, not only Cloud Build/storage permissions.
- Agents-cli identity deployment reads and updates project IAM. The builder
  service account therefore needs the Terraform-managed
  `geAgentFactoryIdentityIamBinder` custom role with
  `resourcemanager.projects.get`, `getIamPolicy`, and `setIamPolicy`; do not
  replace that narrow role with project Owner.
- Gemini Enterprise and Antigravity/Vertex model calls use `global` unless
  explicitly overridden. Cloud Run, Cloud Build, Reasoning Engine runtime, and
  data resources remain regional; never copy the runtime region into model
  location by accident.
- Pin agents-cli through `apps/factory/agents-cli-version.txt`. Local deps,
  worker images, and builder images must resolve the same version.
- Persist changed artifacts with checksum-aware recursive sync. Keep one
  canonical `artifacts/` tree and prune test/eval trees from broad diagnostic
  uploads so stages do not create `artifacts/artifacts` or re-upload the whole
  workspace.
- A `stage_done` event is terminal only when that stage is the requested target.
  If `nextStage` is present, project the work item as running/queued at that next
  stage; otherwise CLI/console followers stop before release finishes.
- Agent Registry limits an MCP tool-spec payload to 10 KB. Keep the complete
  runtime MCP manifest in GCS, and derive a deterministic bounded registry copy
  that retains every tool name and prioritizes input properties over prose.
  Never truncate an arbitrary tail of tools. If even the complete name/schema
  skeleton cannot fit, split the MCP server by source system.

## Partial Runtime Semantics

`deploy_runtime` can create a Reasoning Engine identity before agents-cli
updates project IAM or uploads the deployed payload. A later failure is not
proof that nothing changed.

1. Capture the agents-cli stdout/stderr artifact and find the first actionable
   permission or API error, not a recovered smart-merge warning.
2. Inspect the exact Reasoning Engine resource. An identity-only object is a
   partial side effect, not a successful deployment.
3. After guard approval, delete only that exact canary resource or complete its
   operation-aware recovery before replaying `deploy_runtime`.
4. Resume from the already-proven stable archive for a focused release proof,
   then run a fresh full canary under the final images/configuration.

## Proof Artifacts

- `artifacts/deploy-plan.json`
- `artifacts/publish-plan.json`
- stable `workspace.tar.gz` containing the cloud package contract
- `mock_data/cloud/load-report.json`
- `artifacts/deploy-runtime-stdout.log`
- `deployment_metadata.json` with a non-null remote runtime id
- `agent_registry_registration.json`
- `gemini_enterprise_registration.json`
- `artifacts/live-verification-report.json`
