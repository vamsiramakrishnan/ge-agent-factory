---
type: Agent Tool
title: action_google_workspace_match
description: Execute the match step in Google Workspace after the agent has gathered evidence and validated escalation gates.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_google_workspace_match

Execute the match step in Google Workspace after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Google Workspace](/systems/google-workspace.md)
- **API:** POST /api/google_workspace/match

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

- [Confirmation policy — action_google_workspace_match](/policies/confirmation-action-google-workspace-match.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Workspace](/systems/google-workspace.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [email_decomposition](/workflow/email-decomposition.md)
- [threat_intelligence_matching](/workflow/threat-intelligence-matching.md)

## Evals

- [Run the Phishing & Email Threat Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/phishing-email-threat-analyzer-end-to-end.md)

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
action_google_workspace_match(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Google Workspace](/systems/google-workspace.md)
- [Confirmation policy — action_google_workspace_match](/policies/confirmation-action-google-workspace-match.md)
- [Idempotency policy — action_google_workspace_match](/policies/idempotency-action-google-workspace-match.md)
