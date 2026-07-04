---
type: Agent Tool
title: action_servicenow_create_access_ticket
description: "Create a ServiceNow access request ticket with full audit trail, approval thresholds, and manager handoff."
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

# action_servicenow_create_access_ticket

Create a ServiceNow access request ticket with full audit trail, approval thresholds, and manager handoff.

- **Kind:** action
- **Source system:** [ServiceNow](/systems/servicenow.md)

## Inputs

- employee_id
- access_type
- justification

## Outputs

- ticket_id
- approval_state

## Side Effects

- May change ServiceNow state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_servicenow_create_access_ticket](/policies/confirmation-action-servicenow-create-access-ticket.md)

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

- [New hire EMP-8901 with role 'Software Engineer' in 'Platform Services' department joins today. Provision their access.](/tests/new-hire-standard-template.md)
- [Senior role change for EMP-5432 requires elevated access to 'Security Admin' group. Route for manager approval.](/tests/elevated-access-manager-approval.md)
- [Employee EMP-3210 is terminated. Revoke access from all groups and create compliance audit ticket.](/tests/termination-revocation-with-audit.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- employee_id
- access_type
- justification

## Produces

- ticket_id
- approval_state

# Examples

```
action_servicenow_create_access_ticket(employee_id=<employee_id>, access_type=<access_type>, justification=<justification>)
```

# Citations

- [ServiceNow](/systems/servicenow.md)
- [Confirmation policy — action_servicenow_create_access_ticket](/policies/confirmation-action-servicenow-create-access-ticket.md)
