# Gate Artifacts

Workspace gates are artifact-driven. Prefer reading JSON artifacts before editing code.

## Core Artifacts

| Artifact | Purpose |
| --- | --- |
| `workspace.json` | workspace identity, capability summary, next actions |
| `mock_systems/usecase-spec.json` | source spec for expected behavior |
| `artifacts/spec-code-trace.json` | spec-to-code coverage and gaps |
| `artifacts/validation-report.json` | validation summary, readiness, tests |
| `artifacts/checking-workspaces.json` | gate blockers and repair tasks |
| `artifacts/workspace-repair.json` | repair attempts and final doctor result |
| `artifacts/promotion-packet.json` | promotion readiness evidence |
| `artifacts/deploy-plan.json` | deployment plan and topology requirements |
| `artifacts/publish-plan.json` | Gemini Enterprise publish plan |

## Gate Expectations

- `preview`: validation, smoke readiness, preview report.
- `promote`: validation plus spec-code trace and promotion packet.
- `deploy:plan`: promotion readiness plus deploy plan.
- `publish:plan`: deploy plan plus publish plan.

## Editing Rule

If an artifact reports a real blocker, do not weaken the artifact producer to pass. Fix the workspace or the shared generator that created the defect.

