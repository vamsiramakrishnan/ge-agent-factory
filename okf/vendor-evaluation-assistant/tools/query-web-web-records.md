---
type: Agent Tool
title: query_web_web_records
description: Retrieve web records from Web for the Vendor Evaluation Assistant workflow.
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

# query_web_web_records

Retrieve web records from Web for the Vendor Evaluation Assistant workflow.

- **Kind:** query
- **Source system:** [Web](/systems/web.md)

## Inputs

- lookup_key
- date_range

## Outputs

- web_records_records
- web_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Web](/systems/web.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Vendor Evaluation Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-evaluation-assistant-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- web_records_records
- web_records_summary

# Examples

```
query_web_web_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Web](/systems/web.md)
