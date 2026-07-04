---
type: Agent Tool
title: query_onetrust_onetrust_records
description: Retrieve onetrust records from OneTrust for the IT Control Testing Agent workflow.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_onetrust_onetrust_records

Retrieve onetrust records from OneTrust for the IT Control Testing Agent workflow.

- **Kind:** query
- **Source system:** [OneTrust](/systems/onetrust.md)

## Inputs

- lookup_key
- date_range

## Outputs

- onetrust_records_records
- onetrust_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [OneTrust](/systems/onetrust.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [test_planning_execution](/workflow/test-planning-execution.md)

## Evals

- [Run the IT Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/it-control-testing-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- onetrust_records_records
- onetrust_records_summary

# Examples

```
query_onetrust_onetrust_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [OneTrust](/systems/onetrust.md)
