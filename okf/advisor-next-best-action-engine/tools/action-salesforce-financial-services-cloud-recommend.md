---
type: Agent Tool
title: action_salesforce_financial_services_cloud_recommend
description: Execute the recommend step in Salesforce Financial Services Cloud after the agent has gathered evidence and validated escalation gates.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_salesforce_financial_services_cloud_recommend

Execute the recommend step in Salesforce Financial Services Cloud after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md)
- **API:** POST /api/salesforce_financial_services_cloud/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Salesforce Financial Services Cloud state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_salesforce_financial_services_cloud_recommend](/policies/confirmation-action-salesforce-financial-services-cloud-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [household_account_context_pull](/workflow/household-account-context-pull.md)
- [suitability_concentration_screen](/workflow/suitability-concentration-screen.md)
- [task_creation_escalation_audit](/workflow/task-creation-escalation-audit.md)

## Evals

- [Run the Advisor Next Best Action Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/advisor-next-best-action-engine-end-to-end.md)

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
action_salesforce_financial_services_cloud_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md)
- [Confirmation policy — action_salesforce_financial_services_cloud_recommend](/policies/confirmation-action-salesforce-financial-services-cloud-recommend.md)
- [Idempotency policy — action_salesforce_financial_services_cloud_recommend](/policies/idempotency-action-salesforce-financial-services-cloud-recommend.md)
