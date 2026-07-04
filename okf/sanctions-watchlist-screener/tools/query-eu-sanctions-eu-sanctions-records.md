---
type: Agent Tool
title: query_eu_sanctions_eu_sanctions_records
description: "Retrieve eu sanctions records from EU Sanctions for the Sanctions & Watchlist Screener workflow."
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

# query_eu_sanctions_eu_sanctions_records

Retrieve eu sanctions records from EU Sanctions for the Sanctions & Watchlist Screener workflow.

- **Kind:** query
- **Source system:** [EU Sanctions](/systems/eu-sanctions.md)

## Inputs

- lookup_key
- date_range

## Outputs

- eu_sanctions_records_records
- eu_sanctions_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [EU Sanctions](/systems/eu-sanctions.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [batch_event_screening](/workflow/batch-event-screening.md)
- [fuzzy_entity_matching](/workflow/fuzzy-entity-matching.md)

## Evals

- [Run the Sanctions & Watchlist Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sanctions-watchlist-screener-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- eu_sanctions_records_records
- eu_sanctions_records_summary

# Examples

```
query_eu_sanctions_eu_sanctions_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [EU Sanctions](/systems/eu-sanctions.md)
