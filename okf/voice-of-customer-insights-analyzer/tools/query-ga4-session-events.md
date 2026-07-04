---
type: Agent Tool
title: query_ga4_session_events
description: Retrieve session events from GA4 for the Voice of Customer Insights Analyzer workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_ga4_session_events

Retrieve session events from GA4 for the Voice of Customer Insights Analyzer workflow.

- **Kind:** query
- **Source system:** [GA4](/systems/ga4.md)

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

No explicit permission scopes declared; source-system access is tied to [GA4](/systems/ga4.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [analyze_detect](/workflow/analyze-detect.md)

## Evals

- [Run the Voice of Customer Insights Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/voice-of-customer-insights-analyzer-end-to-end.md)

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
query_ga4_session_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [GA4](/systems/ga4.md)
