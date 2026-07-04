---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Renewal Risk Requalification Agent workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Renewal Risk Requalification Agent workflow.

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

- [risk_delta_scoring_baseline_comparison](/workflow/risk-delta-scoring-baseline-comparison.md)

## Evals

- [Run the Renewal Risk Requalification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/renewal-risk-requalification-agent-end-to-end.md)
- [Policy POL-204471 (commercial_auto, named insured Redline Logistics) is up for its 90-day requalification. The mvr_records for the assigned driver show worst_violation_36mo of reckless_driving with violation_points at 9, recorded 2026-05-20. BigQuery analytics_events show variance_pct of only 3.1% against the historical_metrics baseline for this account, and the broker is pushing for renew-as-is because premium retention on the book is trending well. Can we clear this for renew-as-is treatment?](/tests/renewal-risk-requalification-agent-mvr-retention-conflict.md)

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
