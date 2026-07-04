---
type: Workflow Stage
title: Close Metrics Aggregation
description: "Aggregate task-level completion times, dependency wait times, and exception counts from the completed close cycle."
source_id: close_metrics_aggregation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Close Metrics Aggregation

Aggregate task-level completion times, dependency wait times, and exception counts from the completed close cycle.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_blackline_close_tasks](/tools/query-blackline-close-tasks.md)
- [query_blackline_task_dependencies](/tools/query-blackline-task-dependencies.md)
- [query_bigquery_close_history](/tools/query-bigquery-close-history.md)
- [query_bigquery_benchmark_metrics](/tools/query-bigquery-benchmark-metrics.md)
- [evidence_close_cycle_playbook](/tools/evidence-close-cycle-playbook.md)
- [evidence_close_acceleration_sop](/tools/evidence-close-acceleration-sop.md)

Next: [Bottleneck & Trend Analysis](/workflow/bottleneck-trend-analysis.md)
