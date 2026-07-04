---
type: Proof Obligation
title: "Golden eval obligation — Run the ML Model Registry & Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-ml-model-registry-monitor-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the ML Model Registry & Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [ml-model-registry-monitor-end-to-end](/tests/ml-model-registry-monitor-end-to-end.md)


## Mechanisms

- [query_mlflow_mlflow_records](/tools/query-mlflow-mlflow-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_ml_model_registry_monitor_runbook](/tools/lookup-ml-model-registry-monitor-runbook.md)
- [action_mlflow_recommend](/tools/action-mlflow-recommend.md)

## Entities that must be referenced

- mlflow_records
- analytics_events
- alerts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [ml-model-registry-monitor-runbook](/documents/ml-model-registry-monitor-runbook.md)
