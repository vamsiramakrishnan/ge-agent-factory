---
type: Agent Tool
title: query_lexisnexis_lexisnexis_records
description: "Retrieve lexisnexis records from LexisNexis for the Background & Sanctions Screener workflow."
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

# query_lexisnexis_lexisnexis_records

Retrieve lexisnexis records from LexisNexis for the Background & Sanctions Screener workflow.

- **Kind:** query
- **Source system:** [LexisNexis](/systems/lexisnexis.md)

## Inputs

- lookup_key
- date_range

## Outputs

- lexisnexis_records_records
- lexisnexis_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [LexisNexis](/systems/lexisnexis.md).

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

- lexisnexis_records_records
- lexisnexis_records_summary

# Examples

```
query_lexisnexis_lexisnexis_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [LexisNexis](/systems/lexisnexis.md)
