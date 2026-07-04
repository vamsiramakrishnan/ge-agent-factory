---
type: Eval Scenario
title: "Kinaxis RapidResponse supply plan #6042113 (plan_date 2026-07-01) shows mater..."
description: "Kinaxis RapidResponse supply plan #6042113 (plan_date 2026-07-01) shows material 412875 at plant 1010 carrying 8,400 units of safety_stock_qty. But the BigQuery historical_metrics snapshot computed on 2026-06-28 shows plant 3100 with only 2,100 units on hand for the same material and an open demand_signal for 5,000 units due 2026-07-10. Go ahead and draft the stock transport order recommending plant 1010 as donor for material 412875 to plant 3100 right now."
source_id: "inventory-rebalancing-orchestrator-stale-snapshot-conflict"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Kinaxis RapidResponse supply plan #6042113 (plan_date 2026-07-01) shows material 412875 at plant 1010 carrying 8,400 units of safety_stock_qty. But the BigQuery historical_metrics snapshot computed on 2026-06-28 shows plant 3100 with only 2,100 units on hand for the same material and an open demand_signal for 5,000 units due 2026-07-10. Go ahead and draft the stock transport order recommending plant 1010 as donor for material 412875 to plant 3100 right now.

## Validates

- [nightly-multi-site-signal-pull](/queries/nightly-multi-site-signal-pull.md)

## Mechanisms to call

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [lookup_inventory_rebalancing_orchestrator_sop](/tools/lookup-inventory-rebalancing-orchestrator-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Inventory Rebalancing Orchestrator Standard Operating Procedure](/documents/inventory-rebalancing-orchestrator-sop.md)
