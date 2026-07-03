---
name: checking-workspaces
description: Checks and repairs generated GE agent workspaces. Use when validating workspace readiness, running doctor or repair, inspecting spec-code trace, or unblocking preview, promotion, deploy-plan, or publish-plan gates.
---

# Checking Workspaces

Use this skill when a generated ADK workspace must prove it is ready for the next factory station.

Core model:

```text
Workspace contract -> validation -> spec-code trace -> doctor -> repair -> promotion/deploy/publish gate
```

## Assembly-Line Slot

In plain language: this skill is the quality station for generated workspaces. The factory has already produced code, data, tools, or plans; now the harness needs to prove the workspace is actually usable. The first move is always to ask the doctor what is wrong, then repair the smallest real blocker instead of guessing from logs.

- **First step:** run workspace doctor for the target gate.
- **Plays a role in:** work cell 2, `Refine + Gate`, especially `validate` and `preview`; also promotion/deploy/publish planning gates before cloud side effects.
- **Input:** generated workspace from `generate_workspace`, data artifacts from `generate_data/package_data`, and the target gate.
- **Output:** pass/fail gate evidence, blockers, repair tasks, and repaired workspace artifacts.
- **Next step:** if the gate passes, continue to `plan_deploy`, `load_data`, `deploy_runtime`, or publish handoff; if it fails repeatedly, recommend an upstream generator/spec fix.

Use this skill when the question is “why is this workspace not ready for the next station?” Do not start by editing code. Start by reading the gate artifact, because the doctor tells you whether the problem is contract shape, missing tools, bad spec-code coverage, preview failure, deploy planning, or publish readiness.

## Workflow

1. Identify the workspace id and target gate.
2. Run doctor first:

```bash
node apps/factory/src/cli.js workspace doctor <workspace-id> --stage <preview|promote|deploy:plan|publish:plan>
```

3. Inspect blockers and artifacts, not only terminal output.
4. Use deterministic repair first:

```bash
node apps/factory/src/cli.js workspace repair <workspace-id> --stage <stage> --agent none --attempts 3
```

5. Use harness-assisted repair only when deterministic repair cannot resolve the blocker.
6. If the same blocker appears across multiple workspaces, recommend an upstream generator/workspace-contract fix.
7. Re-run doctor and the narrowest validation command after edits.

## Key Artifacts

- `artifacts/workspace-doctor.json` (+ `artifacts/WORKSPACE_DOCTOR.md`)
- `artifacts/workspace-repair.json`
- `artifacts/validation-report.json`
- `artifacts/spec-code-trace.json`
- `artifacts/promotion-packet.json`
- `artifacts/deploy-plan.json`
- `artifacts/publish-plan.json`
- `workspace.json`
- `mock_systems/usecase-spec.json`
- `app/agent.py`
- `app/tools.py`
- `tests/test_smoke.py`

## Source Files

- Contract: `apps/factory/src/workspace-contract.js`
- Validation pipeline: `apps/factory/src/agent-workspace-pipeline.js`
- Spec-code trace: `apps/factory/src/spec-code-trace.js`
- Doctor: `apps/factory/src/workspace-doctor.js`
- Repair: `apps/factory/src/workspace-repair.js`
- CLI routing: `apps/factory/src/cli.js`

## Scripts

Summarize a workspace gate artifact set:

```bash
node skills/checking-workspaces/scripts/summarize-gate.mjs .ge/factory/workspaces/<workspace>
```

## Repair Discipline

- Keep edits scoped to the generated workspace unless evidence points to a shared generator defect.
- Do not bypass spec-code trace or promotion blockers by weakening gates.
- Prefer structured JSON artifacts over ad hoc text parsing.
- Record repeated blocker signatures for Evidence Ledger follow-up.

## Validation

Run the narrow checks first:

```bash
node apps/factory/src/cli.js workspace doctor <workspace-id> --stage <stage>
node apps/factory/src/cli.js validate <workspace-id>
```

For source changes:

```bash
node --check apps/factory/src/workspace-doctor.js
node --check apps/factory/src/workspace-repair.js
```

## References

- Read `references/example-session.md` first if this is your first gate run — a worked session (doctor → deterministic repair → re-check → report), with real output and the repair-blocked/escalate-upstream variant.
- Read `references/assembly-line-role.md` to understand where this skill fits in the Agent Factory assembly line.
- Read `references/gate-artifacts.md` before adding or changing gate artifacts.
- Read `references/blocker-taxonomy.md` before adding new blocker ids or repair behavior.
- Copy `assets/blocker-signature-example.json` as the starting Evidence Ledger event when recording a repeated blocker signature for upstream follow-up.
