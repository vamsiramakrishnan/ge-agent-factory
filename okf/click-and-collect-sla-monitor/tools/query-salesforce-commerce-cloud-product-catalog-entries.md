---
type: Agent Tool
title: query_salesforce_commerce_cloud_product_catalog_entries
description: "Retrieve product catalog entries from Salesforce Commerce Cloud for the Click-and-Collect SLA Monitor workflow."
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

# query_salesforce_commerce_cloud_product_catalog_entries

Retrieve product catalog entries from Salesforce Commerce Cloud for the Click-and-Collect SLA Monitor workflow.

- **Kind:** query
- **Source system:** [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md)

## Inputs

- sku
- date_range

## Outputs

- product_catalog_entries_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [For store_number 1187, SKU 84021193 on order_number 512847390 is short_picked (pick_tasks task_number 3390221, pick_zone perishable_cooler). inventory_snapshots for store 1187 shows on_hand_units of -2 with negative_on_hand_flag true and safety_stock_units of 12. product_catalog_entries lists SKU 84021193's catalog_status as discontinued_online. The customer is waiting curbside -- what do you recommend?](/tests/click-and-collect-sla-monitor-discontinued-substitution.md)

## Evidence emitted

- source_system_record

## Required inputs

- sku
- date_range

## Produces

- product_catalog_entries_records

# Examples

```
query_salesforce_commerce_cloud_product_catalog_entries(sku=<sku>, date_range=<date_range>)
```

# Citations

- [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md)
