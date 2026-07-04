---
type: Query Capability
title: "Execute the route step in Genesys Cloud CX with a full audit trail, and escal..."
description: "Execute the route step in Genesys Cloud CX with a full audit trail, and escalate exceptions to the Care Team Lead."
source_id: "act-audit"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the route step in Genesys Cloud CX with a full audit trail, and escalate exceptions to the Care Team Lead.

## Tools used

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [action_genesys_cloud_cx_route](/tools/action-genesys-cloud-cx-route.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Complaint Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/complaint-root-cause-analyzer-end-to-end.md)

# Citations

- [Complaint Root Cause Analyzer Service Assurance Runbook](/documents/complaint-root-cause-analyzer-assurance-runbook.md)
