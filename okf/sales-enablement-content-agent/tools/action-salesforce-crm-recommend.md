---
type: Agent Tool
title: action_salesforce_crm_recommend
description: Execute the recommend step in Salesforce CRM after the agent has gathered evidence and validated escalation gates.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_salesforce_crm_recommend

Execute the recommend step in Salesforce CRM after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Salesforce CRM](/systems/salesforce-crm.md)
- **API:** POST /api/salesforce_crm/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Salesforce CRM state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_salesforce_crm_recommend](/policies/confirmation-action-salesforce-crm-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce CRM](/systems/salesforce-crm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [deal_context_assembly](/workflow/deal-context-assembly.md)
- [contextual_matching](/workflow/contextual-matching.md)
- [delivery_tracking](/workflow/delivery-tracking.md)

## Evals

- [Run the Sales Enablement Content Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sales-enablement-content-agent-end-to-end.md)

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
action_salesforce_crm_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Salesforce CRM](/systems/salesforce-crm.md)
- [Confirmation policy — action_salesforce_crm_recommend](/policies/confirmation-action-salesforce-crm-recommend.md)
- [Idempotency policy — action_salesforce_crm_recommend](/policies/idempotency-action-salesforce-crm-recommend.md)
