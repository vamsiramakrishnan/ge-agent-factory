---
type: Agent Tool
title: query_sap_ariba_category_mgmt_suppliers
description: Retrieve suppliers from SAP Ariba Category Mgmt for the Category Strategy Generator workflow.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sap_ariba_category_mgmt_suppliers

Retrieve suppliers from SAP Ariba Category Mgmt for the Category Strategy Generator workflow.

- **Kind:** query
- **Source system:** [SAP Ariba Category Mgmt](/systems/sap-ariba-category-mgmt.md)

## Inputs

- lookup_key
- date_range

## Outputs

- suppliers_records
- suppliers_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP Ariba Category Mgmt](/systems/sap-ariba-category-mgmt.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [spend_aggregation](/workflow/spend-aggregation.md)
- [strategy_narrative_generation](/workflow/strategy-narrative-generation.md)
- [delivery_review](/workflow/delivery-review.md)

## Evals

- [Run the Category Strategy Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/category-strategy-generator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- suppliers_records
- suppliers_summary

# Examples

```
query_sap_ariba_category_mgmt_suppliers(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP Ariba Category Mgmt](/systems/sap-ariba-category-mgmt.md)
