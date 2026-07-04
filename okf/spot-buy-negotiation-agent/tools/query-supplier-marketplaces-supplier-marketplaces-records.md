---
type: Agent Tool
title: query_supplier_marketplaces_supplier_marketplaces_records
description: Retrieve supplier marketplaces records from Supplier marketplaces for the Spot Buy Negotiation Agent workflow.
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

# query_supplier_marketplaces_supplier_marketplaces_records

Retrieve supplier marketplaces records from Supplier marketplaces for the Spot Buy Negotiation Agent workflow.

- **Kind:** query
- **Source system:** [Supplier marketplaces](/systems/supplier-marketplaces.md)

## Inputs

- lookup_key
- date_range

## Outputs

- supplier_marketplaces_records_records
- supplier_marketplaces_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Supplier marketplaces](/systems/supplier-marketplaces.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [price_benchmarking](/workflow/price-benchmarking.md)
- [quote_negotiation](/workflow/quote-negotiation.md)
- [po_execution](/workflow/po-execution.md)

## Evals

- [Run the Spot Buy Negotiation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spot-buy-negotiation-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- supplier_marketplaces_records_records
- supplier_marketplaces_records_summary

# Examples

```
query_supplier_marketplaces_supplier_marketplaces_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Supplier marketplaces](/systems/supplier-marketplaces.md)
