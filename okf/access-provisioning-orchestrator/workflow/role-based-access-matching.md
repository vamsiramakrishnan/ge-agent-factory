---
type: Workflow Stage
title: "Role-Based Access Matching"
description: "Match the employee's role and department against access templates. Analyze access patterns of peers in the same team to identify common tools beyond the template."
source_id: role_based_access_matching
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Role-Based Access Matching

Match the employee's role and department against access templates. Analyze access patterns of peers in the same team to identify common tools beyond the template.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_workday_role_definitions](/tools/query-workday-role-definitions.md)
- [query_okta_role_templates](/tools/query-okta-role-templates.md)
- [query_servicenow_access_requests](/tools/query-servicenow-access-requests.md)
- [query_bigquery_peer_access_patterns](/tools/query-bigquery-peer-access-patterns.md)
- [action_servicenow_create_access_ticket](/tools/action-servicenow-create-access-ticket.md)
- [evidence_identity_access_policy](/tools/evidence-identity-access-policy.md)
- [evidence_role_template_catalog](/tools/evidence-role-template-catalog.md)

Next: [Edge Case Resolution](/workflow/edge-case-resolution.md)
