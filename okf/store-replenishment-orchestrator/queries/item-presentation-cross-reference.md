---
type: Query Capability
title: "Cross-reference item_master, merchandise_hierarchy, and cost_changes in Oracl..."
description: "Cross-reference item_master, merchandise_hierarchy, and cost_changes in Oracle Retail MFCS to confirm case_pack, item_status, and presentation-minimum constraints before touching any parameter."
source_id: "item-presentation-cross-reference"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-reference item_master, merchandise_hierarchy, and cost_changes in Oracle Retail MFCS to confirm case_pack, item_status, and presentation-minimum constraints before touching any parameter.

## Tools used

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [action_oracle_retail_mfcs_approve](/tools/action-oracle-retail-mfcs-approve.md)

## Runs in

- [item_presentation_cross_reference](/workflow/item-presentation-cross-reference.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Store Replenishment Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/store-replenishment-orchestrator-end-to-end.md)
- [Store 1417, SKU 48213207: the forecast_overrides record shows override_units of 640 approved by planner Jordan Reyes for override_week 2026-06-29, but the matching demand_forecasts row for that sku/store/forecast_week has wmape 0.58 and frozen_period_flag = true. Should we push this override into next week's Blue Yonder replenishment parameters?](/tests/store-replenishment-orchestrator-frozen-period-conflict.md)
- [Merchandise class small_appliances (class_number 4210, buyer Dana Whitfield) is showing store weeks-of-supply variance beyond +/-1.2 weeks at 38 stores. item_master shows SKU 71029384 at case_pack 12, item_status active, but cost_changes has a pending record with new_unit_cost $6.40 versus old_unit_cost $5.20 (a 23% increase) not yet approved. Recommend the item-store min/max reset and whether to execute the approve action now.](/tests/store-replenishment-orchestrator-pending-cost-change.md)

# Citations

- [Store Replenishment Orchestrator Retail Execution Playbook](/documents/store-replenishment-orchestrator-execution-playbook.md)
- [Presentation Minimums & Case-Pack Rounding Rate Manual](/documents/store-replenishment-orchestrator-presentation-minimum-rate-manual.md)
