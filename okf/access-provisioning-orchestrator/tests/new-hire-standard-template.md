---
type: Eval Scenario
title: "New hire EMP-8901 with role 'Software Engineer' in 'Platform Services' depart..."
description: "New hire EMP-8901 with role 'Software Engineer' in 'Platform Services' department joins today. Provision their access."
source_id: "new-hire-standard-template"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# New hire EMP-8901 with role 'Software Engineer' in 'Platform Services' department joins today. Provision their access.

## Validates

- [event-processing](/queries/event-processing.md)

## Mechanisms to call

- [query_workday_hr_events](/tools/query-workday-hr-events.md)
- [query_workday_role_definitions](/tools/query-workday-role-definitions.md)
- [query_okta_role_templates](/tools/query-okta-role-templates.md)
- [query_bigquery_peer_access_patterns](/tools/query-bigquery-peer-access-patterns.md)
- [action_okta_provision_user_groups](/tools/action-okta-provision-user-groups.md)
- [action_google_workspace_assign_groups](/tools/action-google-workspace-assign-groups.md)
- [action_servicenow_create_access_ticket](/tools/action-servicenow-create-access-ticket.md)

## Success rubric

Employee provisioned to Okta groups, Google Workspace groups, and ServiceNow ticket created with full audit trail.

# Citations

- [Identity Access Management Policy](/documents/identity-access-policy.md)
- [Role-Based Access Template Catalog](/documents/role-template-catalog.md)
