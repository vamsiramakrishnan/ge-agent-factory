---
type: Agent Tool
title: query_gartner_api_gartner_api_records
description: "Retrieve gartner api records from Gartner API for the Technology Radar & Trend Scout workflow."
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

# query_gartner_api_gartner_api_records

Retrieve gartner api records from Gartner API for the Technology Radar & Trend Scout workflow.

- **Kind:** query
- **Source system:** [Gartner API](/systems/gartner-api.md)

## Inputs

- lookup_key
- date_range

## Outputs

- gartner_api_records_records
- gartner_api_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Gartner API](/systems/gartner-api.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [signal_collection](/workflow/signal-collection.md)

## Evals

- [Run the Technology Radar & Trend Scout workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/technology-radar-trend-scout-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- gartner_api_records_records
- gartner_api_records_summary

# Examples

```
query_gartner_api_gartner_api_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Gartner API](/systems/gartner-api.md)
