---
type: Agent Tool
title: action_revionics_price_optimization_recommend
description: Execute the recommend step in Revionics Price Optimization after the agent has gathered evidence and validated escalation gates.
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

# action_revionics_price_optimization_recommend

Execute the recommend step in Revionics Price Optimization after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Revionics Price Optimization](/systems/revionics-price-optimization.md)
- **API:** POST /api/revionics_price_optimization/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Revionics Price Optimization state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_revionics_price_optimization_recommend](/policies/confirmation-action-revionics-price-optimization-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Revionics Price Optimization](/systems/revionics-price-optimization.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [validate_evidence](/workflow/validate-evidence.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Competitive Price Response Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/competitive-price-response-agent-end-to-end.md)

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
action_revionics_price_optimization_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Revionics Price Optimization](/systems/revionics-price-optimization.md)
- [Confirmation policy — action_revionics_price_optimization_recommend](/policies/confirmation-action-revionics-price-optimization-recommend.md)
- [Idempotency policy — action_revionics_price_optimization_recommend](/policies/idempotency-action-revionics-price-optimization-recommend.md)
