---
type: Workflow Stage
title: "Multi-System Provisioning"
description: "Provision access across Okta, Google Workspace, and all connected applications. Create ServiceNow ticket for audit trail. Request manager approval for elevated permissions."
source_id: multi_system_provisioning
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Multi-System Provisioning

Provision access across Okta, Google Workspace, and all connected applications. Create ServiceNow ticket for audit trail. Request manager approval for elevated permissions.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_okta_role_templates](/tools/query-okta-role-templates.md)
- [query_okta_user_groups](/tools/query-okta-user-groups.md)
- [query_google_workspace_group_memberships](/tools/query-google-workspace-group-memberships.md)
- [query_servicenow_access_requests](/tools/query-servicenow-access-requests.md)
- [query_bigquery_peer_access_patterns](/tools/query-bigquery-peer-access-patterns.md)
- [action_okta_provision_user_groups](/tools/action-okta-provision-user-groups.md)
- [action_google_workspace_assign_groups](/tools/action-google-workspace-assign-groups.md)
- [action_servicenow_create_access_ticket](/tools/action-servicenow-create-access-ticket.md)
- [evidence_identity_access_policy](/tools/evidence-identity-access-policy.md)
- [evidence_role_template_catalog](/tools/evidence-role-template-catalog.md)
