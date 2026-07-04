---
type: Agent Tool
title: query_bigquery_analytics_events
description: "Retrieve analytics events from BigQuery for the Competitive Win-Loss Analyzer workflow."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Competitive Win-Loss Analyzer workflow.

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

- [competitive_pricing_signal_scan](/workflow/competitive-pricing-signal-scan.md)

## Evals

- [Run the Competitive Win-Loss Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/competitive-win-loss-analyzer-end-to-end.md)
- [This week's briefing is due today (2026-07-04). The BigQuery analytics_events record for the fiber_1gig_wifi-vs-cable-overbuilder segment shows computed_at of 2026-06-29 — five days stale — while historical_metrics for the same period refreshed today. The computed competitive win rate for that segment lands at exactly 47.0%, right at the KPI target. Decide whether to publish the win-rate finding in this week's briefing or hold it, and document the evidence basis for your decision.](/tests/competitive-win-loss-analyzer-stale-evidence-threshold.md)

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
