---
type: Agent Tool
title: query_d_b_d_b_records
description: "Retrieve d b records from D&B for the Vendor Master Data Manager workflow."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_d_b_d_b_records

Retrieve d b records from D&B for the Vendor Master Data Manager workflow.

- **Kind:** query
- **Source system:** [D&B](/systems/d-b.md)

## Inputs

- lookup_key
- date_range

## Outputs

- d_b_records_records
- d_b_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [D&B](/systems/d-b.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Vendor Master Data Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-master-data-manager-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- d_b_records_records
- d_b_records_summary

# Examples

```
query_d_b_d_b_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [D&B](/systems/d-b.md)
