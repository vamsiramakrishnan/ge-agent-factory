---
type: Workflow Stage
title: "Health Explanation & Recommendations"
description: "Gemini explains model degradation in business terms — 'churn model precision dropped because contract_renewal_date feature shifted after billing migration.' Recommends retraining strategy or feature engineering fixes."
source_id: health_explanation_recommendations
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Health Explanation & Recommendations

Gemini explains model degradation in business terms — 'churn model precision dropped because contract_renewal_date feature shifted after billing migration.' Recommends retraining strategy or feature engineering fixes.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [lookup_ml_model_registry_monitor_runbook](/tools/lookup-ml-model-registry-monitor-runbook.md)
- [action_mlflow_recommend](/tools/action-mlflow-recommend.md)

Next: [Version Management](/workflow/version-management.md)
