---
type: Agent Tool
title: query_servicenow_access_requests
description: Retrieve ServiceNow access request history and current approval status for an employee.
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

# query_servicenow_access_requests

Retrieve ServiceNow access request history and current approval status for an employee.

- **Kind:** query
- **Source system:** [ServiceNow](/systems/servicenow.md)

## Inputs

- employee_id

## Outputs

- request_ids
- approval_status

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [ServiceNow](/systems/servicenow.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [event_processing](/workflow/event-processing.md)
- [role_based_access_matching](/workflow/role-based-access-matching.md)
- [edge_case_resolution](/workflow/edge-case-resolution.md)
- [multi_system_provisioning](/workflow/multi-system-provisioning.md)

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- employee_id

## Produces

- request_ids
- approval_status

# Examples

```
query_servicenow_access_requests(employee_id=<employee_id>)
```

# Citations

- [ServiceNow](/systems/servicenow.md)
