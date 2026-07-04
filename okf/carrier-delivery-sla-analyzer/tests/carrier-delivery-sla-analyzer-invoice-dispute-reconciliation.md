---
type: Eval Scenario
title: "Carrier XPO disputes a $1,850 late-delivery deduction on warehouse order #482..."
description: "Carrier XPO disputes a $1,850 late-delivery deduction on warehouse order #48213910 out of DC 12 (ship date 2026-06-18), claiming an on-time delivery. The only evidence in Manhattan Active WM right now is the warehouse_orders ship-date field — pick_tasks for that load hasn't synced yet. Before you reverse the deduction, check BigQuery analytics_events for DC 12's on-time trend this period and tell me whether we can adjudicate this claim now or need more evidence."
source_id: "carrier-delivery-sla-analyzer-invoice-dispute-reconciliation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Carrier XPO disputes a $1,850 late-delivery deduction on warehouse order #48213910 out of DC 12 (ship date 2026-06-18), claiming an on-time delivery. The only evidence in Manhattan Active WM right now is the warehouse_orders ship-date field — pick_tasks for that load hasn't synced yet. Before you reverse the deduction, check BigQuery analytics_events for DC 12's on-time trend this period and tell me whether we can adjudicate this claim now or need more evidence.

## Validates

- [carrier-scan-order-intake](/queries/carrier-scan-order-intake.md)

## Mechanisms to call

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_carrier_delivery_sla_analyzer_execution_playbook](/tools/lookup-carrier-delivery-sla-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Carrier Delivery SLA Analyzer Retail Execution Playbook](/documents/carrier-delivery-sla-analyzer-execution-playbook.md)
- [Carrier Rate Card & Claims Adjudication Policy](/documents/carrier-rate-claims-adjudication-policy.md)
