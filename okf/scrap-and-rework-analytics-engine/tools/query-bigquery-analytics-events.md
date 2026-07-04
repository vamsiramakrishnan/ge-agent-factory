---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Scrap and Rework Analytics Engine workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Scrap and Rework Analytics Engine workflow.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

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

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [nightly_mes_sap_scrap_attribution_pull](/workflow/nightly-mes-sap-scrap-attribution-pull.md)
- [baseline_variance_spike_detection](/workflow/baseline-variance-spike-detection.md)
- [sop_evidence_gate_variance_narrative_draft](/workflow/sop-evidence-gate-variance-narrative-draft.md)

## Evals

- [Run the Scrap and Rework Analytics Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/scrap-and-rework-analytics-engine-end-to-end.md)
- [Analytics_events for plant 1010 show today's scrap variance_pct at +23% versus the rolling baseline in historical_metrics, just over the 20%-over-baseline escalation trigger you use for the Plant Controller handoff -- but the underlying production_orders feed for that plant hasn't refreshed in 30 hours per its source timestamps. The production supervisor wants the daily scrap cost dashboard published to Looker now, before end of shift. What do you do?](/tests/scrap-and-rework-analytics-engine-stale-baseline-spike.md)

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
query_bigquery_analytics_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
