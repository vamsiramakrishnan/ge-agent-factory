---
type: Workflow Stage
title: Event Processing
description: "Receive HR lifecycle event from Workday — new hire (with role, department, team, start date), role change (old/new role), or termination. Determine access action type."
source_id: event_processing
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Event Processing

Receive HR lifecycle event from Workday — new hire (with role, department, team, start date), role change (old/new role), or termination. Determine access action type.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_workday_hr_events](/tools/query-workday-hr-events.md)
- [query_workday_role_definitions](/tools/query-workday-role-definitions.md)
- [query_okta_role_templates](/tools/query-okta-role-templates.md)
- [query_servicenow_access_requests](/tools/query-servicenow-access-requests.md)
- [query_bigquery_peer_access_patterns](/tools/query-bigquery-peer-access-patterns.md)
- [action_servicenow_create_access_ticket](/tools/action-servicenow-create-access-ticket.md)
- [evidence_identity_access_policy](/tools/evidence-identity-access-policy.md)
- [evidence_role_template_catalog](/tools/evidence-role-template-catalog.md)

Next: [Role-Based Access Matching](/workflow/role-based-access-matching.md)
