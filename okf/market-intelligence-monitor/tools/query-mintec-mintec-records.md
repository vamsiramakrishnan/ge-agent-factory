---
type: Agent Tool
title: query_mintec_mintec_records
description: Retrieve mintec records from Mintec for the Market Intelligence Monitor workflow.
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

# query_mintec_mintec_records

Retrieve mintec records from Mintec for the Market Intelligence Monitor workflow.

- **Kind:** query
- **Source system:** [Mintec](/systems/mintec.md)

## Inputs

- lookup_key
- date_range

## Outputs

- mintec_records_records
- mintec_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Mintec](/systems/mintec.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [feed_ingestion_storage](/workflow/feed-ingestion-storage.md)

## Evals

- [Run the Market Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/market-intelligence-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- mintec_records_records
- mintec_records_summary

# Examples

```
query_mintec_mintec_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Mintec](/systems/mintec.md)
