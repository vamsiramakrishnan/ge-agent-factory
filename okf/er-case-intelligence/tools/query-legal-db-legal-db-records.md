---
type: Agent Tool
title: query_legal_db_legal_db_records
description: Retrieve legal db records from Legal DB for the ER Case Intelligence workflow.
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

# query_legal_db_legal_db_records

Retrieve legal db records from Legal DB for the ER Case Intelligence workflow.

- **Kind:** query
- **Source system:** [Legal DB](/systems/legal-db.md)

## Inputs

- lookup_key
- date_range

## Outputs

- legal_db_records_records
- legal_db_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Legal DB](/systems/legal-db.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the ER Case Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/er-case-intelligence-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- legal_db_records_records
- legal_db_records_summary

# Examples

```
query_legal_db_legal_db_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Legal DB](/systems/legal-db.md)
