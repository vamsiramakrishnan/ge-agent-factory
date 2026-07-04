---
type: Agent Tool
title: query_revpro_zuora_revpro_zuora_records
description: Retrieve revpro zuora records from RevPro/Zuora for the Revenue Recognition Engine workflow.
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

# query_revpro_zuora_revpro_zuora_records

Retrieve revpro zuora records from RevPro/Zuora for the Revenue Recognition Engine workflow.

- **Kind:** query
- **Source system:** [RevPro/Zuora](/systems/revpro-zuora.md)

## Inputs

- lookup_key
- date_range

## Outputs

- revpro_zuora_records_records
- revpro_zuora_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [RevPro/Zuora](/systems/revpro-zuora.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Revenue Recognition Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/revenue-recognition-engine-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- revpro_zuora_records_records
- revpro_zuora_records_summary

# Examples

```
query_revpro_zuora_revpro_zuora_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [RevPro/Zuora](/systems/revpro-zuora.md)
