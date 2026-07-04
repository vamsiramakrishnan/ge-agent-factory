---
type: Query Capability
title: "Execute the approve step in Genesys Cloud CX with a full audit trail, and esc..."
description: "Execute the approve step in Genesys Cloud CX with a full audit trail, and escalate exceptions to the Retention Marketing Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the approve step in Genesys Cloud CX with a full audit trail, and escalate exceptions to the Retention Marketing Manager.

## Tools used

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [action_genesys_cloud_cx_approve](/tools/action-genesys-cloud-cx-approve.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Churn Save Desk Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/churn-save-desk-agent-end-to-end.md)

# Citations

- [Churn Save Desk Agent Service Assurance Runbook](/documents/churn-save-desk-agent-assurance-runbook.md)
