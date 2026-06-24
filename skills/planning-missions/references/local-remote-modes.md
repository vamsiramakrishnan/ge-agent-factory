# Local And Remote Modes

## Local Mode

Local mode uses the local harness and local workspace artifacts.

```text
Factory surface: local_harness
Workspace source: .ge/factory/projects
Artifact source: local_workspace_artifacts
Autopilot capability: local_doctor_repair
```

Valid actions:

- build through local harness
- inspect local workspace files
- run workspace doctor
- run deterministic repair
- run harness repair when requested
- ship to cloud after local readiness

## Remote Mode

Remote mode submits to and observes the cloud factory.

```text
Factory surface: cloud_factory
Workspace source: factory run state and GCS artifacts
Artifact source: remote_factory_artifacts
Autopilot capability: remote_observe_only
```

Valid actions:

- submit cloud factory work
- observe remote run state
- inspect remote artifacts/logs
- recommend local sync/prebuild for repair
- recommend cloud factory fixes

Invalid actions:

- running local workspace doctor against remote-only state
- claiming a remote item was repaired locally
- changing target stage on resume

## Antigravity Review Parity

Both modes run the same Antigravity harness review/refine on generated code, on by default:

- Local: `harness_reviewed` / `harness_refined` stages of the local harness build.
- Remote: the cloud worker's `harness_refine` stage (opt out with `REFINE=0` / `--no-refine`).

Both pin the harness review model to `gemini-3.5-flash` and apply the same generated-agent review
points (model = `gemini-3.5-flash`; `max_output_tokens` use-case-sized or unset, never the 2048
boilerplate). `--model` / `--max-output-tokens` on `ge agents build` flow to the cloud worker via the
factory payload, so remote builds match local.

## Handoff

For local publish flows, handoff is explicit:

```text
local build/repair -> ge agents ship -> cloud load/deploy/register/publish
```

For remote flows, the cloud factory already owns release-side stages; do not add a local ship handoff.

