---
type: Agent Tool
title: query_google_analytics_4_session_events
description: Retrieve session events from Google Analytics 4 for the Content Performance Analyzer workflow.
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

# query_google_analytics_4_session_events

Retrieve session events from Google Analytics 4 for the Content Performance Analyzer workflow.

- **Kind:** query
- **Source system:** [Google Analytics 4](/systems/google-analytics-4.md)

## Inputs

- lookup_key
- date_range

## Outputs

- session_events_records
- session_events_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Analytics 4](/systems/google-analytics-4.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [data_aggregation](/workflow/data-aggregation.md)

## Evals

- [Run the Content Performance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/content-performance-analyzer-end-to-end.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- session_events_records
- session_events_summary

# Examples

```
query_google_analytics_4_session_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Analytics 4](/systems/google-analytics-4.md)
