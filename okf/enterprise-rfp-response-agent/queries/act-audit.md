---
type: Query Capability
title: Execute the route step in Salesforce Communications Cloud with a full audit t...
description: "Execute the route step in Salesforce Communications Cloud with a full audit trail, and escalate exceptions to the Bid Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the route step in Salesforce Communications Cloud with a full audit trail, and escalate exceptions to the Bid Manager.

## Tools used

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [action_salesforce_communications_cloud_route](/tools/action-salesforce-communications-cloud-route.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Enterprise RFP Response Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/enterprise-rfp-response-agent-end-to-end.md)

# Citations

- [Enterprise RFP Response Agent Service Assurance Runbook](/documents/enterprise-rfp-response-agent-assurance-runbook.md)
