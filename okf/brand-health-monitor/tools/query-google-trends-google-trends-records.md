---
type: Agent Tool
title: query_google_trends_google_trends_records
description: Retrieve google trends records from Google Trends for the Brand Health Monitor workflow.
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

# query_google_trends_google_trends_records

Retrieve google trends records from Google Trends for the Brand Health Monitor workflow.

- **Kind:** query
- **Source system:** [Google Trends](/systems/google-trends.md)

## Inputs

- lookup_key
- date_range

## Outputs

- google_trends_records_records
- google_trends_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Trends](/systems/google-trends.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [signal_aggregation](/workflow/signal-aggregation.md)
- [quantitative_analysis](/workflow/quantitative-analysis.md)

## Evals

- [Run the Brand Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/brand-health-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- google_trends_records_records
- google_trends_records_summary

# Examples

```
query_google_trends_google_trends_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Trends](/systems/google-trends.md)
