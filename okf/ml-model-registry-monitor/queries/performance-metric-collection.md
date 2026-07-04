---
type: Query Capability
title: "Track deployed model metrics from Vertex AI and MLflow: accuracy, precision, ..."
description: "Track deployed model metrics from Vertex AI and MLflow: accuracy, precision, recall, latency, and throughput. Compare against baseline performance recorded at deployment."
source_id: "performance-metric-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Track deployed model metrics from Vertex AI and MLflow: accuracy, precision, recall, latency, and throughput. Compare against baseline performance recorded at deployment.

## Tools used

- [query_mlflow_mlflow_records](/tools/query-mlflow-mlflow-records.md)
- [lookup_ml_model_registry_monitor_runbook](/tools/lookup-ml-model-registry-monitor-runbook.md)
- [action_mlflow_recommend](/tools/action-mlflow-recommend.md)

## Runs in

- [performance_metric_collection](/workflow/performance-metric-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the ML Model Registry & Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ml-model-registry-monitor-end-to-end.md)

# Citations

- [ML Model Registry & Monitor Operations Runbook](/documents/ml-model-registry-monitor-runbook.md)
