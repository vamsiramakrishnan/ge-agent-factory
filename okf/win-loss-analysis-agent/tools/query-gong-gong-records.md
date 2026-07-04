---
type: Agent Tool
title: query_gong_gong_records
description: Retrieve gong records from Gong for the Win/Loss Analysis Agent workflow.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_gong_gong_records

Retrieve gong records from Gong for the Win/Loss Analysis Agent workflow.

- **Kind:** query
- **Source system:** [Gong](/systems/gong.md)

## Inputs

- lookup_key
- date_range

## Outputs

- gong_records_records
- gong_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Gong](/systems/gong.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [evidence_aggregation](/workflow/evidence-aggregation.md)
- [transcript_intelligence](/workflow/transcript-intelligence.md)

## Evals

- [Run the Win/Loss Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/win-loss-analysis-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- gong_records_records
- gong_records_summary

# Examples

```
query_gong_gong_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Gong](/systems/gong.md)
