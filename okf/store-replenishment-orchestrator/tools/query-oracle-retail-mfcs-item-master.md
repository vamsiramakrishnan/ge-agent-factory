---
type: Agent Tool
title: query_oracle_retail_mfcs_item_master
description: Retrieve item master from Oracle Retail MFCS for the Store Replenishment Orchestrator workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_oracle_retail_mfcs_item_master

Retrieve item master from Oracle Retail MFCS for the Store Replenishment Orchestrator workflow.

- **Kind:** query
- **Source system:** [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md)

## Inputs

- sku
- upc
- date_range

## Outputs

- item_master_records
- item_master_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [item_presentation_cross_reference](/workflow/item-presentation-cross-reference.md)
- [playbook_rate_manual_gate](/workflow/playbook-rate-manual-gate.md)
- [parameter_push_audit](/workflow/parameter-push-audit.md)

## Evals

- [Run the Store Replenishment Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/store-replenishment-orchestrator-end-to-end.md)
- [Store 1417, SKU 48213207: the forecast_overrides record shows override_units of 640 approved by planner Jordan Reyes for override_week 2026-06-29, but the matching demand_forecasts row for that sku/store/forecast_week has wmape 0.58 and frozen_period_flag = true. Should we push this override into next week's Blue Yonder replenishment parameters?](/tests/store-replenishment-orchestrator-frozen-period-conflict.md)
- [Merchandise class small_appliances (class_number 4210, buyer Dana Whitfield) is showing store weeks-of-supply variance beyond +/-1.2 weeks at 38 stores. item_master shows SKU 71029384 at case_pack 12, item_status active, but cost_changes has a pending record with new_unit_cost $6.40 versus old_unit_cost $5.20 (a 23% increase) not yet approved. Recommend the item-store min/max reset and whether to execute the approve action now.](/tests/store-replenishment-orchestrator-pending-cost-change.md)

## Evidence emitted

- source_system_record

## Required inputs

- sku
- upc
- date_range

## Produces

- item_master_records
- item_master_summary

# Examples

```
query_oracle_retail_mfcs_item_master(sku=<sku>, upc=<upc>, date_range=<date_range>)
```

# Citations

- [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md)
