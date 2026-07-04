---
type: Agent Tool
title: query_google_workspace_group_memberships
description: Check current Google Workspace group memberships for the employee.
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

# query_google_workspace_group_memberships

Check current Google Workspace group memberships for the employee.

- **Kind:** query
- **Source system:** [Google Workspace](/systems/google-workspace.md)

## Inputs

- employee_id

## Outputs

- group_ids
- group_names

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Workspace](/systems/google-workspace.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_system_provisioning](/workflow/multi-system-provisioning.md)

## Evals

- [Employee EMP-3210 is terminated. Revoke access from all groups and create compliance audit ticket.](/tests/termination-revocation-with-audit.md)

## Evidence emitted

- source_system_record

## Required inputs

- employee_id

## Produces

- group_ids
- group_names

# Examples

```
query_google_workspace_group_memberships(employee_id=<employee_id>)
```

# Citations

- [Google Workspace](/systems/google-workspace.md)
