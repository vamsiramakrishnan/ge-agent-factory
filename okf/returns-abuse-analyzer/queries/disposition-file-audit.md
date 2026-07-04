---
type: Query Capability
title: Execute action_salesforce_commerce_cloud_file to record the disposition on th...
description: "Execute action_salesforce_commerce_cloud_file to record the disposition on the account with a full audit trail, and escalate exceptions to the Fraud Analyst per the escalation rules."
source_id: "disposition-file-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_salesforce_commerce_cloud_file to record the disposition on the account with a full audit trail, and escalate exceptions to the Fraud Analyst per the escalation rules.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [action_salesforce_commerce_cloud_file](/tools/action-salesforce-commerce-cloud-file.md)

## Runs in

- [disposition_file_audit](/workflow/disposition-file-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Returns Abuse Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/returns-abuse-analyzer-end-to-end.md)
- [Customer jane.doe@example.com filed return claims against online orders 483920175, 483920311, and 483920464 (combined order_total $612.45) within the past 30 days. Zendesk ticket #88213 tied to order 483920175 shows category 'billing', priority P2, and sla_met=false, with no product-defect notes on file. Build the cross-channel behavior graph and recommend whether to place a return hold on this account.](/tests/returns-abuse-analyzer-serial-return-graph-reconciliation.md)

# Citations

- [Returns Abuse Analyzer Retail Execution Playbook](/documents/returns-abuse-analyzer-execution-playbook.md)
- [Return Policy Disclosure & Chargeback Rights Compliance Bulletin](/documents/returns-abuse-analyzer-restocking-chargeback-bulletin.md)
