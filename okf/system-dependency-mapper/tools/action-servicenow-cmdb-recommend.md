---
type: Agent Tool
title: action_servicenow_cmdb_recommend
description: Execute the recommend step in ServiceNow CMDB after the agent has gathered evidence and validated escalation gates.
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

# action_servicenow_cmdb_recommend

Execute the recommend step in ServiceNow CMDB after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [ServiceNow CMDB](/systems/servicenow-cmdb.md)
- **API:** POST /api/servicenow_cmdb/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change ServiceNow CMDB state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_servicenow_cmdb_recommend](/policies/confirmation-action-servicenow-cmdb-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [ServiceNow CMDB](/systems/servicenow-cmdb.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_source_discovery](/workflow/multi-source-discovery.md)
- [model_update](/workflow/model-update.md)

## Evals

- [Run the System Dependency Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/system-dependency-mapper-end-to-end.md)

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
action_servicenow_cmdb_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [ServiceNow CMDB](/systems/servicenow-cmdb.md)
- [Confirmation policy — action_servicenow_cmdb_recommend](/policies/confirmation-action-servicenow-cmdb-recommend.md)
- [Idempotency policy — action_servicenow_cmdb_recommend](/policies/idempotency-action-servicenow-cmdb-recommend.md)
