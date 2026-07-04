---
type: Agent Tool
title: query_carta_carta_records
description: Retrieve carta records from Carta for the Equity Participant Communicator workflow.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_carta_carta_records

Retrieve carta records from Carta for the Equity Participant Communicator workflow.

- **Kind:** query
- **Source system:** [Carta](/systems/carta.md)

## Inputs

- lookup_key
- date_range

## Outputs

- carta_records_records
- carta_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Carta](/systems/carta.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [grant_data_sync](/workflow/grant-data-sync.md)

## Evals

- [Run the Equity Participant Communicator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/equity-participant-communicator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- carta_records_records
- carta_records_summary

# Examples

```
query_carta_carta_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Carta](/systems/carta.md)
