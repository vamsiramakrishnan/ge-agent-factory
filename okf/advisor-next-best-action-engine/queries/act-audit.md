---
type: Query Capability
title: Execute the recommend step in Salesforce Financial Services Cloud with a full...
description: "Execute the recommend step in Salesforce Financial Services Cloud with a full audit trail, and escalate exceptions to the Relationship Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the recommend step in Salesforce Financial Services Cloud with a full audit trail, and escalate exceptions to the Relationship Manager.

## Tools used

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [action_salesforce_financial_services_cloud_recommend](/tools/action-salesforce-financial-services-cloud-recommend.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Advisor Next Best Action Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/advisor-next-best-action-engine-end-to-end.md)

# Citations

- [Advisor Next Best Action Engine Banking Compliance Policy](/documents/advisor-next-best-action-engine-compliance-policy.md)
