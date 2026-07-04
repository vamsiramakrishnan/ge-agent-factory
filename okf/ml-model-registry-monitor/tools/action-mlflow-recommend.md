---
type: Agent Tool
title: action_mlflow_recommend
description: Execute the recommend step in MLflow after the agent has gathered evidence and validated escalation gates.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_mlflow_recommend

Execute the recommend step in MLflow after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [MLflow](/systems/mlflow.md)
- **API:** POST /api/mlflow/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change MLflow state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_mlflow_recommend](/policies/confirmation-action-mlflow-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [MLflow](/systems/mlflow.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [performance_metric_collection](/workflow/performance-metric-collection.md)
- [health_explanation_recommendations](/workflow/health-explanation-recommendations.md)

## Evals

- [Run the ML Model Registry & Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ml-model-registry-monitor-end-to-end.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

# Examples

```
action_mlflow_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [MLflow](/systems/mlflow.md)
- [Confirmation policy — action_mlflow_recommend](/policies/confirmation-action-mlflow-recommend.md)
- [Idempotency policy — action_mlflow_recommend](/policies/idempotency-action-mlflow-recommend.md)
