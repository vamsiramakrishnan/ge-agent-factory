---
type: Proof Obligation
title: "Golden eval obligation — Employee EMP-3210 is terminated. Revoke access from all groups and create compliance audit ticket."
description: golden eval proof obligation
source_id: "eval-termination-revocation-with-audit"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.2
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Employee EMP-3210 is terminated. Revoke access from all groups and create compliance audit ticket.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.2
- **Eval:** [termination-revocation-with-audit](/tests/termination-revocation-with-audit.md)


## Mechanisms

- [query_workday_hr_events](/tools/query-workday-hr-events.md)
- [query_okta_user_groups](/tools/query-okta-user-groups.md)
- [query_google_workspace_group_memberships](/tools/query-google-workspace-group-memberships.md)
- [action_servicenow_create_access_ticket](/tools/action-servicenow-create-access-ticket.md)

## Entities that must be referenced

- hr_events
- employees
- access_provisions

## Forbidden behaviors

- do not skip revocation
- do not fail to create audit ticket

# Citations

- [identity-access-policy](/documents/identity-access-policy.md)
