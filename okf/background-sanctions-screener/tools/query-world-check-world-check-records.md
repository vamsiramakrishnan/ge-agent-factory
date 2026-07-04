---
type: Agent Tool
title: query_world_check_world_check_records
description: "Retrieve world check records from World-Check for the Background & Sanctions Screener workflow."
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

# query_world_check_world_check_records

Retrieve world check records from World-Check for the Background & Sanctions Screener workflow.

- **Kind:** query
- **Source system:** [World-Check](/systems/world-check.md)

## Inputs

- lookup_key
- date_range

## Outputs

- world_check_records_records
- world_check_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [World-Check](/systems/world-check.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [sanctions_watchlist_screening](/workflow/sanctions-watchlist-screening.md)

## Evals

- [Run the Background & Sanctions Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/background-sanctions-screener-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- world_check_records_records
- world_check_records_summary

# Examples

```
query_world_check_world_check_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [World-Check](/systems/world-check.md)
