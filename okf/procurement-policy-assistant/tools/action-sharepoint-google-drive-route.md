---
type: Agent Tool
title: action_sharepoint_google_drive_route
description: Execute the route step in SharePoint/Google Drive after the agent has gathered evidence and validated escalation gates.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_sharepoint_google_drive_route

Execute the route step in SharePoint/Google Drive after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SharePoint/Google Drive](/systems/sharepoint-google-drive.md)
- **API:** POST /api/sharepoint_google_drive/route

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SharePoint/Google Drive state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sharepoint_google_drive_route](/policies/confirmation-action-sharepoint-google-drive-route.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SharePoint/Google Drive](/systems/sharepoint-google-drive.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [policy_corpus_indexing](/workflow/policy-corpus-indexing.md)
- [intent_classification_routing](/workflow/intent-classification-routing.md)

## Evals

- [Run the Procurement Policy Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/procurement-policy-assistant-end-to-end.md)

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
action_sharepoint_google_drive_route(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SharePoint/Google Drive](/systems/sharepoint-google-drive.md)
- [Confirmation policy — action_sharepoint_google_drive_route](/policies/confirmation-action-sharepoint-google-drive-route.md)
- [Idempotency policy — action_sharepoint_google_drive_route](/policies/idempotency-action-sharepoint-google-drive-route.md)
