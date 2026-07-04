---
type: Agent Tool
title: calculation_tolerance_variance
description: "Compute price/quantity variance between invoice, PO, and GR; apply configured tolerance thresholds (rounding, variance percentage)."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# calculation_tolerance_variance

Compute price/quantity variance between invoice, PO, and GR; apply configured tolerance thresholds (rounding, variance percentage).

- **Kind:** calculation
- **Source system:** [SAP S/4HANA](/systems/sap-s4hana.md)

## Inputs

- invoice_amount
- po_amount
- gr_quantity
- po_quantity

## Outputs

- variance_amount
- variance_percentage
- tolerance_pass

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA](/systems/sap-s4hana.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [three_way_matching](/workflow/three-way-matching.md)
- [posting_payment_queue](/workflow/posting-payment-queue.md)

## Evals

- [Process invoice INV-2025-0042 (vendor GE Supplier XYZ, amount USD 15,000) against PO PO-2025-1001 and goods receipt GR-2025-5003. The invoice quantity matches GR quantity and amount is within 2% of PO.](/tests/happy-path-three-way-match.md)
- [Process invoice INV-2025-0043 (vendor GE Supplier ABC, amount USD 15,500) against PO PO-2025-1002 (PO amount USD 15,000). The price variance is 3.3%, exceeding the 2% tolerance.](/tests/tolerance-exception-escalation.md)

## Evidence emitted

- generated_audit_trail

## Required inputs

- invoice_amount
- po_amount
- gr_quantity
- po_quantity

## Produces

- variance_amount
- variance_percentage
- tolerance_pass

# Examples

```
calculation_tolerance_variance(invoice_amount=<invoice_amount>, po_amount=<po_amount>, gr_quantity=<gr_quantity>, po_quantity=<po_quantity>)
```

# Citations

- [SAP S/4HANA](/systems/sap-s4hana.md)
