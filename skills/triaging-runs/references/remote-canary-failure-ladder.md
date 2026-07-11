# Remote Canary Failure Ladder

Use this when `ge agents build --remote --canary --watch` fails or hangs. A
remote canary proves more than readiness: it proves gateway submission, Cloud
Tasks dispatch, worker execution, Antigravity refine, Cloud Build release
stages, IAM, artifact persistence, and status fan-in.

## What We Learned

- `ge doctor` is necessary but not sufficient. It can prove services and queues
  are ready while a real canary still fails inside a stage.
- The gateway should scaffold deterministically and enqueue work; real stage
  execution belongs to the worker and Cloud Build. Do not add console-only or
  gateway-only snowflake behavior.
- Gemini Enterprise, Antigravity SDK, and Vertex GenAI location should be
  `global` unless an operator explicitly overrides it. Do not silently inherit
  the Cloud Run region for model calls.
- `cloudbuild.factory-stage.yaml` must stay small. Release-stage logic belongs
  in the shared builder image script (`ge-factory-run-stage`), not in a giant
  inline YAML shell body.
- The builder image is a contract, not just a speed optimization. If release
  stages use `ge-factory-run-stage`, every remote worker must pass the project
  builder image as `_BUILDER_IMAGE`.
- Terraform owns Cloud Run images/env/IAM defaults. Manual `gcloud run update`
  can unblock a live canary, but the durable fix must land in Terraform/source.
- The runner service account submits and polls builds. The builder service
  account executes release stages, so it needs the runtime permissions those
  stages exercise, not only Cloud Build/storage permissions.
- Status parity matters: CLI/console/API must all show the same terminal
  failed/running/done state from the run ledger and artifacts.
- A console shell stuck on `Loading…` with no page error can be server-thread
  starvation: synchronous `gcloud` status probes delay lazy modules and other
  API requests. The durable fix is the shared async/coalesced status board, not
  a longer frontend timeout.
- Generated remote runs begin at `package_data`; only prebuilt handoffs may
  begin at `load_data`. The stable archive is the package passed between every
  release stage.
- A failed agents-cli deploy may already have created a Reasoning Engine
  identity. Recovery must account for that exact partial resource.

## Fast Ladder

1. Check the CLI projection:

```bash
GE_GATEWAY_TRANSPORT=direct bun tools/ge.mjs agents status --json
```

If it says `unknown`, fix status normalization before debugging the workload.
Use `bun tools/ge.mjs agents logs <run-id> --stage <stage>` for one run/stage.
If the console shell renders but a view stays loading, inspect pending browser
requests. Completed 200s plus pending view modules/status calls point to a
blocked server request path; verify `/api/ge/status` uses `statusBoardAsync`.

2. Verify the start-stage and package contract. Before debugging `load_data`,
   download/list the stable archive and confirm it contains:

```text
mock_data/cloud/load-to-google-cloud.sh
mock_data/cloud/cloud-data-manifest.json
mock_data/cloud/mcp-tools.json
```

If a generated run started at `load_data`, fix gateway start-stage selection;
do not teach `load_data` to invent missing package output.

3. Find the first failing stage artifact:

```bash
gcloud storage ls -r 'gs://<factory-bucket>/runs/<run-id>/**'
gcloud storage cat 'gs://<factory-bucket>/runs/<run-id>/items/<item-id>/factory-<stage>-result.json'
```

Read the first stage failure, not the last log line.

4. If failure is before Cloud Build submission:

- Check worker logs for the run id.
- Check Cloud Tasks dispatch/attempt count.
- Check that the worker image contains the current source and
  `cloudbuild.factory-stage.yaml`.

5. If Cloud Build rejects the build config:

- `invalid .steps field: build step ... arg ... too long` means stage logic is
  inline in YAML. Move it into `apps/factory/cloudbuild/run-factory-stage.sh`
  and rebuild `ge images build builder`, then rebuild/redeploy worker.
