---
type: Agent Tool
title: query_pub_sub_pub_sub_records
description: Retrieve pub sub records from Pub/Sub for the Integration Pattern Advisor workflow.
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

# query_pub_sub_pub_sub_records

Retrieve pub sub records from Pub/Sub for the Integration Pattern Advisor workflow.

- **Kind:** query
- **Source system:** [Pub/Sub](/systems/pub-sub.md)

## Inputs

- lookup_key
- date_range

## Outputs

- pub_sub_records_records
- pub_sub_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Pub/Sub](/systems/pub-sub.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [pattern_retrieval](/workflow/pattern-retrieval.md)

## Evals

- [Run the Integration Pattern Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/integration-pattern-advisor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- pub_sub_records_records
- pub_sub_records_summary

# Examples

```
query_pub_sub_pub_sub_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Pub/Sub](/systems/pub-sub.md)
