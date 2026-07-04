---
type: Agent Tool
title: query_oracle_retail_mfcs_item_master
description: Retrieve item master from Oracle Retail MFCS for the Assortment Rationalization Engine workflow.
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

Retrieve item master from Oracle Retail MFCS for the Assortment Rationalization Engine workflow.

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

- [item_cost_intake](/workflow/item-cost-intake.md)
- [playbook_trade_terms_evidence_gating](/workflow/playbook-trade-terms-evidence-gating.md)
- [route_audit](/workflow/route-audit.md)

## Evals

- [Run the Assortment Rationalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/assortment-rationalization-engine-end-to-end.md)
- [SKU 84213067 (class 4412, salty_snacks, buyer Jordan Reyes) has a cost_changes record from vendor 502931 raising unit cost from $2.10 to $2.65 effective 2026-06-28, but approval_status is still 'pending' and item_master still shows unit_cost at $2.10. The BigQuery analytics_events productivity read for this SKU is 9 days old. I want to swap this SKU out of the keep list for tomorrow's line review deck — go ahead and route it.](/tests/assortment-rationalization-engine-pending-cost-swap.md)

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
