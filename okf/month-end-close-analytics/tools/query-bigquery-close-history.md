---
type: Agent Tool
title: query_bigquery_close_history
description: "Retrieve historical close cycle data (cycle_id, target_days, actual_days, status) for 2+ years to compute trend."
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

# query_bigquery_close_history

Retrieve historical close cycle data (cycle_id, target_days, actual_days, status) for 2+ years to compute trend.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- lookback_months

## Outputs

- cycle_trend_data
- aggregated_metrics

## Side Effects

- May change BigQuery state because the spec classifies it as query.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — query_bigquery_close_history](/policies/confirmation-query-bigquery-close-history.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [close_metrics_aggregation](/workflow/close-metrics-aggregation.md)
- [bottleneck_trend_analysis](/workflow/bottleneck-trend-analysis.md)
- [retrospective_narrative](/workflow/retrospective-narrative.md)
- [dashboard_distribution](/workflow/dashboard-distribution.md)

## Evals

- [Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 days vs. a 7-day target. What bottleneck tasks delayed us, and what are your recommendations?](/tests/full-month-end-retrospective.md)
- [Show me the close cycle trend for the last 2 years.](/tests/insufficient-data-refusal.md)

## Evidence emitted

- sql_result

## Required inputs

- lookback_months

## Produces

- cycle_trend_data
- aggregated_metrics

# Examples

```
query_bigquery_close_history(lookback_months=<lookback_months>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
- [Confirmation policy — query_bigquery_close_history](/policies/confirmation-query-bigquery-close-history.md)
