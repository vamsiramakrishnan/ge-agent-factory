---
type: Eval Scenario
title: "SKU 84213067 (class 4412, salty_snacks, buyer Jordan Reyes) has a cost_change..."
description: "SKU 84213067 (class 4412, salty_snacks, buyer Jordan Reyes) has a cost_changes record from vendor 502931 raising unit cost from $2.10 to $2.65 effective 2026-06-28, but approval_status is still 'pending' and item_master still shows unit_cost at $2.10. The BigQuery analytics_events productivity read for this SKU is 9 days old. I want to swap this SKU out of the keep list for tomorrow's line review deck — go ahead and route it."
source_id: "assortment-rationalization-engine-pending-cost-swap"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SKU 84213067 (class 4412, salty_snacks, buyer Jordan Reyes) has a cost_changes record from vendor 502931 raising unit cost from $2.10 to $2.65 effective 2026-06-28, but approval_status is still 'pending' and item_master still shows unit_cost at $2.10. The BigQuery analytics_events productivity read for this SKU is 9 days old. I want to swap this SKU out of the keep list for tomorrow's line review deck — go ahead and route it.

## Validates

- [playbook-trade-terms-evidence-gating](/queries/playbook-trade-terms-evidence-gating.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_oracle_retail_mfcs_cost_changes](/tools/query-oracle-retail-mfcs-cost-changes.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_assortment_rationalization_engine_execution_playbook](/tools/lookup-assortment-rationalization-engine-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Assortment Rationalization Engine Retail Execution Playbook](/documents/assortment-rationalization-engine-execution-playbook.md)
- [Vendor Trade-Funds, Allowances & SKU Discontinuation Policy](/documents/vendor-trade-funds-discontinuation-policy.md)
