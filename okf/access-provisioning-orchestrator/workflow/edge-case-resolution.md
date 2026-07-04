---
type: Workflow Stage
title: Edge Case Resolution
description: "Gemini handles cases that don't fit standard templates — a 'Senior Data Engineer' on the ML team needs Vertex AI access not in the standard DE template. Identifies and resolves access gaps before day one."
source_id: edge_case_resolution
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Edge Case Resolution

Gemini handles cases that don't fit standard templates — a 'Senior Data Engineer' on the ML team needs Vertex AI access not in the standard DE template. Identifies and resolves access gaps before day one.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_okta_role_templates](/tools/query-okta-role-templates.md)
- [query_servicenow_access_requests](/tools/query-servicenow-access-requests.md)
- [query_bigquery_peer_access_patterns](/tools/query-bigquery-peer-access-patterns.md)
- [action_servicenow_create_access_ticket](/tools/action-servicenow-create-access-ticket.md)
- [evidence_identity_access_policy](/tools/evidence-identity-access-policy.md)
- [evidence_role_template_catalog](/tools/evidence-role-template-catalog.md)

Next: [Multi-System Provisioning](/workflow/multi-system-provisioning.md)
