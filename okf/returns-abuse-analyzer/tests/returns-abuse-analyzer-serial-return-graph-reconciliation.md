---
type: Eval Scenario
title: "Customer jane.doe@example.com filed return claims against online orders 48392..."
description: "Customer jane.doe@example.com filed return claims against online orders 483920175, 483920311, and 483920464 (combined order_total $612.45) within the past 30 days. Zendesk ticket #88213 tied to order 483920175 shows category 'billing', priority P2, and sla_met=false, with no product-defect notes on file. Build the cross-channel behavior graph and recommend whether to place a return hold on this account."
source_id: "returns-abuse-analyzer-serial-return-graph-reconciliation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Customer jane.doe@example.com filed return claims against online orders 483920175, 483920311, and 483920464 (combined order_total $612.45) within the past 30 days. Zendesk ticket #88213 tied to order 483920175 shows category 'billing', priority P2, and sla_met=false, with no product-defect notes on file. Build the cross-channel behavior graph and recommend whether to place a return hold on this account.

## Validates

- [cross-channel-behavior-graph](/queries/cross-channel-behavior-graph.md)

## Mechanisms to call

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_returns_abuse_analyzer_execution_playbook](/tools/lookup-returns-abuse-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Returns Abuse Analyzer Retail Execution Playbook](/documents/returns-abuse-analyzer-execution-playbook.md)
- [Return Policy Disclosure & Chargeback Rights Compliance Bulletin](/documents/returns-abuse-analyzer-restocking-chargeback-bulletin.md)
