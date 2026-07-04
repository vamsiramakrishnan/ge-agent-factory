---
type: Query Capability
title: "Execute the send step in Salesforce Commerce Cloud with a full audit trail, a..."
description: "Execute the send step in Salesforce Commerce Cloud with a full audit trail, and escalate exceptions to the Digital Marketing Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the send step in Salesforce Commerce Cloud with a full audit trail, and escalate exceptions to the Digital Marketing Manager.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [action_salesforce_commerce_cloud_send](/tools/action-salesforce-commerce-cloud-send.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Cart Abandonment Recovery Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cart-abandonment-recovery-orchestrator-end-to-end.md)

# Citations

- [Cart Abandonment Recovery Orchestrator Retail Execution Playbook](/documents/cart-abandonment-recovery-orchestrator-execution-playbook.md)
