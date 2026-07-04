---
type: Agent Tool
title: action_icertis_update
description: Execute the update step in Icertis after the agent has gathered evidence and validated escalation gates.
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

# action_icertis_update

Execute the update step in Icertis after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Icertis](/systems/icertis.md)
- **API:** POST /api/icertis/update

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Icertis state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_icertis_update](/policies/confirmation-action-icertis-update.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Icertis](/systems/icertis.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [document_ingestion_linking](/workflow/document-ingestion-linking.md)
- [conflict_scope_resolution](/workflow/conflict-scope-resolution.md)

## Evals

- [Run the Agreement Hierarchy Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/agreement-hierarchy-tracker-end-to-end.md)

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
action_icertis_update(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Icertis](/systems/icertis.md)
- [Confirmation policy — action_icertis_update](/policies/confirmation-action-icertis-update.md)
- [Idempotency policy — action_icertis_update](/policies/idempotency-action-icertis-update.md)