- `substitution ... unmatched` means every `_FOO` sent by the worker must be
  referenced in `cloudbuild.factory-stage.yaml` (env entries count).
- `ge-factory-run-stage not found` means `_BUILDER_IMAGE` is missing or points
  at an image that was not built from `apps/factory/builder.Dockerfile`.

6. If Cloud Build starts then fails:

```bash
gcloud builds describe <build-id> --project <project> --format=json
gcloud builds log <build-id> --project <project>
```

Classify the error:

- `aiplatform.endpoints.predict denied`: builder SA lacks Vertex permissions or
  the model/location is wrong. Durable fix lives in Terraform `builder_roles`.
- `discoveryengine.* denied`: builder SA lacks Gemini Enterprise/Discovery
  Engine permissions for publish/register.
- `storage.objects.* denied`: builder SA cannot read/write the factory bucket.
- `resourcemanager.projects.getIamPolicy` or `setIamPolicy` denied during
  agents-cli deploy: the builder SA needs the narrow Terraform-managed
  `geAgentFactoryIdentityIamBinder` role. Do not grant Owner to make the
  canary pass.
- `agents-cli` eval/preview failure: inspect generated workspace artifacts;
  this is a workload failure, not a platform readiness failure.
- An early `Failed to generate old template` may be a recovered smart-merge
  fallback. Continue to the first concrete permission/API failure before
  classifying the stage.
- `toolspec.json exceeds 10 KB` at `register_tools`: verify the complete
  `mock_data/cloud/mcp-tools.json` remains in the workspace/GCS package, then
  use the factory's bounded Agent Registry projection. It must keep every tool
  name and fit by compacting descriptions/schema detail; only split by source
  system when the minimal complete projection is still too large.

7. Inspect deploy side effects before retrying `deploy_runtime`:

- Read `artifacts/deploy-runtime-stdout.log` and any runtime id in
  `deployment_metadata.json`.
- GET the exact Reasoning Engine resource. A resource with agent identity but
  no deployed payload is partial, even if metadata exists.
- After `guarding-the-factory` approves the mutation, delete/recover only that
  exact canary resource. Never clean by display-name prefix or project-wide
  sweep.
- Replay `deploy_runtime` from the proven stable archive for focused release
  validation. After it passes, submit a fresh full canary to prove the final
  end-to-end contract.

8. Confirm version parity. `apps/factory/agents-cli-version.txt` is the single
   supported agents-cli version source. Run `mise run deps`, rebuild the
   builder, and redeploy the worker when that pin changes.

9. Verify terminal projection. A completed intermediate stage with a non-null
   `nextStage` is still active. CLI/console/API should advance the item to that
   next stage and keep following until the configured target succeeds or a real
   stage failure occurs.

## Remote Speed Invariants

- Prebuild and push the builder image before large remote batches.
- Build and deploy gateway/worker images together when the gateway status
  contract or worker stage config changes.
- Keep root and builder `.gcloudignore` files as explicit build-context
  allowlists. The builder context should contain only its Dockerfile, build
  config, runner script, ignore file, and agents-cli version pin.
- Use checksum-aware recursive artifact sync and exclude canonical artifacts,
  tests, and eval trees from diagnostic sweeps. Uploading every unchanged file
  at every stage can dominate release time.
- Keep local and remote stage names, result JSON, event schema, and workspace
  archive format identical. Only transport should differ.
- Cache-heavy work belongs in the builder image or artifact cache, not repeated
  per stage.
- A large builder image still costs pull time in every ephemeral Cloud Build.
  Measure that separately from source upload and stage execution before
  choosing private pools or longer-lived workers.

## Done Criteria

- `ge agents build --remote --canary --watch --json` reaches a terminal state
  that is correctly projected by `ge agents status --json`.
- If it fails, the failure points at a real stage cause with enough evidence to
  fix source/Terraform/IAM or the generated workspace.
- A fresh run after the fix advances past the previously failing boundary.
- No identity-only canary runtime or nested/duplicated artifact tree remains
  after recovery.
