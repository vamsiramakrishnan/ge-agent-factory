---
type: Agent Tool
title: query_ofac_sdn_ofac_sdn_records
description: "Retrieve ofac sdn records from OFAC/SDN for the Sanctions & Watchlist Screener workflow."
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

# query_ofac_sdn_ofac_sdn_records

Retrieve ofac sdn records from OFAC/SDN for the Sanctions & Watchlist Screener workflow.

- **Kind:** query
- **Source system:** [OFAC/SDN](/systems/ofac-sdn.md)

## Inputs

- lookup_key
- date_range

## Outputs

- ofac_sdn_records_records
- ofac_sdn_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [OFAC/SDN](/systems/ofac-sdn.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [batch_event_screening](/workflow/batch-event-screening.md)

## Evals

- [Run the Sanctions & Watchlist Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sanctions-watchlist-screener-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- ofac_sdn_records_records
- ofac_sdn_records_summary

# Examples

```
query_ofac_sdn_ofac_sdn_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [OFAC/SDN](/systems/ofac-sdn.md)
