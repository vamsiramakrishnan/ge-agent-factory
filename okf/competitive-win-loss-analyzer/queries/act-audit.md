---
type: Query Capability
title: Execute the recommend step in Salesforce Communications Cloud with a full aud...
description: "Execute the recommend step in Salesforce Communications Cloud with a full audit trail, and escalate exceptions to the Sales Operations Analyst."
source_id: "act-audit"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the recommend step in Salesforce Communications Cloud with a full audit trail, and escalate exceptions to the Sales Operations Analyst.

## Tools used

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [action_salesforce_communications_cloud_recommend](/tools/action-salesforce-communications-cloud-recommend.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Competitive Win-Loss Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/competitive-win-loss-analyzer-end-to-end.md)

# Citations

- [Competitive Win-Loss Analyzer Service Assurance Runbook](/documents/competitive-win-loss-analyzer-assurance-runbook.md)
