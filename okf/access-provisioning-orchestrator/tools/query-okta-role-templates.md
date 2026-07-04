---
type: Agent Tool
title: query_okta_role_templates
description: "Retrieve role-based access templates from Okta, scoped by role and department."
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

# query_okta_role_templates

Retrieve role-based access templates from Okta, scoped by role and department.

- **Kind:** query
- **Source system:** [Okta](/systems/okta.md)

## Inputs

- role
- department

## Outputs

- role_template_id
- group_assignments
- requires_manager_approval

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Okta](/systems/okta.md).

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

## Evidence emitted

- source_system_record

## Required inputs

- role
- department

## Produces

- role_template_id
- group_assignments
- requires_manager_approval

# Examples

```
query_okta_role_templates(role=<role>, department=<department>)
```

# Citations

- [Okta](/systems/okta.md)
