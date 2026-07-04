---
type: Eval Scenario
title: "Employee EMP-3210 is terminated. Revoke access from all groups and create com..."
description: "Employee EMP-3210 is terminated. Revoke access from all groups and create compliance audit ticket."
source_id: "termination-revocation-with-audit"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Employee EMP-3210 is terminated. Revoke access from all groups and create compliance audit ticket.

## Validates

- [multi-system-provisioning](/queries/multi-system-provisioning.md)

## Mechanisms to call

- [query_workday_hr_events](/tools/query-workday-hr-events.md)
- [query_okta_user_groups](/tools/query-okta-user-groups.md)
- [query_google_workspace_group_memberships](/tools/query-google-workspace-group-memberships.md)
- [action_servicenow_create_access_ticket](/tools/action-servicenow-create-access-ticket.md)

## Success rubric

Access revoked from all groups, ServiceNow ticket created for compliance audit trail.

# Citations

- [Identity Access Management Policy](/documents/identity-access-policy.md)
