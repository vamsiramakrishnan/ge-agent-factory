---
type: Agent Tool
title: action_cloudsql_create
description: Execute the create step in CloudSQL after the agent has gathered evidence and validated escalation gates.
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

# action_cloudsql_create

Execute the create step in CloudSQL after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [CloudSQL](/systems/cloudsql.md)
- **API:** POST /api/cloudsql/create

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change CloudSQL state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_cloudsql_create](/policies/confirmation-action-cloudsql-create.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [CloudSQL](/systems/cloudsql.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [query_performance_collection](/workflow/query-performance-collection.md)

## Evals

- [Run the Database Performance Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/database-performance-advisor-end-to-end.md)

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
action_cloudsql_create(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [CloudSQL](/systems/cloudsql.md)
- [Confirmation policy — action_cloudsql_create](/policies/confirmation-action-cloudsql-create.md)
- [Idempotency policy — action_cloudsql_create](/policies/idempotency-action-cloudsql-create.md)
