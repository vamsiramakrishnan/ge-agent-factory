---
type: Proof Obligation
title: "Golden eval obligation — New hire EMP-8901 with role 'Software Engineer' in 'Platform Services' department joins today. Provision their access."
description: golden eval proof obligation
source_id: "eval-new-hire-standard-template"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — New hire EMP-8901 with role 'Software Engineer' in 'Platform Services' department joins today. Provision their access.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [new-hire-standard-template](/tests/new-hire-standard-template.md)


## Mechanisms

- [query_workday_hr_events](/tools/query-workday-hr-events.md)
- [query_workday_role_definitions](/tools/query-workday-role-definitions.md)
- [query_okta_role_templates](/tools/query-okta-role-templates.md)
- [query_bigquery_peer_access_patterns](/tools/query-bigquery-peer-access-patterns.md)
- [action_okta_provision_user_groups](/tools/action-okta-provision-user-groups.md)
- [action_google_workspace_assign_groups](/tools/action-google-workspace-assign-groups.md)
- [action_servicenow_create_access_ticket](/tools/action-servicenow-create-access-ticket.md)

## Entities that must be referenced

- hr_events
- employees
- role_templates
- peer_access_patterns
- access_provisions

## Forbidden behaviors

- do not provision without HR event
- do not invent group assignments

# Citations

- [identity-access-policy](/documents/identity-access-policy.md)
- [role-template-catalog](/documents/role-template-catalog.md)
