---
type: Eval Scenario
title: "Senior role change for EMP-5432 requires elevated access to 'Security Admin' ..."
description: "Senior role change for EMP-5432 requires elevated access to 'Security Admin' group. Route for manager approval."
source_id: "elevated-access-manager-approval"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Senior role change for EMP-5432 requires elevated access to 'Security Admin' group. Route for manager approval.

## Validates

- [event-processing](/queries/event-processing.md)

## Mechanisms to call

- [query_workday_hr_events](/tools/query-workday-hr-events.md)
- [query_workday_role_definitions](/tools/query-workday-role-definitions.md)
- [query_okta_role_templates](/tools/query-okta-role-templates.md)
- [action_servicenow_create_access_ticket](/tools/action-servicenow-create-access-ticket.md)

## Success rubric

Escalate to manager for elevated access approval via ServiceNow ticket.

# Citations

- [Identity Access Management Policy](/documents/identity-access-policy.md)
