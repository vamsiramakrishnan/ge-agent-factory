---
type: Eval Scenario
title: "Run the ML Model Registry & Monitor workflow for the current period. Cite the..."
description: "Run the ML Model Registry & Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "ml-model-registry-monitor-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the ML Model Registry & Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [performance-metric-collection](/queries/performance-metric-collection.md)

## Mechanisms to call

- [query_mlflow_mlflow_records](/tools/query-mlflow-mlflow-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_ml_model_registry_monitor_runbook](/tools/lookup-ml-model-registry-monitor-runbook.md)
- [action_mlflow_recommend](/tools/action-mlflow-recommend.md)

## Success rubric

Action recommend executed against MLflow, with audit-trail entry and Data Platform Lead notified of outcomes.

# Citations

- [ML Model Registry & Monitor Operations Runbook](/documents/ml-model-registry-monitor-runbook.md)
