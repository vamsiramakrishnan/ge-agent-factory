---
type: Agent Tool
title: action_nice_actimize_recommend
description: Execute the recommend step in NICE Actimize after the agent has gathered evidence and validated escalation gates.
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

# action_nice_actimize_recommend

Execute the recommend step in NICE Actimize after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [NICE Actimize](/systems/nice-actimize.md)
- **API:** POST /api/nice_actimize/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change NICE Actimize state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_nice_actimize_recommend](/policies/confirmation-action-nice-actimize-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [NICE Actimize](/systems/nice-actimize.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [alert_to_outcome_reconciliation](/workflow/alert-to-outcome-reconciliation.md)
- [rule_change_proposal_actimize_deployment](/workflow/rule-change-proposal-actimize-deployment.md)

## Evals

- [Run the Fraud Rule Tuning Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fraud-rule-tuning-analyzer-end-to-end.md)

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
action_nice_actimize_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [NICE Actimize](/systems/nice-actimize.md)
- [Confirmation policy — action_nice_actimize_recommend](/policies/confirmation-action-nice-actimize-recommend.md)
- [Idempotency policy — action_nice_actimize_recommend](/policies/idempotency-action-nice-actimize-recommend.md)
