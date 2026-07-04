---
type: Query Capability
title: Execute the escalate step in Salesforce Commerce Cloud with a full audit trai...
description: "Execute the escalate step in Salesforce Commerce Cloud with a full audit trail, and escalate exceptions to the Fulfillment Operations Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in Salesforce Commerce Cloud with a full audit trail, and escalate exceptions to the Fulfillment Operations Manager.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [action_salesforce_commerce_cloud_escalate](/tools/action-salesforce-commerce-cloud-escalate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Click-and-Collect SLA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/click-and-collect-sla-monitor-end-to-end.md)

# Citations

- [Click-and-Collect SLA Monitor Retail Execution Playbook](/documents/click-and-collect-sla-monitor-execution-playbook.md)
