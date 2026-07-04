---
type: Agent Tool
title: query_oracle_retail_mfcs_item_master
description: Retrieve item master from Oracle Retail MFCS for the Markdown Optimization Engine workflow.
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

Retrieve item master from Oracle Retail MFCS for the Markdown Optimization Engine workflow.

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

- [elasticity_zone_intake](/workflow/elasticity-zone-intake.md)
- [aging_inventory_detection](/workflow/aging-inventory-detection.md)
- [playbook_guardrail_validation](/workflow/playbook-guardrail-validation.md)
- [escalate_audit](/workflow/escalate-audit.md)

## Evals

- [Run the Markdown Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/markdown-optimization-engine-end-to-end.md)
- [SKU 48213076 in price_zone 17 shows a recommended_retail of $6.49 in price_recommendations dated 2026-06-28, but Oracle Retail MFCS logged a cost_changes record effective 2026-07-01 raising new_unit_cost from $4.10 to $6.85 for the same SKU due to a tariff_adjustment. Reconcile whether the markdown can still go out, and if not, tell me what to do.](/tests/markdown-optimization-engine-cost-vs-markdown-conflict.md)

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
