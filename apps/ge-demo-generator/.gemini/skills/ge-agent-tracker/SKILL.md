---
name: ge-agent-tracker
description: |
  Use to answer workspace and agent status questions in the capability-driven
  GE Demo Generator harness. Reads workspace.json, run events, artifacts,
  versions, selected skills, readiness, and nextActions. Explains what is
  ready, what is missing, and the next safe command.
triggers:
  - "where is my agent"
  - "agent status"
  - "what stage"
  - "what's next"
  - "capabilities"
  - "readiness"
  - "list artifacts"
  - "agent versions"
  - "pipeline progress"
  - "track agent"
inputs:
  - name: workspace_id
    type: string
    required: false
  - name: agent_id
    type: string
    required: false
outputs:
  primary: status summary
  secondary: [capabilities, readiness, next action, artifacts]
resources:
  scripts: []
  references:
    - path: references/stage-definitions.md
      purpose: Stage and readiness definitions.
      use_when: Stage, readiness, or nextAction values conflict.
    - path: references/artifact-contract.md
      purpose: Artifact names, purposes, and expected locations.
      use_when: Explaining generated files or missing artifacts.
  assets: []
example_prompt: |
  Where is the HR benefits workspace, which skills are wired, and what should
  happen next before deployment?
---

# GE Agent Tracker

Use this skill for status, not generation. The source of truth is `workspace.json` plus daemon APIs.

## Read Order

1. `workspace.json`
2. `artifacts/validation-report.json` and `artifacts/VALIDATION_REPORT.md`
3. `mock_systems/pipeline.json`
4. `runs/<runId>/events.jsonl`
5. agent/version APIs if the daemon is running

## Capability Vocabulary

Expected capability path:

```
workspace -> mock_data -> adk_agent -> fixture_tools -> smoke_tests -> local_preview -> deploy_plan -> publish_plan -> deployment -> published
```

Report:

- Current capabilities
- Readiness statuses
- Selected skills and whether they point to `.gemini/skills` or workspace mirrors
- Latest validation result
- Next action from `workspace.json.nextActions`

## Safe Next Commands

```bash
ge validate <workspace-id>
ge preview <workspace-id>
ge deploy:plan <workspace-id> --target agent_runtime
ge publish:plan <workspace-id> --app-id <id>
```

Only mention live deploy/publish as blocked behind explicit approval.

## Bundled Resources

- `references/stage-definitions.md`: when stage names conflict with readiness.
- `references/artifact-contract.md`: when explaining generated artifacts.

## Status Response Shape

```markdown
Status:
Capabilities:
Readiness:
Skills:
Next:
Risks:
```

Load on demand:

- `references/stage-definitions.md` — legacy stage mapping
- `references/artifact-contract.md` — expected artifact list
