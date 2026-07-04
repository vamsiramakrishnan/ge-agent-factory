---
type: Agent Tool
title: action_oracle_field_service_file
description: Execute the file step in Oracle Field Service after the agent has gathered evidence and validated escalation gates.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_oracle_field_service_file

Execute the file step in Oracle Field Service after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Oracle Field Service](/systems/oracle-field-service.md)
- **API:** POST /api/oracle_field_service/file

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Oracle Field Service state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_oracle_field_service_file](/policies/confirmation-action-oracle-field-service-file.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Oracle Field Service](/systems/oracle-field-service.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [analyze_detect](/workflow/analyze-detect.md)
- [validate_evidence](/workflow/validate-evidence.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Truck Roll Avoidance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/truck-roll-avoidance-agent-end-to-end.md)

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
action_oracle_field_service_file(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Oracle Field Service](/systems/oracle-field-service.md)
- [Confirmation policy — action_oracle_field_service_file](/policies/confirmation-action-oracle-field-service-file.md)
- [Idempotency policy — action_oracle_field_service_file](/policies/idempotency-action-oracle-field-service-file.md)
