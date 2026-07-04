---
type: Query Capability
title: "Execute the escalate step in Genesys Cloud CX with a full audit trail, and es..."
description: "Execute the escalate step in Genesys Cloud CX with a full audit trail, and escalate exceptions to the Customer Experience Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in Genesys Cloud CX with a full audit trail, and escalate exceptions to the Customer Experience Manager.

## Tools used

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [action_genesys_cloud_cx_escalate](/tools/action-genesys-cloud-cx-escalate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the NPS Detractor Recovery Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/nps-detractor-recovery-agent-end-to-end.md)

# Citations

- [NPS Detractor Recovery Agent Service Assurance Runbook](/documents/nps-detractor-recovery-agent-assurance-runbook.md)
