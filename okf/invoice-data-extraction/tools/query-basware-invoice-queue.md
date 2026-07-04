---
type: Agent Tool
title: query_basware_invoice_queue
description: Poll Basware invoice queue for invoices pending extraction and processing.
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

# query_basware_invoice_queue

Poll Basware invoice queue for invoices pending extraction and processing.

- **Kind:** query
- **Source system:** [Basware](/systems/basware.md)

## Inputs

- queue_status

## Outputs

- pending_invoices

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Basware](/systems/basware.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [invoice_ingestion_classification](/workflow/invoice-ingestion-classification.md)
- [llm_interpretation_entity_resolution](/workflow/llm-interpretation-entity-resolution.md)
- [validation_posting](/workflow/validation-posting.md)

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- queue_status

## Produces

- pending_invoices

# Examples

```
query_basware_invoice_queue(queue_status=<queue_status>)
```

# Citations

- [Basware](/systems/basware.md)
