---
type: Agent Tool
title: query_oracle_retail_mfcs_item_master
description: Retrieve item master from Oracle Retail MFCS for the New Item Launch Orchestrator workflow.
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

Retrieve item master from Oracle Retail MFCS for the New Item Launch Orchestrator workflow.

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

- [vendor_item_setup_intake](/workflow/vendor-item-setup-intake.md)
- [attribute_cost_validation_gate](/workflow/attribute-cost-validation-gate.md)
- [hierarchy_placement_gmroi_fit_check](/workflow/hierarchy-placement-gmroi-fit-check.md)
- [first_allocation_price_activation_publish](/workflow/first-allocation-price-activation-publish.md)
- [launch_readiness_scorecard_escalation](/workflow/launch-readiness-scorecard-escalation.md)

## Evals

- [Run the New Item Launch Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/new-item-launch-orchestrator-end-to-end.md)
- [Item SKU 48213077 (UPC 007123456789) was submitted by vendor 402981 for launch in department 'dairy_frozen' on 2026-07-18. cost_changes shows a pending new_unit_cost of $6.40 (up from $5.10, a 25.5% increase) effective 2026-07-10, but item_master still lists item_status as 'new' with unit_cost at $5.10 and base_retail unchanged at $8.99. Reconcile the cost discrepancy, tell me whether this vendor cost jump requires escalation, and confirm whether it's safe to publish to Oracle Retail MFCS.](/tests/new-item-launch-orchestrator-cost-reconciliation-edge.md)
- [Item SKU 51204488 launched in class 'small_appliances' three days ago in Oracle Retail MFCS with item_status 'new'. The confirmed ad-break date was 2026-07-01. Merchandising ops wants to know whether shelves will be stocked for the circular — check whether the first allocation has posted and confirm the item is GMROI-compliant against its class target before we let the ad run another week.](/tests/new-item-launch-orchestrator-allocation-gmroi-check.md)

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
