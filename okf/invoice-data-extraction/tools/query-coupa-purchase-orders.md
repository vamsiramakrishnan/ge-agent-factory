---
type: Agent Tool
title: query_coupa_purchase_orders
description: "Query Coupa for PO details matching invoice vendor and amount for three-way validation."
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

# query_coupa_purchase_orders

Query Coupa for PO details matching invoice vendor and amount for three-way validation.

- **Kind:** query
- **Source system:** [Coupa](/systems/coupa.md)

## Inputs

- vendor_id
- amount_range

## Outputs

- matching_pos
- po_line_items

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Coupa](/systems/coupa.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable.](/tests/clean-ocr-happy-path.md)

## Evidence emitted

- sql_result
- source_system_record

## Required inputs

- vendor_id
- amount_range

## Produces

- matching_pos
- po_line_items

# Examples

```
query_coupa_purchase_orders(vendor_id=<vendor_id>, amount_range=<amount_range>)
```

# Citations

- [Coupa](/systems/coupa.md)
