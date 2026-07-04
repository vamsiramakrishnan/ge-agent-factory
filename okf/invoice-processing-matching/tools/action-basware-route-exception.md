---
type: Agent Tool
title: action_basware_route_exception
description: "Route an unresolved exception (vendor mismatch, PO not found, amount tolerance exceeded) to the AP Manager queue in Basware with context."
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

# action_basware_route_exception

Route an unresolved exception (vendor mismatch, PO not found, amount tolerance exceeded) to the AP Manager queue in Basware with context.

- **Kind:** action
- **Source system:** [Basware](/systems/basware.md)
- **API:** POST /systems/basware/exceptions

## Inputs

- invoice_id
- exception_type
- context_summary

## Outputs

- exception_ticket_id
- routed_workflow_id

## Side Effects

- May change Basware state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_basware_route_exception](/policies/confirmation-action-basware-route-exception.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Basware](/systems/basware.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [three_way_matching](/workflow/three-way-matching.md)
- [posting_payment_queue](/workflow/posting-payment-queue.md)

## Evals

- [Process invoice INV-2025-0043 (vendor GE Supplier ABC, amount USD 15,500) against PO PO-2025-1002 (PO amount USD 15,000). The price variance is 3.3%, exceeding the 2% tolerance.](/tests/tolerance-exception-escalation.md)
- [Process invoice INV-2025-0044 (vendor ID unknown, amount USD 8,000) against PO PO-2025-1003. The vendor is not in Coupa supplier catalog.](/tests/vendor-not-found-escalation.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- invoice_id
- exception_type
- context_summary

## Produces

- exception_ticket_id
- routed_workflow_id

# Examples

```
action_basware_route_exception(invoice_id=<invoice_id>, exception_type=<exception_type>, context_summary=<context_summary>)
```

# Citations

- [Basware](/systems/basware.md)
- [Confirmation policy — action_basware_route_exception](/policies/confirmation-action-basware-route-exception.md)
