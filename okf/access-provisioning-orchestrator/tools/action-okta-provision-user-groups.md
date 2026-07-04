---
type: Agent Tool
title: action_okta_provision_user_groups
description: Provision the employee to Okta groups based on the matched template and peer enrichment.
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

# action_okta_provision_user_groups

Provision the employee to Okta groups based on the matched template and peer enrichment.

- **Kind:** action
- **Source system:** [Okta](/systems/okta.md)
- **API:** POST /systems/okta/users/{id}/groups

## Inputs

- employee_id
- group_ids

## Outputs

- provision_ids
- timestamp

## Side Effects

- May change Okta state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_okta_provision_user_groups](/policies/confirmation-action-okta-provision-user-groups.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Okta](/systems/okta.md).

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

- provision_ids
- timestamp

# Examples

```
action_okta_provision_user_groups(employee_id=<employee_id>, group_ids=<group_ids>)
```

# Citations

- [Okta](/systems/okta.md)
- [Confirmation policy — action_okta_provision_user_groups](/policies/confirmation-action-okta-provision-user-groups.md)
