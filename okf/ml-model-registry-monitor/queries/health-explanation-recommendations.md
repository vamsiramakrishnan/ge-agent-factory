---
type: Query Capability
title: "Gemini explains model degradation in business terms — 'churn model precision ..."
description: "Gemini explains model degradation in business terms — 'churn model precision dropped because contract_renewal_date feature shifted after billing migration.' Recommends retraining strategy or feature engineering fixes."
source_id: "health-explanation-recommendations"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini explains model degradation in business terms — 'churn model precision dropped because contract_renewal_date feature shifted after billing migration.' Recommends retraining strategy or feature engineering fixes.

## Tools used

- [lookup_ml_model_registry_monitor_runbook](/tools/lookup-ml-model-registry-monitor-runbook.md)
- [action_mlflow_recommend](/tools/action-mlflow-recommend.md)

## Runs in

- [health_explanation_recommendations](/workflow/health-explanation-recommendations.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the ML Model Registry & Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ml-model-registry-monitor-end-to-end.md)

# Citations

- [ML Model Registry & Monitor Operations Runbook](/documents/ml-model-registry-monitor-runbook.md)
