# Harness Playbook

## Operating Loop

1. Read the mission contract.
2. Confirm local/remote capability.
3. Gather evidence from the correct surface.
4. Emit typed events.
5. Summarize blockers and repeated signatures.
6. Recommend the smallest upstream fix.

## Local Mode

Use local workspaces and artifacts:

```text
.ge/factory/projects/<workspace>/
  artifacts/checking-workspaces.json
  artifacts/workspace-repair.json
  artifacts/validation-report.json
  artifacts/spec-code-trace.json
  artifacts/preview-report.json
  artifacts/deploy-plan.json
  artifacts/publish-plan.json
```

Valid actions:

- run workspace doctor
- run deterministic repair
- run harness-assisted repair when requested
- inspect and patch generated workspace code
- recommend generator fixes when failures repeat

## Remote Mode

Use remote factory state, job events, and GCS artifacts.

Valid actions:

- observe remote factory runs
- inspect stage failures and remote artifacts
- recommend local sync/prebuild if repair is required
- recommend cloud factory stage or infra fixes

Invalid action:

- claiming local workspace repair succeeded when no local/synced workspace was repaired.

## Evidence Collection Commands

Console API:

```bash
curl -s http://127.0.0.1:<port>/api/ge/mission
curl -s http://127.0.0.1:<port>/api/ge/autopilot
curl -s http://127.0.0.1:<port>/api/ge/autopilot/<run-id>
curl -s http://127.0.0.1:<port>/api/ge/autopilot/<run-id>/events
```

Local workspace:

```bash
node apps/factory/src/cli.js workspace doctor <workspace-id> --stage preview
node apps/factory/src/cli.js workspace repair <workspace-id> --stage preview --agent none --attempts 3
```

## Generated-Agent Review Points

Every harness review of generated agent code must verify:

- **Model** — `app/agent.py` declares `model="gemini-3.5-flash"`. Flag any other id.
- **Output budget** — `max_output_tokens` is sized to the use case: set an explicit bound only when
  the use case clearly needs one, otherwise leave it unset (model default). Never the `2048`
  boilerplate. These are enforced deterministically too (`agent:model_is_gemini_3_5_flash`,
  `agent:max_output_tokens_not_boilerplate` in `workspace-validation.js`).

These review points apply identically in local and remote mode — remote runs the same Antigravity
harness review/refine (`harness_refine` stage, on by default).

## Reporting Format

Lead with facts:

```text
Finding: <blocker or repeated failure>
Scope: <workspace count / run count / stage>
Evidence: <event ids and artifact paths>
Likely owner: <generator|spec|data|workspace contract|factory|console|infra>
Recommended fix: <specific next change>
```

