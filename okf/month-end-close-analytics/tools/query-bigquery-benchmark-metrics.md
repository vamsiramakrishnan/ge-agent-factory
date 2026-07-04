---
type: Agent Tool
title: query_bigquery_benchmark_metrics
description: "Query benchmark metrics and KPIs for close cycle performance comparison against industry standards or prior-year baseline."
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

# query_bigquery_benchmark_metrics

Query benchmark metrics and KPIs for close cycle performance comparison against industry standards or prior-year baseline.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- metric_type
- cycle_range

## Outputs

- benchmark_comparison
- variance_analysis

## Side Effects

- May change BigQuery state because the spec classifies it as query.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — query_bigquery_benchmark_metrics](/policies/confirmation-query-bigquery-benchmark-metrics.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [close_metrics_aggregation](/workflow/close-metrics-aggregation.md)

## Evals

- [Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 days vs. a 7-day target. What bottleneck tasks delayed us, and what are your recommendations?](/tests/full-month-end-retrospective.md)

## Evidence emitted

- sql_result

## Required inputs

- metric_type
- cycle_range

## Produces

- benchmark_comparison
- variance_analysis

# Examples

```
query_bigquery_benchmark_metrics(metric_type=<metric_type>, cycle_range=<cycle_range>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
- [Confirmation policy — query_bigquery_benchmark_metrics](/policies/confirmation-query-bigquery-benchmark-metrics.md)
