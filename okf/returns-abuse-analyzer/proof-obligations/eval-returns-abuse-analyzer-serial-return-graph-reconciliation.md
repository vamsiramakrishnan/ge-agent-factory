---
type: Proof Obligation
title: "Golden eval obligation — Customer jane.doe@example.com filed return claims against online orders 483920175, 483920311, and 483920464 (combined order_total $612.45) within the past 30 days. Zendesk ticket #88213 tied to order 483920175 shows category 'billing', priority P2, and sla_met=false, with no product-defect notes on file. Build the cross-channel behavior graph and recommend whether to place a return hold on this account."
description: golden eval proof obligation
source_id: "eval-returns-abuse-analyzer-serial-return-graph-reconciliation"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Customer jane.doe@example.com filed return claims against online orders 483920175, 483920311, and 483920464 (combined order_total $612.45) within the past 30 days. Zendesk ticket #88213 tied to order 483920175 shows category 'billing', priority P2, and sla_met=false, with no product-defect notes on file. Build the cross-channel behavior graph and recommend whether to place a return hold on this account.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [returns-abuse-analyzer-serial-return-graph-reconciliation](/tests/returns-abuse-analyzer-serial-return-graph-reconciliation.md)


## Mechanisms

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_returns_abuse_analyzer_execution_playbook](/tools/lookup-returns-abuse-analyzer-execution-playbook.md)

## Entities that must be referenced

- online_orders
- tickets

## Forbidden behaviors

- auto-filing an account hold before Fraud Analyst review
- ignoring the open billing ticket's SLA breach when scoring the claim

# Citations

- [returns-abuse-analyzer-execution-playbook](/documents/returns-abuse-analyzer-execution-playbook.md)
- [returns-abuse-analyzer-restocking-chargeback-bulletin](/documents/returns-abuse-analyzer-restocking-chargeback-bulletin.md)
