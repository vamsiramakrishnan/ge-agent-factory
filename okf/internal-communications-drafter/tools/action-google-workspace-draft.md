---
type: Agent Tool
title: action_google_workspace_draft
description: Execute the draft step in Google Workspace after the agent has gathered evidence and validated escalation gates.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_google_workspace_draft

Execute the draft step in Google Workspace after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Google Workspace](/systems/google-workspace.md)
- **API:** POST /api/google_workspace/draft

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Google Workspace state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_google_workspace_draft](/policies/confirmation-action-google-workspace-draft.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Workspace](/systems/google-workspace.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [audience_aware_drafting](/workflow/audience-aware-drafting.md)

## Evals

- [Run the Internal Communications Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/internal-communications-drafter-end-to-end.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

# Examples

```
action_google_workspace_draft(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Google Workspace](/systems/google-workspace.md)
- [Confirmation policy — action_google_workspace_draft](/policies/confirmation-action-google-workspace-draft.md)
- [Idempotency policy — action_google_workspace_draft](/policies/idempotency-action-google-workspace-draft.md)
