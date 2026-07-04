---
type: Agent Tool
title: query_google_bigquery_analytics_events
description: Retrieve analytics events from Google BigQuery for the Succession Pipeline Dashboard Agent workflow.
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

# query_google_bigquery_analytics_events

Retrieve analytics events from Google BigQuery for the Succession Pipeline Dashboard Agent workflow.

- **Kind:** query
- **Source system:** [Google BigQuery](/systems/google-bigquery.md)

## Inputs

- lookup_key
- date_range

## Outputs

- analytics_events_records
- analytics_events_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google BigQuery](/systems/google-bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [pipeline_data_sync](/workflow/pipeline-data-sync.md)

## Evals

- [Run the Succession Pipeline Dashboard Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/succession-pipeline-dashboard-agent-end-to-end.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- analytics_events_records
- analytics_events_summary

# Examples

```
query_google_bigquery_analytics_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google BigQuery](/systems/google-bigquery.md)
