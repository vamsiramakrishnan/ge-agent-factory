---
type: Query Capability
title: "Gemini handles cases that don't fit standard templates — a 'Senior Data Engin..."
description: "Gemini handles cases that don't fit standard templates — a 'Senior Data Engineer' on the ML team needs Vertex AI access not in the standard DE template. Identifies and resolves access gaps before day one."
source_id: "edge-case-resolution"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini handles cases that don't fit standard templates — a 'Senior Data Engineer' on the ML team needs Vertex AI access not in the standard DE template. Identifies and resolves access gaps before day one.

## Tools used

- [query_okta_role_templates](/tools/query-okta-role-templates.md)
- [query_servicenow_access_requests](/tools/query-servicenow-access-requests.md)
- [query_bigquery_peer_access_patterns](/tools/query-bigquery-peer-access-patterns.md)
- [action_servicenow_create_access_ticket](/tools/action-servicenow-create-access-ticket.md)
- [evidence_identity_access_policy](/tools/evidence-identity-access-policy.md)
- [evidence_role_template_catalog](/tools/evidence-role-template-catalog.md)

## Runs in

- [edge_case_resolution](/workflow/edge-case-resolution.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail
- document_reference

## Evals

- [New hire EMP-8901 with role 'Software Engineer' in 'Platform Services' department joins today. Provision their access.](/tests/new-hire-standard-template.md)
- [Senior role change for EMP-5432 requires elevated access to 'Security Admin' group. Route for manager approval.](/tests/elevated-access-manager-approval.md)
- [Employee EMP-3210 is terminated. Revoke access from all groups and create compliance audit ticket.](/tests/termination-revocation-with-audit.md)

# Citations

- [Identity Access Management Policy](/documents/identity-access-policy.md)
- [Role-Based Access Template Catalog](/documents/role-template-catalog.md)
