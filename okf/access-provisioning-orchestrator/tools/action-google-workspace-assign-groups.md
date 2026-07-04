---
type: Agent Tool
title: action_google_workspace_assign_groups
description: "Assign the employee to Google Workspace groups for email, calendar, and Drive access."
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

# action_google_workspace_assign_groups

Assign the employee to Google Workspace groups for email, calendar, and Drive access.

- **Kind:** action
- **Source system:** [Google Workspace](/systems/google-workspace.md)
- **API:** POST /systems/okta/users/{id}/groups

## Inputs

- employee_id
- group_ids

## Outputs

- assignment_ids
- timestamp

## Side Effects

- May change Google Workspace state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_google_workspace_assign_groups](/policies/confirmation-action-google-workspace-assign-groups.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Workspace](/systems/google-workspace.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_system_provisioning](/workflow/multi-system-provisioning.md)

## Evals

- [New hire EMP-8901 with role 'Software Engineer' in 'Platform Services' department joins today. Provision their access.](/tests/new-hire-standard-template.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- employee_id
- group_ids

## Produces

- assignment_ids
- timestamp

# Examples

```
action_google_workspace_assign_groups(employee_id=<employee_id>, group_ids=<group_ids>)
```

# Citations

- [Google Workspace](/systems/google-workspace.md)
- [Confirmation policy — action_google_workspace_assign_groups](/policies/confirmation-action-google-workspace-assign-groups.md)
