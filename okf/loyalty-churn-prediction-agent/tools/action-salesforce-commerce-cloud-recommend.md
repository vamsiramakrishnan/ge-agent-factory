---
type: Agent Tool
title: action_salesforce_commerce_cloud_recommend
description: Execute the recommend step in Salesforce Commerce Cloud after the agent has gathered evidence and validated escalation gates.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_salesforce_commerce_cloud_recommend

Execute the recommend step in Salesforce Commerce Cloud after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md)
- **API:** POST /api/salesforce_commerce_cloud/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Salesforce Commerce Cloud state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_salesforce_commerce_cloud_recommend](/policies/confirmation-action-salesforce-commerce-cloud-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [validate_evidence](/workflow/validate-evidence.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Loyalty Churn Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/loyalty-churn-prediction-agent-end-to-end.md)

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
action_salesforce_commerce_cloud_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md)
- [Confirmation policy — action_salesforce_commerce_cloud_recommend](/policies/confirmation-action-salesforce-commerce-cloud-recommend.md)
- [Idempotency policy — action_salesforce_commerce_cloud_recommend](/policies/idempotency-action-salesforce-commerce-cloud-recommend.md)
