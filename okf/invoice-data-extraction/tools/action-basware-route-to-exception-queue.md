---
type: Agent Tool
title: action_basware_route_to_exception_queue
description: "Route low-confidence or unmatched invoices to Basware exception queue for manual AP review."
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

# action_basware_route_to_exception_queue

Route low-confidence or unmatched invoices to Basware exception queue for manual AP review.

- **Kind:** action
- **Source system:** [Basware](/systems/basware.md)
- **API:** POST /systems/basware/exception-queue

## Inputs

- invoice_id
- exception_reason

## Outputs

- exception_queue_id

## Side Effects

- May change Basware state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_basware_route_to_exception_queue](/policies/confirmation-action-basware-route-to-exception-queue.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Basware](/systems/basware.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [invoice_ingestion_classification](/workflow/invoice-ingestion-classification.md)
- [ocr_extraction_confidence_scoring](/workflow/ocr-extraction-confidence-scoring.md)
- [validation_posting](/workflow/validation-posting.md)

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- invoice_id
- exception_reason

## Produces

- exception_queue_id

# Examples

```
action_basware_route_to_exception_queue(invoice_id=<invoice_id>, exception_reason=<exception_reason>)
```

# Citations

- [Basware](/systems/basware.md)
- [Confirmation policy — action_basware_route_to_exception_queue](/policies/confirmation-action-basware-route-to-exception-queue.md)
