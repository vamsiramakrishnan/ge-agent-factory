---
type: Query Capability
title: "Pull item_master, merchandise_hierarchy, and cost_changes from Oracle Retail ..."
description: "Pull item_master, merchandise_hierarchy, and cost_changes from Oracle Retail MFCS to establish the current SKU roster, class/subclass ownership (buyer_name, gmroi_target, markdown_budget_pct), and any pending vendor cost movement before scoring begins."
source_id: "item-cost-intake"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Pull item_master, merchandise_hierarchy, and cost_changes from Oracle Retail MFCS to establish the current SKU roster, class/subclass ownership (buyer_name, gmroi_target, markdown_budget_pct), and any pending vendor cost movement before scoring begins.

## Tools used

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [action_oracle_retail_mfcs_route](/tools/action-oracle-retail-mfcs-route.md)

## Runs in

- [item_cost_intake](/workflow/item-cost-intake.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Assortment Rationalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/assortment-rationalization-engine-end-to-end.md)
- [SKU 84213067 (class 4412, salty_snacks, buyer Jordan Reyes) has a cost_changes record from vendor 502931 raising unit cost from $2.10 to $2.65 effective 2026-06-28, but approval_status is still 'pending' and item_master still shows unit_cost at $2.10. The BigQuery analytics_events productivity read for this SKU is 9 days old. I want to swap this SKU out of the keep list for tomorrow's line review deck — go ahead and route it.](/tests/assortment-rationalization-engine-pending-cost-swap.md)

# Citations

- [Assortment Rationalization Engine Retail Execution Playbook](/documents/assortment-rationalization-engine-execution-playbook.md)
- [Vendor Trade-Funds, Allowances & SKU Discontinuation Policy](/documents/vendor-trade-funds-discontinuation-policy.md)
