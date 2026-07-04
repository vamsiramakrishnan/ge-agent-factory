---
type: Agent Tool
title: query_engineering_drawings_engineering_drawings_records
description: Retrieve engineering drawings records from Engineering drawings for the Specification Standardization Agent workflow.
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

# query_engineering_drawings_engineering_drawings_records

Retrieve engineering drawings records from Engineering drawings for the Specification Standardization Agent workflow.

- **Kind:** query
- **Source system:** [Engineering drawings](/systems/engineering-drawings.md)

## Inputs

- lookup_key
- date_range

## Outputs

- engineering_drawings_records_records
- engineering_drawings_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Engineering drawings](/systems/engineering-drawings.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [spec_extraction](/workflow/spec-extraction.md)
- [equivalence_reasoning](/workflow/equivalence-reasoning.md)

## Evals

- [Run the Specification Standardization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/specification-standardization-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- engineering_drawings_records_records
- engineering_drawings_records_summary

# Examples

```
query_engineering_drawings_engineering_drawings_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Engineering drawings](/systems/engineering-drawings.md)
