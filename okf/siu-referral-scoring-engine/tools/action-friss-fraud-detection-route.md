---
type: Agent Tool
title: action_friss_fraud_detection_route
description: Execute the route step in FRISS Fraud Detection after the agent has gathered evidence and validated escalation gates.
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

# action_friss_fraud_detection_route

Execute the route step in FRISS Fraud Detection after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [FRISS Fraud Detection](/systems/friss-fraud-detection.md)
- **API:** POST /api/friss_fraud_detection/route

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change FRISS Fraud Detection state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_friss_fraud_detection_route](/policies/confirmation-action-friss-fraud-detection-route.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [FRISS Fraud Detection](/systems/friss-fraud-detection.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [fnol_fraud_score_intake](/workflow/fnol-fraud-score-intake.md)
- [baseline_precision_trend_scoring](/workflow/baseline-precision-trend-scoring.md)
- [authority_gated_referral_route_decision](/workflow/authority-gated-referral-route-decision.md)

## Evals

- [Run the SIU Referral Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/siu-referral-scoring-engine-end-to-end.md)

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
action_friss_fraud_detection_route(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [FRISS Fraud Detection](/systems/friss-fraud-detection.md)
- [Confirmation policy — action_friss_fraud_detection_route](/policies/confirmation-action-friss-fraud-detection-route.md)
- [Idempotency policy — action_friss_fraud_detection_route](/policies/idempotency-action-friss-fraud-detection-route.md)
