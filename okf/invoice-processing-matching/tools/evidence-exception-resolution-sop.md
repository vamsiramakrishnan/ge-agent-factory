---
type: Agent Tool
title: evidence_exception_resolution_sop
description: "Cite the Exception Resolution SOP for handling non-standard invoices, multi-currency, and partial delivery rules."
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

# evidence_exception_resolution_sop

Cite the Exception Resolution SOP for handling non-standard invoices, multi-currency, and partial delivery rules.

- **Kind:** evidence_lookup
- **Source system:** [Basware](/systems/basware.md)

## Inputs

- citation_anchor

## Outputs

- document_citation

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

- [three_way_matching](/workflow/three-way-matching.md)
- [posting_payment_queue](/workflow/posting-payment-queue.md)

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- document_reference

## Required inputs

- citation_anchor

## Produces

- document_citation

# Examples

```
evidence_exception_resolution_sop(citation_anchor=<citation_anchor>)
```

# Citations

- [Basware](/systems/basware.md)
