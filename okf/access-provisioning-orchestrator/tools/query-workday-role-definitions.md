---
type: Agent Tool
title: query_workday_role_definitions
description: "Resolve the employee's current role, department, team, and manager from Workday."
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

# query_workday_role_definitions

Resolve the employee's current role, department, team, and manager from Workday.

- **Kind:** query
- **Source system:** [Workday](/systems/workday.md)

## Inputs

- employee_id

## Outputs

- role
- department
- team
- manager_id

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Workday](/systems/workday.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [event_processing](/workflow/event-processing.md)
- [role_based_access_matching](/workflow/role-based-access-matching.md)

## Evals

- [New hire EMP-8901 with role 'Software Engineer' in 'Platform Services' department joins today. Provision their access.](/tests/new-hire-standard-template.md)
- [Senior role change for EMP-5432 requires elevated access to 'Security Admin' group. Route for manager approval.](/tests/elevated-access-manager-approval.md)

## Evidence emitted

- source_system_record

## Required inputs

- employee_id

## Produces

- role
- department
- team
- manager_id

# Examples

```
query_workday_role_definitions(employee_id=<employee_id>)
```

# Citations

- [Workday](/systems/workday.md)
